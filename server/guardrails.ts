import fs from 'fs';
import path from 'path';
import { Chunk } from './retrieval';

// Valid internal routes dynamically loaded from knowledge base + core navigation
function loadValidInternalRoutes(): Set<string> {
  const routes = new Set<string>([
    '/',
    '/about',
    '/services',
    '/case-studies',
    '/blogs',
    '/careers',
    '/industries',
    '/our-approach',
    '/products',
    '/contact',
    '/contact-us',
    '/assistant',
    '/privacy-policy',
    '/terms-and-conditions',
  ]);

  try {
    const kbPath = path.resolve('server/knowledge.json');
    if (fs.existsSync(kbPath)) {
      const kb = JSON.parse(fs.readFileSync(kbPath, 'utf8'));
      if (Array.isArray(kb.chunks)) {
        for (const c of kb.chunks) {
          if (c.url) routes.add(c.url.toLowerCase());
        }
      }
    }
  } catch (err) {
    console.warn('Could not read server/knowledge.json for valid routes:', err);
  }

  return routes;
}

export const VALID_INTERNAL_ROUTES = loadValidInternalRoutes();

/**
 * Validates and sanitizes URLs in the generated response.
 * External links or unauthorized internal URLs are replaced with safe fallback links.
 */
export function sanitizeUrls(text: string): string {
  // Replace markdown links [text](url)
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, linkText, url) => {
    // If it's a known valid internal route
    const cleanUrl = url.trim().toLowerCase().split('?')[0].split('#')[0];
    if (VALID_INTERNAL_ROUTES.has(cleanUrl)) {
      return `[${linkText}](${cleanUrl})`;
    }
    // If it's axia kairos domain with valid route
    if (cleanUrl.startsWith('https://axiakairos.com')) {
      const pathPart = cleanUrl.replace('https://axiakairos.com', '') || '/';
      if (VALID_INTERNAL_ROUTES.has(pathPart)) {
        return `[${linkText}](${pathPart})`;
      }
    }
    // Otherwise sanitize
    return linkText;
  });
}

/**
 * Guardrail check: Numeric and Entity Verification
 * Verifies that metrics, percentages, and prominent numbers in the response appear in the retrieved context.
 */
export function verifyNumericGroundedness(
  response: string,
  retrievedContextText: string
): { passed: boolean; ungroundedMetrics: string[] } {
  // Extract percentages, stats, and numbers like "99.99%", "38%", "4x", "128", "$10M"
  const metricRegex = /(?:\$\d+(?:\.\d+)?[MBKmbk]?|\b\d+(?:\.\d+)?%|\b\d+x\b|\b\d{2,}(?:,\d{3})*(?:\.\d+)?\b)/g;

  const matches = response.match(metricRegex) || [];
  const ungroundedMetrics: string[] = [];

  const contextLower = retrievedContextText.toLowerCase();

  for (const m of matches) {
    // Ignore small structural numbers (like 1, 2, 3, 4, 5 in lists or steps)
    if (/^[1-9]$/.test(m)) continue;
    // Ignore current year / common years
    if (m === '2025' || m === '2026' || m === '2024') continue;

    const cleanMetric = m.toLowerCase();
    if (!contextLower.includes(cleanMetric)) {
      ungroundedMetrics.push(m);
    }
  }

  return {
    passed: ungroundedMetrics.length === 0,
    ungroundedMetrics,
  };
}

/**
 * Appends an entry to server/logs/unanswered.jsonl for continuous KB improvement.
 */
export function logUnansweredQuestion(
  question: string,
  retrievedChunks: Chunk[]
): void {
  try {
    const logsDir = path.resolve(process.cwd(), 'server', 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    const logPath = path.resolve(logsDir, 'unanswered.jsonl');
    const entry = {
      timestamp: new Date().toISOString(),
      question,
      retrievedTopTitles: retrievedChunks.slice(0, 3).map((c) => c.title),
    };

    fs.appendFileSync(logPath, JSON.stringify(entry) + '\n', 'utf8');
  } catch (err) {
    console.error('Failed to log unanswered question:', err);
  }
}

/**
 * Appends a human handoff form submission to server/logs/handoffs.jsonl.
 */
export function logHandoffSubmission(payload: Record<string, any>): void {
  try {
    const logsDir = path.resolve(process.cwd(), 'server', 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    const logPath = path.resolve(logsDir, 'handoffs.jsonl');
    const entry = {
      timestamp: new Date().toISOString(),
      ...payload,
    };

    fs.appendFileSync(logPath, JSON.stringify(entry) + '\n', 'utf8');
  } catch (err) {
    console.error('Failed to log handoff submission:', err);
  }
}
