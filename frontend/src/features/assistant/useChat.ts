import { useReducer, useEffect, useRef, useCallback } from 'react';
import type { Message, MessagePart } from './types';
import { streamChat, checkHealth, fetchSuggestedChips, type HealthResponse } from './api';

const SESSION_STORAGE_KEY = 'axia_assistant_history_v1';

const INITIAL_GREETING =
  "Hi, I'm AXIA Assistant. Ask me about our services, case studies, industries, careers or how we work with clients.";

const DEFAULT_INITIAL_CHIPS = [
  'Tell me about SAP services',
  'Show case studies',
  'How do you work with clients?',
];

function createInitialMessages(): Message[] {
  return [
    {
      id: 'msg-welcome',
      role: 'assistant',
      createdAt: Date.now(),
      parts: [
        { type: 'text', content: INITIAL_GREETING },
        { type: 'chips', questions: DEFAULT_INITIAL_CHIPS },
      ],
    },
  ];
}

interface ChatState {
  messages: Message[];
  isStreaming: boolean;
  isOnline: boolean;
  healthChecked: boolean;
  error: string | null;
}

type ChatAction =
  | { type: 'SET_ONLINE'; payload: boolean }
  | { type: 'ADD_USER_MESSAGE'; payload: { id: string; text: string } }
  | { type: 'START_ASSISTANT_MESSAGE'; payload: { id: string } }
  | { type: 'APPEND_TOKEN'; payload: { messageId: string; token: string } }
  | { type: 'ADD_PART'; payload: { messageId: string; part: MessagePart } }
  | { type: 'SET_STREAMING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: { messageId: string; errorMsg: string } }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'SHOW_HANDOFF_FORM'; payload?: { reason?: string; preselectedFiles?: File[] } }
  | { type: 'SET_REFRESHED_CHIPS'; payload: { messageId: string; chips: string[] } };

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_ONLINE':
      return { ...state, isOnline: action.payload, healthChecked: true };

    case 'ADD_USER_MESSAGE': {
      const userMsg: Message = {
        id: action.payload.id,
        role: 'user',
        createdAt: Date.now(),
        parts: [{ type: 'text', content: action.payload.text }],
      };
      return {
        ...state,
        messages: [...state.messages, userMsg],
        error: null,
      };
    }

    case 'START_ASSISTANT_MESSAGE': {
      const assistantMsg: Message = {
        id: action.payload.id,
        role: 'assistant',
        createdAt: Date.now(),
        parts: [{ type: 'text', content: '' }],
      };
      return {
        ...state,
        isStreaming: true,
        messages: [...state.messages, assistantMsg],
      };
    }

    case 'APPEND_TOKEN': {
      const { messageId, token } = action.payload;
      const updated = state.messages.map((m) => {
        if (m.id !== messageId) return m;
        const parts = [...m.parts];
        const textIdx = parts.findIndex((p) => p.type === 'text');
        if (textIdx !== -1) {
          const currentText = (parts[textIdx] as { type: 'text'; content: string }).content;
          parts[textIdx] = { type: 'text', content: currentText + token };
        } else {
          parts.push({ type: 'text', content: token });
        }
        return { ...m, parts };
      });
      return { ...state, messages: updated };
    }

    case 'ADD_PART': {
      const { messageId, part } = action.payload;
      const updated = state.messages.map((m) => {
        if (m.id !== messageId) return m;
        return { ...m, parts: [...m.parts, part] };
      });
      return { ...state, messages: updated };
    }

    case 'SET_STREAMING':
      return { ...state, isStreaming: action.payload };

    case 'SET_ERROR': {
      const { messageId, errorMsg } = action.payload;
      const updated = state.messages.map((m) => {
        if (m.id !== messageId) return m;
        return {
          ...m,
          parts: [
            ...m.parts,
            {
              type: 'text' as const,
              content: `\n\n[Notice]: ${errorMsg}`,
            },
          ],
        };
      });
      return { ...state, messages: updated, isStreaming: false, error: errorMsg };
    }

    case 'CLEAR_MESSAGES': {
      const fresh = createInitialMessages();
      try {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      } catch {}
      return {
        ...state,
        messages: fresh,
        isStreaming: false,
        error: null,
      };
    }

    case 'SHOW_HANDOFF_FORM': {
      const formMsg: Message = {
        id: `handoff-${Date.now()}`,
        role: 'assistant',
        createdAt: Date.now(),
        parts: [
          {
            type: 'text',
            content: "I've opened our direct engagement form below. Please provide your contact details and message, and our principal advisors will follow up directly.",
          },
          {
            type: 'form',
            data: action.payload,
          },
        ],
      };
      return {
        ...state,
        messages: [...state.messages, formMsg],
      };
    }

    case 'SET_REFRESHED_CHIPS': {
      const { messageId, chips } = action.payload;
      const updated = state.messages.map((m) => {
        if (m.id !== messageId) return m;
        const filteredParts = m.parts.filter((p) => p.type !== 'chips');
        return { ...m, parts: [...filteredParts, { type: 'chips' as const, questions: chips }] };
      });
      return { ...state, messages: updated };
    }

    default:
      return state;
  }
}

