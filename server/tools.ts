import { getRetriever, Chunk, StructuredRegistry } from './retrieval';

export interface CardItem {
  type: string;
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  url: string;
}

export interface ToolContext {
  usedSources: Array<{ title: string; url: string; chunkId: string }>;
  cards?: CardItem[];
  chips?: string[];
  handoffReason?: string;
  wantsHandoff?: boolean;
}

// JSON Schema tool definitions for Claude API
export const TOOL_DEFINITIONS = [
  {
    name: 'search_knowledge',
    description:
      'Search the Axia Kairos knowledge base for relevant chunks across services, case studies, blogs, industries, jobs, company info, and methodology.',
    input_schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The search query or keywords to look up.',
        },
        type: {
          type: 'string',
          enum: [
            'service',
            'case_study',
            'blog',
            'industry',
            'job',
            'about',
            'approach',
            'product',
            'contact',
            'legal',
          ],
          description: 'Optional content type filter.',
        },
        limit: {
          type: 'number',
          description: 'Max number of chunks to return (default 6, max 6).',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'list_services',
    description: 'Get the complete, verified list of all 12 Axia Kairos services.',
    input_schema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_service',
    description: 'Get in-depth details, capabilities, and deliverables for a specific service by slug.',
    input_schema: {
      type: 'object',
      properties: {
        slug: {
          type: 'string',
          description: 'The exact service slug (e.g. cloud-platform-modernization, sap-implementation-advisory-and-support).',
        },
      },
      required: ['slug'],
    },
  },
  {
    name: 'list_case_studies',
    description: 'Get verified enterprise transformation case studies, optionally filtered by industry.',
    input_schema: {
      type: 'object',
      properties: {
        industry: {
          type: 'string',
          description: 'Optional industry filter (e.g. Automotive & Manufacturing, Energy & Utilities).',
        },
      },
    },
  },
  {
    name: 'get_case_study',
    description: 'Get verified details, challenges, solutions, and exact metrics for a specific case study slug.',
    input_schema: {
      type: 'object',
      properties: {
        slug: {
          type: 'string',
          description: 'The case study slug (e.g. legacy-core-modernization-and-cloud-migration).',
        },
      },
      required: ['slug'],
    },
  },
  {
    name: 'list_industries',
    description: 'Get the complete list of all 12 industries served by Axia Kairos.',
    input_schema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_industry',
    description: 'Get sector-specific details for an industry by slug.',
    input_schema: {
      type: 'object',
      properties: {
        slug: {
          type: 'string',
          description: 'The industry slug (e.g. oil-and-gas, healthcare-and-life-sciences).',
        },
      },
      required: ['slug'],
    },
  },
  {
    name: 'list_blog_posts',
    description: 'Get expert perspective blog posts published by Axia Kairos.',
    input_schema: {
      type: 'object',
      properties: {
        topic: {
          type: 'string',
          description: 'Optional topic keyword (e.g. SAP, AI, cybersecurity, cloud).',
        },
      },
    },
  },
  {
    name: 'get_blog_post',
    description: 'Get the article text and details for a blog post slug.',
    input_schema: {
      type: 'object',
      properties: {
        slug: {
          type: 'string',
          description: 'The blog slug.',
        },
      },
      required: ['slug'],
    },
  },
  {
    name: 'list_open_jobs',
    description: 'Get verified current open career positions, optionally filtered by department.',
    input_schema: {
      type: 'object',
      properties: {
        department: {
          type: 'string',
          description: 'Optional department filter (e.g. SAP Consultants, Sales & Marketing, Finance & Operations, HR).',
        },
      },
    },
  },
  {
    name: 'get_job',
    description: 'Get details, qualifications, and notice period for a job opening by slug.',
    input_schema: {
      type: 'object',
      properties: {
        slug: {
          type: 'string',
          description: 'The job slug (e.g. sap-consultants, hr-operations-executive).',
        },
      },
      required: ['slug'],
    },
  },
  {
    name: 'get_company_info',
    description: 'Get verified company information about Axia Kairos.',
    input_schema: {
      type: 'object',
      properties: {
        topic: {
          type: 'string',
          enum: ['about', 'approach', 'offices', 'contact', 'products', 'legal'],
          description: 'Topic of inquiry.',
        },
      },
      required: ['topic'],
    },
  },
  {
    name: 'show_cards',
    description:
      'Display rich visual cards in the chat UI. The server constructs title, subtitle, image, and verified internal URL from the single source of truth.',
    input_schema: {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                enum: ['service', 'case_study', 'industry', 'blog', 'job', 'product'],
              },
              slug: { type: 'string' },
            },
            required: ['type', 'slug'],
          },
          description: 'Array of items (max 12) to render as visual cards.',
        },
      },
      required: ['items'],
    },
  },
  {
    name: 'suggest_followups',
    description:
      'Suggest up to 3 quick-reply follow-up question chips for the user. Each question will be validated against the knowledge base by the server.',
    input_schema: {
      type: 'object',
      properties: {
        questions: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of 3 recommended follow-up questions.',
        },
      },
      required: ['questions'],
    },
  },
  {
    name: 'start_human_handoff',
    description:
      'Trigger the in-chat human handoff form when a query requires custom pricing, contracts, confidential data, office street visit scheduling, or details not on the site.',
    input_schema: {
      type: 'object',
      properties: {
        reason: {
          type: 'string',
          description: 'Why the handoff is being initiated.',
        },
      },
      required: ['reason'],
    },
  },
];

