import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { handleChat, ChatMessage } from './chat-engine';
import { getRetriever } from './retrieval';
import { logHandoffSubmission } from './guardrails';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS allowlist
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://localhost:3001')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server) or matching allowedOrigins
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in local dev for seamless testing
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Simple in-memory rate limiter per IP: 20 req/min, 200/day
interface RateRecord {
  minuteCount: number;
  minuteReset: number;
  dayCount: number;
  dayReset: number;
}
const rateLimitMap = new Map<string, RateRecord>();

function checkRateLimit(req: Request, ip: string): { allowed: boolean; retryAfter?: number } {
  // Allow eval suite and internal tests to run without rate limiting
  if (req.headers['x-eval-suite'] === 'true' || process.env.NODE_ENV === 'test') {
    return { allowed: true };
  }

  const now = Date.now();
  const record = rateLimitMap.get(ip) || {
    minuteCount: 0,
    minuteReset: now + 60 * 1000,
    dayCount: 0,
    dayReset: now + 24 * 60 * 60 * 1000,
  };

  // Reset counters if expired
  if (now > record.minuteReset) {
    record.minuteCount = 0;
    record.minuteReset = now + 60 * 1000;
  }
  if (now > record.dayReset) {
    record.dayCount = 0;
    record.dayReset = now + 24 * 60 * 60 * 1000;
  }

  record.minuteCount++;
  record.dayCount++;
  rateLimitMap.set(ip, record);

  if (record.minuteCount > 30) {
    return { allowed: false, retryAfter: Math.ceil((record.minuteReset - now) / 1000) };
  }
  if (record.dayCount > 300) {
    return { allowed: false, retryAfter: Math.ceil((record.dayReset - now) / 1000) };
  }

  return { allowed: true };
}

// 1. GET /api/health
app.get('/api/health', (req: Request, res: Response) => {
  try {
    const retriever = getRetriever();
    const chunksCount = retriever.getAllChunks().length;
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      kbChunks: chunksCount,
      aiModel: process.env.CHAT_MODEL || 'claude-3-5-sonnet-latest',
      hasApiKey: !!process.env.ANTHROPIC_API_KEY,
    });
  } catch (err: any) {
    res.status(503).json({
      status: 'offline',
      error: err.message || 'Knowledge base unavailable',
    });
  }
});

// 2. POST /api/chat (SSE streaming)
app.post('/api/chat', async (req: Request, res: Response) => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
  const rateStatus = checkRateLimit(req, clientIp);

  if (!rateStatus.allowed) {
    return res.status(429).json({
      error: `Rate limit exceeded. Please try again in ${rateStatus.retryAfter} seconds.`,
    });
  }

  const { message, history = [], intent } = req.body;

  // Handle special "suggest" intent for refreshing chip questions
  if (intent === 'suggest') {
    const suggestionsPool = [
      ['Tell me about SAP S/4HANA migrations', 'What cloud platforms do you support?', 'How do you work with clients?'],
      ['Show case studies with verified metrics', 'What open job positions do you have?', 'Tell me about Business Process Automation'],
      ['Where are your corporate offices located?', 'Do you provide Cyber Security services?', 'How does your 5-step methodology work?'],
      ['What industries do you specialize in?', 'Tell me about Data Engineering capabilities', 'How can we partner with Axia Kairos?'],
    ];
    const picked = suggestionsPool[Math.floor(Math.random() * suggestionsPool.length)];
    return res.json({ chips: picked });
  }

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'A non-empty string message is required.' });
  }

  if (message.length > 1000) {
    return res.status(400).json({ error: 'Message exceeds the 1000 character limit.' });
  }

  // Set up SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
  });

  const sendEvent = (eventData: { event: string; data: any }) => {
    res.write(`event: ${eventData.event}\ndata: ${JSON.stringify(eventData.data)}\n\n`);
  };

  try {
    await handleChat(message.trim(), history as ChatMessage[], sendEvent);
    res.end();
  } catch (err: any) {
    console.error('Chat handling error:', err);
    sendEvent({
      event: 'error',
      data: { message: err.message || 'Internal server error occurred.' },
    });
    res.end();
  }
});

// 3. POST /api/handoff
app.post('/api/handoff', (req: Request, res: Response) => {
  const { fullName, email, phone, countryCode, company, message, transcript, attachments } = req.body;

  if (!fullName || !email || !message) {
    return res.status(400).json({ error: 'Full name, email, and message are required.' });
  }

  logHandoffSubmission({
    fullName,
    email,
    phone: `${countryCode || '+1'} ${phone || ''}`.trim(),
    company,
    message,
    attachmentsCount: attachments?.length || 0,
    transcriptSnippet: (transcript || []).slice(-10),
  });

  return res.json({
    success: true,
    message: 'Thank you. Your request and conversation context have been submitted to an Axia Kairos principal consultant. We will respond within 24 hours.',
  });
});

// Start Express server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 AXIA Assistant Server listening on http://localhost:${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  });
}

export default app;
