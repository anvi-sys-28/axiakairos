export type Role = 'user' | 'assistant';

export interface CardItem {
  type: string;
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  url: string;
}

export interface SourceItem {
  title: string;
  url: string;
  chunkId: string;
}

export interface FormPartData {
  reason?: string;
  preselectedFiles?: File[];
  prefill?: {
    name?: string;
    email?: string;
    company?: string;
    message?: string;
  };
}

export type MessagePart =
  | { type: 'text'; content: string }
  | { type: 'cards'; items: CardItem[] }
  | { type: 'chips'; questions: string[] }
  | { type: 'sources'; sources: SourceItem[] }
  | { type: 'form'; data?: FormPartData };

export interface Message {
  id: string;
  role: Role;
  createdAt: number;
  parts: MessagePart[];
  feedback?: 'up' | 'down';
}

export interface AttachedFile {
  name: string;
  size: number;
  type: string;
  file?: File;
}

export interface HandoffPayload {
  fullName: string;
  email: string;
  countryCode: string;
  phone: string;
  company?: string;
  message: string;
  consent: boolean;
  attachments?: AttachedFile[];
  transcript?: Array<{ role: string; content: string }>;
}
