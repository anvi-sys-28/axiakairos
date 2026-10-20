import fs from 'fs';
import path from 'path';
import MiniSearch from 'minisearch';
import { fileURLToPath } from 'url';

export interface Chunk {
  id: string;
  type:
    | 'service'
    | 'case_study'
    | 'blog'
    | 'industry'
    | 'job'
    | 'about'
    | 'approach'
    | 'product'
    | 'contact'
    | 'legal';
  title: string;
  section: string;
  url: string;
  slug: string;
  text: string;
}

export interface StructuredRegistry {
  services: Array<{ slug: string; title: string; shortDescription: string; route: string; image: string }>;
  caseStudies: Array<{ slug: string; title: string; industry: string; date: string; summary: string; image: string; metrics: string[]; url: string }>;
  industries: Array<{ slug: string; title: string; description: string; url: string }>;
  blogs: Array<{ slug: string; title: string; date: string; readingTime: string; summary: string; url: string; coverImage: string }>;
  jobs: Array<{ slug: string; title: string; department: string; location: string; employmentType: string; experience?: string; summary: string; url: string }>;
  products: Array<{ slug: string; title: string; description: string; url: string }>;
  about: {
    title: string;
    tagline: string;
    overview: string;
    headquarters: string;
    locations: string[];
    focusAreas: string[];
    mission: string;
    vision: string;
    values: Array<{ name: string; description: string }>;
  };
  approach: {
    title: string;
    subtitle: string;
    frameworkPillars: Array<{ title: string; description: string }>;
    methodologySteps: Array<{ stepNumber: number; title: string; description: string; points: string[] }>;
    deliveryModels: Array<{ title: string; description: string }>;
  };
  contact: {
    title: string;
    subtitle: string;
    emails: Record<string, string>;
    phones: Record<string, string>;
    offices: Array<{ country: string; flag: string; region: string; status: string; note: string }>;
    noteOnStreetAddresses: string;
  };
  legal: {
    privacyPolicy: { title: string; lastUpdated: string; summary: string; url: string };
    termsAndConditions: { title: string; lastUpdated: string; summary: string; url: string };
  };
}

export interface KnowledgeBaseData {
  generatedAt: string;
  totalChunks: number;
  chunks: Chunk[];
  structured: StructuredRegistry;
}

// Synonyms dictionary for normalized query expansion
const SYNONYMS_MAP: Record<string, string[]> = {
  sap: ['s/4hana', 's4hana', 's4', 'btp', 'abap', 'sac', 'bw/4hana', 'datasphere', 'ecc', 'erp'],
  cloud: ['aws', 'azure', 'gcp', 'kubernetes', 'k8s', 'devops', 'infrastructure', 'modernization'],
  data: ['analytics', 'bi', 'etl', 'lakehouse', 'snowflake', 'databricks', 'pipeline', 'engineering'],
  automation: ['rpa', 'bot', 'workflow', 'camunda', 'uipath', 'orchestration', 'bpa'],
  career: ['job', 'jobs', 'hiring', 'openings', 'vacancies', 'roles', 'apply', 'careers'],
  office: ['offices', 'locations', 'headquarters', 'canada', 'india', 'usa', 'uae', 'address'],
  contact: ['email', 'phone', 'reach', 'call', 'inquiry', 'sales'],
  about: ['who', 'company', 'mission', 'vision', 'values', 'leaders', 'team'],
  approach: ['methodology', 'framework', 'steps', 'process', 'delivery', 'onsite', 'offshore'],
  case: ['case study', 'case studies', 'client story', 'success story', 'results', 'metrics'],
};

export class KnowledgeRetriever {
  private kb: KnowledgeBaseData;
  private miniSearch: MiniSearch<Chunk>;