export function useChat() {
  // Load initial messages from sessionStorage if present
  const getInitialState = (): ChatState => {
    try {
      const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return {
            messages: parsed,
            isStreaming: false,
            isOnline: true,
            healthChecked: false,
            error: null,
          };
        }
      }
    } catch {}
    return {
      messages: createInitialMessages(),
      isStreaming: false,
      isOnline: true,
      healthChecked: false,
      error: null,
    };
  };

  const [state, dispatch] = useReducer(chatReducer, undefined, getInitialState);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Sync to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state.messages));
    } catch {}
  }, [state.messages]);

  // Check backend health on mount
  useEffect(() => {
    let mounted = true;
    checkHealth().then((res: HealthResponse) => {
      if (mounted) {
        dispatch({ type: 'SET_ONLINE', payload: res.status === 'ok' });
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Send message handler
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || state.isStreaming) return;

      const userMsgId = `user-${Date.now()}`;
      dispatch({ type: 'ADD_USER_MESSAGE', payload: { id: userMsgId, text: text.trim() } });

      const assistantMsgId = `asst-${Date.now()}`;
      dispatch({ type: 'START_ASSISTANT_MESSAGE', payload: { id: assistantMsgId } });

      abortControllerRef.current = new AbortController();

      try {
        await streamChat(
          text.trim(),
          state.messages,
          {
            onToken: (token) => {
              dispatch({
                type: 'APPEND_TOKEN',
                payload: { messageId: assistantMsgId, token },
              });
            },
            onCards: (cards) => {
              dispatch({
                type: 'ADD_PART',
                payload: { messageId: assistantMsgId, part: { type: 'cards', items: cards } },
              });
            },
            onSources: (sources) => {
              dispatch({
                type: 'ADD_PART',
                payload: { messageId: assistantMsgId, part: { type: 'sources', sources } },
              });
            },
            onChips: (chips) => {
              dispatch({
                type: 'ADD_PART',
                payload: { messageId: assistantMsgId, part: { type: 'chips', questions: chips } },
              });
            },
            onForm: (formData) => {
              dispatch({
                type: 'ADD_PART',
                payload: { messageId: assistantMsgId, part: { type: 'form', data: formData } },
              });
            },
            onError: (errorMsg) => {
              dispatch({
                type: 'SET_ERROR',
                payload: { messageId: assistantMsgId, errorMsg },
              });
            },
            onDone: () => {
              dispatch({ type: 'SET_STREAMING', payload: false });
            },
          },
          abortControllerRef.current.signal
        );
      } catch (err: any) {
        if (err.name === 'AbortError') {
          console.log('[AXIA Assistant stream stopped by user]');
        } else {
          dispatch({
            type: 'SET_ERROR',
            payload: {
              messageId: assistantMsgId,
              errorMsg: err.message || 'Network communication error.',
            },
          });
        }
      } finally {
        dispatch({ type: 'SET_STREAMING', payload: false });
        abortControllerRef.current = null;
      }
    },
    [state.messages, state.isStreaming]
  );

  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      dispatch({ type: 'SET_STREAMING', payload: false });
    }
  }, []);

  const clearConversation = useCallback(() => {
    stopStreaming();
    dispatch({ type: 'CLEAR_MESSAGES' });
  }, [stopStreaming]);

  const openHandoff = useCallback(
    (reason?: string, preselectedFiles?: File[]) => {
      dispatch({
        type: 'SHOW_HANDOFF_FORM',
        payload: { reason, preselectedFiles },
      });
    },
    []
  );

  const refreshChips = useCallback(async (messageId: string) => {
    const newChips = await fetchSuggestedChips();
    dispatch({
      type: 'SET_REFRESHED_CHIPS',
      payload: { messageId, chips: newChips },
    });
  }, []);

  return {
    messages: state.messages,
    isStreaming: state.isStreaming,
    isOnline: state.isOnline,
    healthChecked: state.healthChecked,
    error: state.error,
    sendMessage,
    stopStreaming,
    clearConversation,
    openHandoff,
    refreshChips,
  };
}
