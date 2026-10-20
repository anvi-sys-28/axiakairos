import fs from 'fs';
import path from 'path';
import { VALID_INTERNAL_ROUTES } from '../server/guardrails';

interface TestCase {
  id: string;
  category: string;
  question: string;
  mustMention: string[];
  expectedSources: string[];
  mustNotMention?: string[];
  expectHandoff?: boolean;
}

interface TestResult {
  id: string;
  category: string;
  passed: boolean;
  question: string;
  answerSnippet: string;
  errors: string[];
}

const EVAL_ENDPOINT = process.env.EVAL_ENDPOINT || 'http://localhost:3001/api/chat';

async function queryChatbotSSE(question: string): Promise<{
  text: string;
  cards: any[];
  chips: string[];
  sources: Array<{ title: string; url: string }>;
  isHandoff: boolean;
}> {
  const response = await fetch(EVAL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
      'x-eval-suite': 'true',
    },
    body: JSON.stringify({
      message: question,
      history: [],
    }),
  });

  if (!response.ok) {
    throw new Error(`Chatbot returned HTTP ${response.status}: ${response.statusText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('No readable stream response from /api/chat');
  }

  const decoder = new TextDecoder();
  let buffer = '';
  let fullText = '';
  let cards: any[] = [];
  let chips: string[] = [];
  let sources: Array<{ title: string; url: string }> = [];
  let isHandoff = false;

  let currentEvent = 'message';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      if (trimmed.startsWith('event:')) {
        currentEvent = trimmed.replace('event:', '').trim();
      } else if (trimmed.startsWith('data:')) {
        const dataStr = trimmed.replace('data:', '').trim();
        try {
          const payload = JSON.parse(dataStr);
          if (currentEvent === 'token') {
            fullText += typeof payload === 'string' ? payload : (payload.token || String(payload));
          } else if (currentEvent === 'cards') {
            cards = Array.isArray(payload) ? payload : (payload.cards || []);
          } else if (currentEvent === 'chips') {
            chips = Array.isArray(payload) ? payload : (payload.chips || []);
          } else if (currentEvent === 'sources') {
            sources = Array.isArray(payload) ? payload : (payload.sources || []);
          } else if (currentEvent === 'form') {
            isHandoff = true;
          }
        } catch {
          // Plain text fallback
          if (currentEvent === 'token') {
            fullText += dataStr;
          }
        }
      }
    }
  }

  return { text: fullText.trim(), cards, chips, sources, isHandoff };
}

async function runEvaluation() {
  console.log('================================================================');
  console.log('🤖 AXIA ASSISTANT CHATBOT EVALUATION SUITE');
  console.log(`Endpoint: ${EVAL_ENDPOINT}`);
  console.log('================================================================\n');

  const evalPath = path.resolve('tests/chatbot-eval.json');
  if (!fs.existsSync(evalPath)) {
    console.error(`Error: ${evalPath} not found!`);
    process.exit(1);
  }

  const testCases: TestCase[] = JSON.parse(fs.readFileSync(evalPath, 'utf8'));
  console.log(`Loaded ${testCases.length} test cases across domains.\n`);

  const results: TestResult[] = [];
  const categoryStats: Record<string, { total: number; passed: number }> = {};

  let inventedUrlsCount = 0;

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    if (!categoryStats[tc.category]) {
      categoryStats[tc.category] = { total: 0, passed: 0 };
    }
    categoryStats[tc.category].total++;

    const errors: string[] = [];
    let text = '';
    let sources: Array<{ title: string; url: string }> = [];
    let isHandoff = false;

    try {
      const response = await queryChatbotSSE(tc.question);
      text = response.text;
      sources = response.sources;
      isHandoff = response.isHandoff;

      const textLower = text.toLowerCase();

      // 1. Check mustMention
      for (const mention of tc.mustMention) {
        if (!textLower.includes(mention.toLowerCase())) {
          errors.push(`Missing keyword: "${mention}"`);
        }
      }

      // 2. Check mustNotMention
      if (tc.mustNotMention) {
        for (const forbidden of tc.mustNotMention) {
          if (textLower.includes(forbidden.toLowerCase())) {
            errors.push(`Forbidden mention found: "${forbidden}"`);
          }
        }
      }

      // 3. Check expectedSources (if any)
      if (tc.expectedSources.length > 0) {
        const sourceUrls = sources.map((s) => s.url.toLowerCase());
        const matchedSource = tc.expectedSources.some(
          (expected) =>
            sourceUrls.includes(expected.toLowerCase()) ||
            textLower.includes(expected.toLowerCase())
        );
        if (!matchedSource) {
          errors.push(
            `Expected source from [${tc.expectedSources.join(', ')}], got [${sourceUrls.join(', ')}]`
          );
        }
      }

      // 4. Check handoff expectation
      if (tc.expectHandoff) {
        const handoffWording =
          isHandoff ||
          textLower.includes('inquiry form') ||
          textLower.includes('connect you') ||
          textLower.includes('engagement team') ||
          textLower.includes('principal advisors') ||
          textLower.includes('connect with our team');

        if (!handoffWording) {
          errors.push('Expected handoff trigger/form, but none occurred');
        }
      }

      // 5. Zero invented URLs check in markdown links and sources
      const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      let linkMatch: RegExpExecArray | null;
      while ((linkMatch = markdownLinkRegex.exec(text)) !== null) {
        const linkUrl = linkMatch[2].trim();
        if (linkUrl.startsWith('http')) {
          if (!linkUrl.includes('axiakairos.com')) {
            inventedUrlsCount++;
            errors.push(`Unauthorized external URL detected: ${linkUrl}`);
          }
        } else if (linkUrl.startsWith('/')) {
          if (!VALID_INTERNAL_ROUTES.has(linkUrl.toLowerCase())) {
            inventedUrlsCount++;
            errors.push(`Invented internal route detected in link: ${linkUrl}`);
          }
        }
      }

      for (const s of sources) {
        if (!VALID_INTERNAL_ROUTES.has(s.url.toLowerCase())) {
          inventedUrlsCount++;
          errors.push(`Invented source route: ${s.url}`);
        }
      }
    } catch (err: any) {
      errors.push(`Request failed: ${err.message}`);
    }

    const passed = errors.length === 0;
    if (passed) {
      categoryStats[tc.category].passed++;
    }

    results.push({
      id: tc.id,
      category: tc.category,
      passed,
      question: tc.question,
      answerSnippet: text.slice(0, 90).replace(/\n/g, ' '),
      errors,
    });

    const statusIcon = passed ? '✅' : '❌';
    console.log(
      `${statusIcon} [${tc.id}] [${tc.category.toUpperCase()}] ${tc.question.slice(0, 55)}...`
    );
    if (!passed) {
      console.log(`     ↳ Reason: ${errors.join(' | ')}`);
    }
  }

  // Summary Report
  console.log('\n================================================================');
  console.log('📊 EVALUATION SUMMARY BY CATEGORY');
  console.log('================================================================');

  let totalTests = 0;
  let totalPassed = 0;

  for (const [cat, stat] of Object.entries(categoryStats)) {
    const pct = ((stat.passed / stat.total) * 100).toFixed(1);
    console.log(
      `  • ${cat.padEnd(16)}: ${stat.passed} / ${stat.total} (${pct}%)`
    );
    totalTests += stat.total;
    totalPassed += stat.passed;
  }

  const overallPct = ((totalPassed / totalTests) * 100).toFixed(1);
  console.log('----------------------------------------------------------------');
  console.log(`TOTAL SCORE: ${totalPassed} / ${totalTests} passed (${overallPct}%)`);
  console.log(`INVENTED URLS: ${inventedUrlsCount} (Target: 0)`);
  console.log('================================================================\n');

  if (Number(overallPct) >= 95 && inventedUrlsCount === 0) {
    console.log('🎉 EVALUATION PASSED: Chatbot meets all accuracy, grounding, and safety targets!');
    process.exit(0);
  } else {
    console.error('❌ EVALUATION FAILED: Targets not met (>=95% pass rate and 0 invented URLs required).');
    process.exit(1);
  }
}

runEvaluation().catch((err) => {
  console.error('Evaluation run fatal error:', err);
  process.exit(1);
});