  constructor() {
    const kbPath = path.resolve(process.cwd(), 'server', 'knowledge.json');
    if (!fs.existsSync(kbPath)) {
      throw new Error(`Knowledge base file not found at ${kbPath}. Run 'npm run kb:build' first.`);
    }

    const raw = fs.readFileSync(kbPath, 'utf8');
    this.kb = JSON.parse(raw);

    // Initialize BM25 search engine with field boosts
    this.miniSearch = new MiniSearch<Chunk>({
      fields: ['title', 'section', 'text', 'slug'],
      storeFields: ['id', 'type', 'title', 'section', 'url', 'slug', 'text'],
      searchOptions: {
        boost: {
          title: 4.0,
          slug: 3.0,
          section: 2.0,
          text: 1.0,
        },
        fuzzy: 0.2,
        prefix: true,
      },
    });

    this.miniSearch.addAll(this.kb.chunks);
  }

  public getStructured(): StructuredRegistry {
    return this.kb.structured;
  }

  public getAllChunks(): Chunk[] {
    return this.kb.chunks;
  }

  public normalizeQuery(query: string): string {
    let normalized = query.toLowerCase().trim();

    // Expand known acronyms and terminology
    for (const [key, synonyms] of Object.entries(SYNONYMS_MAP)) {
      for (const syn of synonyms) {
        if (normalized.includes(syn)) {
          normalized += ` ${key}`;
          break;
        }
      }
    }

    return normalized;
  }

  public search(query: string, type?: string, limit: number = 6): Chunk[] {
    const normalized = this.normalizeQuery(query);

    // Filter by type if provided
    const filter = type ? (result: any) => result.type === type : undefined;

    const rawResults = this.miniSearch.search(normalized, {
      filter,
    });

    // Also check exact slug / title matching for high-priority boost
    const matchedChunks: Chunk[] = [];
    const seenIds = new Set<string>();

    const queryLower = query.toLowerCase();

    // 1. Find and score exact / partial slug or title matches
    const candidates: Array<{ chunk: Chunk; score: number }> = [];

    for (const chunk of this.kb.chunks) {
      if (type && chunk.type !== type) continue;

      const titleLower = chunk.title.toLowerCase();
      const slugLower = chunk.slug.toLowerCase();

      let score = 0;
      if (titleLower === queryLower) {
        score = 25000 + titleLower.length * 10;
      } else if (slugLower === queryLower) {
        score = 20000 + slugLower.length * 10;
      } else if (titleLower.length > 3 && queryLower.includes(titleLower)) {
        // Specific full title mentioned in user query gets highest partial score!
        score = 15000 + titleLower.length * 10;
      } else if (slugLower !== 'about' && queryLower.includes(slugLower)) {
        score = 10000 + slugLower.length * 10;
      } else if (
        slugLower === 'about' &&
        (queryLower.includes('about axia') || queryLower.includes('about us') || queryLower === 'about')
      ) {
        score = 10000;
      } else if (titleLower.includes(queryLower)) {
        score = 5000 + queryLower.length * 10;
      }

      if (score > 0) {
        candidates.push({ chunk, score });
      }
    }

    // Sort descending by match score
    candidates.sort((a, b) => b.score - a.score);

    for (const cand of candidates) {
      if (matchedChunks.length >= limit) break;
      if (!seenIds.has(cand.chunk.id)) {
        matchedChunks.push(cand.chunk);
        seenIds.add(cand.chunk.id);
      }
    }

    // 2. Add BM25 search results
    for (const res of rawResults) {
      if (matchedChunks.length >= limit) break;
      if (!seenIds.has(res.id)) {
        const fullChunk = this.kb.chunks.find((c) => c.id === res.id);
        if (fullChunk) {
          matchedChunks.push(fullChunk);
          seenIds.add(res.id);
        }
      }
    }

    return matchedChunks.slice(0, limit);
  }

  public getChunkById(id: string): Chunk | undefined {
    return this.kb.chunks.find((c) => c.id === id);
  }

  public getChunksBySlug(slug: string): Chunk[] {
    return this.kb.chunks.filter((c) => c.slug.toLowerCase() === slug.toLowerCase());
  }

  public getChunksByType(type: Chunk['type']): Chunk[] {
    return this.kb.chunks.filter((c) => c.type === type);
  }
}

let instance: KnowledgeRetriever | null = null;
export function getRetriever(): KnowledgeRetriever {
  if (!instance) {
    instance = new KnowledgeRetriever();
  }
  return instance;
}