// Tool Executor executing against the KnowledgeBase
export async function executeTool(
  toolName: string,
  args: Record<string, any>,
  context: ToolContext
): Promise<any> {
  const retriever = getRetriever();
  const structured = retriever.getStructured();

  switch (toolName) {
    case 'search_knowledge': {
      const { query, type, limit = 6 } = args;
      const chunks = retriever.search(query, type, Math.min(limit, 6));

      // Record sources for guardrail validation
      for (const c of chunks) {
        if (!context.usedSources.some((s) => s.chunkId === c.id)) {
          context.usedSources.push({
            title: c.title,
            url: c.url,
            chunkId: c.id,
          });
        }
      }

      return {
        count: chunks.length,
        results: chunks.map((c) => ({
          id: c.id,
          type: c.type,
          title: c.title,
          section: c.section,
          url: c.url,
          text: c.text,
        })),
      };
    }

    case 'list_services': {
      const services = structured.services.map((s) => ({
        slug: s.slug,
        title: s.title,
        shortDescription: s.shortDescription,
        url: s.route,
      }));
      context.usedSources.push({
        title: 'All Services',
        url: '/services',
        chunkId: 'services-index',
      });
      return { total: services.length, services };
    }

    case 'get_service': {
      const { slug } = args;
      const s = structured.services.find((x) => x.slug === slug);
      if (!s) return { error: `Service with slug '${slug}' not found.` };
      const chunks = retriever.getChunksBySlug(slug);
      for (const c of chunks) {
        context.usedSources.push({ title: c.title, url: c.url, chunkId: c.id });
      }
      return {
        service: s,
        details: chunks.map((c) => c.text).join('\n\n'),
      };
    }

    case 'list_case_studies': {
      const { industry } = args;
      let csList = structured.caseStudies;
      if (industry) {
        csList = csList.filter(
          (c) => c.industry.toLowerCase().includes(industry.toLowerCase())
        );
      }
      context.usedSources.push({
        title: 'Case Studies',
        url: '/case-studies',
        chunkId: 'case-studies-index',
      });
      return {
        total: csList.length,
        caseStudies: csList.map((c) => ({
          slug: c.slug,
          title: c.title,
          industry: c.industry,
          summary: c.summary,
          metrics: c.metrics,
          url: c.url,
        })),
      };
    }

    case 'get_case_study': {
      const { slug } = args;
      const cs = structured.caseStudies.find((x) => x.slug === slug);
      if (!cs) return { error: `Case study with slug '${slug}' not found.` };
      const chunks = retriever.getChunksBySlug(slug);
      for (const c of chunks) {
        context.usedSources.push({ title: c.title, url: c.url, chunkId: c.id });
      }
      return {
        caseStudy: cs,
        details: chunks.map((c) => c.text).join('\n\n'),
      };
    }

    case 'list_industries': {
      context.usedSources.push({
        title: 'Industries We Serve',
        url: '/industries',
        chunkId: 'industries-index',
      });
      return {
        total: structured.industries.length,
        industries: structured.industries,
      };
    }

    case 'get_industry': {
      const { slug } = args;
      const ind = structured.industries.find((x) => x.slug === slug);
      if (!ind) return { error: `Industry with slug '${slug}' not found.` };
      const chunks = retriever.getChunksBySlug(slug);
      for (const c of chunks) {
        context.usedSources.push({ title: c.title, url: c.url, chunkId: c.id });
      }
      return { industry: ind };
    }

    case 'list_blog_posts': {
      const { topic } = args;
      let blogList = structured.blogs;
      if (topic) {
        blogList = blogList.filter(
          (b) =>
            b.title.toLowerCase().includes(topic.toLowerCase()) ||
            b.summary.toLowerCase().includes(topic.toLowerCase())
        );
      }
      context.usedSources.push({
        title: 'Axia Kairos Blogs',
        url: '/blogs',
        chunkId: 'blogs-index',
      });
      return { total: blogList.length, blogs: blogList };
    }

    case 'get_blog_post': {
      const { slug } = args;
      const b = structured.blogs.find((x) => x.slug === slug);
      if (!b) return { error: `Blog post with slug '${slug}' not found.` };
      const chunks = retriever.getChunksBySlug(slug);
      for (const c of chunks) {
        context.usedSources.push({ title: c.title, url: c.url, chunkId: c.id });
      }
      return { blog: b, content: chunks.map((c) => c.text).join('\n\n') };
    }

    case 'list_open_jobs': {
      const { department } = args;
      let jobList = structured.jobs;
      if (department && department !== 'All Departments') {
        jobList = jobList.filter(
          (j) => j.department.toLowerCase() === department.toLowerCase()
        );
      }
      context.usedSources.push({
        title: 'Axia Kairos Careers',
        url: '/careers',
        chunkId: 'careers-index',
      });
      return { total: jobList.length, jobs: jobList };
    }

    case 'get_job': {
      const { slug } = args;
      const j = structured.jobs.find((x) => x.slug === slug);
      if (!j) return { error: `Job opening with slug '${slug}' not found.` };
      const chunks = retriever.getChunksBySlug(slug);
      for (const c of chunks) {
        context.usedSources.push({ title: c.title, url: c.url, chunkId: c.id });
      }
      return { job: j, details: chunks.map((c) => c.text).join('\n\n') };
    }

    case 'get_company_info': {
      const { topic } = args;
      switch (topic) {
        case 'about':
          context.usedSources.push({ title: 'About Axia Kairos', url: '/about', chunkId: 'about-overview' });
          return structured.about;
        case 'approach':
          context.usedSources.push({ title: 'Our Approach', url: '/our-approach', chunkId: 'approach-methodology' });
          return structured.approach;
        case 'offices':
        case 'contact':
          context.usedSources.push({ title: 'Contact & Offices', url: '/contact', chunkId: 'contact-offices-emails' });
          return structured.contact;
        case 'products':
          context.usedSources.push({ title: 'Enterprise Products', url: '/products', chunkId: 'products-list' });
          return { products: structured.products };
        case 'legal':
          context.usedSources.push({ title: 'Privacy Policy', url: '/privacy-policy', chunkId: 'legal-privacy-policy' });
          return structured.legal;
        default:
          return { error: `Unknown topic '${topic}'.` };
      }
    }

    case 'show_cards': {
      const { items } = args;
      const validatedCards: CardItem[] = [];

      for (const item of items.slice(0, 12)) {
        if (item.type === 'service') {
          const s = structured.services.find((x) => x.slug === item.slug);
          if (s) {
            validatedCards.push({
              type: 'service',
              slug: s.slug,
              title: s.title,
              subtitle: s.shortDescription,
              image: s.image,
              url: s.route,
            });
            context.usedSources.push({ title: s.title, url: s.route, chunkId: `service-${s.slug}` });
          }
        } else if (item.type === 'case_study') {
          const cs = structured.caseStudies.find((x) => x.slug === item.slug);
          if (cs) {
            validatedCards.push({
              type: 'case_study',
              slug: cs.slug,
              title: cs.title,
              subtitle: `${cs.industry} • ${cs.metrics[0] || 'Enterprise Impact'}`,
              image: cs.image,
              url: cs.url,
            });
            context.usedSources.push({ title: cs.title, url: cs.url, chunkId: `case-study-${cs.slug}` });
          }
        } else if (item.type === 'industry') {
          const ind = structured.industries.find((x) => x.slug === item.slug);
          if (ind) {
            validatedCards.push({
              type: 'industry',
              slug: ind.slug,
              title: ind.title,
              subtitle: ind.description,
              image: '/assets/services/default.jpg',
              url: ind.url,
            });
            context.usedSources.push({ title: ind.title, url: ind.url, chunkId: `industry-${ind.slug}` });
          }
        } else if (item.type === 'blog') {
          const b = structured.blogs.find((x) => x.slug === item.slug);
          if (b) {
            validatedCards.push({
              type: 'blog',
              slug: b.slug,
              title: b.title,
              subtitle: b.summary,
              image: b.coverImage,
              url: b.url,
            });
            context.usedSources.push({ title: b.title, url: b.url, chunkId: `blog-${b.slug}` });
          }
        } else if (item.type === 'job') {
          const j = structured.jobs.find((x) => x.slug === item.slug);
          if (j) {
            validatedCards.push({
              type: 'job',
              slug: j.slug,
              title: j.title,
              subtitle: `${j.department} • ${j.location}`,
              image: '/assets/services/default.jpg',
              url: j.url,
            });
            context.usedSources.push({ title: j.title, url: j.url, chunkId: `job-${j.slug}` });
          }
        }
      }

      context.cards = validatedCards;
      return { renderedCardsCount: validatedCards.length };
    }

    case 'suggest_followups': {
      const { questions } = args;
      const verifiedChips: string[] = [];

      for (const q of questions.slice(0, 3)) {
        if (typeof q === 'string' && q.trim().length > 0) {
          // Verify that this question has hits in the knowledge base
          const hits = retriever.search(q, undefined, 2);
          if (hits.length > 0) {
            verifiedChips.push(q.trim());
          }
        }
      }

      context.chips = verifiedChips;
      return { acceptedChips: verifiedChips };
    }

    case 'start_human_handoff': {
      const { reason } = args;
      context.wantsHandoff = true;
      context.handoffReason = reason;
      context.usedSources.push({
        title: 'Connect with our team',
        url: '/contact',
        chunkId: 'handoff-form',
      });
      return { status: 'handoff_initiated', reason };
    }

    default:
      return { error: `Tool '${toolName}' not recognized.` };
  }
}
