import type { Message, HandoffPayload, CardItem, SourceItem } from './types';

function getApiBase(): string {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem('axia_backend_url');
    if (custom) return custom;
  }
  return (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
}

export interface HealthResponse {
  status: 'ok' | 'offline';
  timestamp?: string;
  kbChunks?: number;
  aiModel?: string;
}

export async function checkHealth(): Promise<HealthResponse> {
  try {
    const res = await fetch(`${getApiBase()}/api/health`);
    if (!res.ok) return { status: 'offline' };
    return await res.json();
  } catch {
    return { status: 'offline' };
  }
}

export async function fetchSuggestedChips(): Promise<string[]> {
  try {
    const res = await fetch(`${getApiBase()}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ intent: 'suggest' }),
    });
    if (!res.ok) throw new Error('Failed to fetch chips');
    const data = await res.json();
    return data.chips || [
      'Tell me about SAP services',
      'Show case studies',
      'How do you work with clients?',
    ];
  } catch {
    return [
      'What services do you offer?',
      'Show recent case studies',
      'Explore careers at Axia Kairos',
    ];
  }
}

export interface StreamChatHandlers {
  onToken: (token: string) => void;
  onCards: (cards: CardItem[]) => void;
  onChips: (chips: string[]) => void;
  onSources: (sources: SourceItem[]) => void;
  onForm: (formData: any) => void;
  onError: (errorMsg: string) => void;
  onDone: () => void;
}

export async function streamChat(
  message: string,
  history: Message[],
  handlers: StreamChatHandlers,
  signal?: AbortSignal
): Promise<void> {
  // Format history to minimal role & content
  const formattedHistory = history
    .filter((m) => m.parts.some((p) => p.type === 'text'))
    .map((m) => {
      const textPart = m.parts.find((p) => p.type === 'text');
      return {
        role: m.role,
        content: textPart ? (textPart as { type: 'text'; content: string }).content : '',
      };
    })
    .slice(-10);

  const res = await fetch(`${getApiBase()}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
    },
    body: JSON.stringify({
      message,
      history: formattedHistory,
    }),
    signal,
  });

  if (!res.ok) {
    if (res.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment before sending another question.');
    }
    const errText = await res.text().catch(() => '');
    throw new Error(errText || `Server returned error status ${res.status}`);
  }

  const reader = res.body?.getReader();
  if (!reader) {
    throw new Error('ReadableStream not supported by browser.');
  }

  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n\n');
    buffer = lines.pop() || '';

    for (const chunk of lines) {
      const trimmed = chunk.trim();
      if (!trimmed) continue;

      const eventMatch = trimmed.match(/^event:\s*(.+)$/m);
      const dataMatch = trimmed.match(/^data:\s*(.+)$/m);

      if (eventMatch && dataMatch) {
        const eventName = eventMatch[1].trim();
        try {
          const parsedData = JSON.parse(dataMatch[1].trim());

          switch (eventName) {
            case 'token':
              handlers.onToken(typeof parsedData === 'string' ? parsedData : String(parsedData));
              break;
            case 'cards':
              handlers.onCards(parsedData);
              break;
            case 'chips':
              handlers.onChips(parsedData);
              break;
            case 'sources':
              handlers.onSources(parsedData);
              break;
            case 'form':
              handlers.onForm(parsedData);
              break;
            case 'error':
              handlers.onError(parsedData.message || 'An error occurred.');
              break;
            case 'done':
              handlers.onDone();
              break;
          }
        } catch (e) {
          console.error('Failed to parse SSE payload:', dataMatch[1], e);
        }
      }
    }
  }

  handlers.onDone();
}

export async function submitHandoff(payload: HandoffPayload): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${getApiBase()}/api/handoff`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    throw new Error(errorText || `Handoff submission failed with status ${res.status}`);
  }

  return await res.json();
}

export async function sendFeedback(payload: {
  rating: 'up' | 'down';
  question: string;
  answerSnippet?: string;
  usedChunks?: string[];
}): Promise<void> {
  try {
    await fetch(`${getApiBase()}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.warn('Feedback send failed:', err);
  }
}
