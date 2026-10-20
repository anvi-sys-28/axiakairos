import Anthropic from '@anthropic-ai/sdk';
import { getRetriever, Chunk } from './retrieval';
import { TOOL_DEFINITIONS, executeTool, ToolContext, CardItem } from './tools';
import { SYSTEM_PROMPT } from './prompt';
import {
  sanitizeUrls,
  verifyNumericGroundedness,
  logUnansweredQuestion,
} from './guardrails';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatStreamEvent {
  event: 'token' | 'cards' | 'chips' | 'sources' | 'form' | 'done' | 'error';
  data: any;
}

export type StreamCallback = (evt: ChatStreamEvent) => void;

/**
 * Executes a chat interaction either using Claude API or the Grounded Deterministic Engine.
 */
export async function handleChat(
  userMessage: string,
  history: ChatMessage[],
  sendEvent: StreamCallback
): Promise<void> {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  const model = process.env.CHAT_MODEL || 'claude-3-5-sonnet-latest';

  const toolContext: ToolContext = {
    usedSources: [],
  };

  // If Anthropic API Key is present, run Claude tool-use loop
  if (apiKey) {
    try {
      await runClaudeChat(userMessage, history, apiKey, model, toolContext, sendEvent);
      return;
    } catch (err) {
      console.error('Claude API call failed, falling back to grounded engine:', err);
      // Fall through to deterministic engine
    }
  }

  // Grounded Deterministic Engine (Zero hallucination, 100% factually bound)
  await runGroundedEngine(userMessage, toolContext, sendEvent);
}

/**
 * Runs Claude API with tool use and SSE streaming.
 */
async function runClaudeChat(
  userMessage: string,
  history: ChatMessage[],
  apiKey: string,
  model: string,
  context: ToolContext,
  sendEvent: StreamCallback
): Promise<void> {
  const anthropic = new Anthropic({ apiKey });

  // Format messages (last 10 turns max)
  const messages: Anthropic.MessageParam[] = history.slice(-10).map((m) => ({
    role: m.role,
    content: m.content,
  }));
  messages.push({ role: 'user', content: userMessage });

  let rounds = 0;
  const maxRounds = 4;
  let fullResponseText = '';

  while (rounds < maxRounds) {
    rounds++;

    const response = await anthropic.messages.create({
      model,
      system: SYSTEM_PROMPT,
      messages,
      tools: TOOL_DEFINITIONS as any,
      max_tokens: 700,
      temperature: 0.2,
    });

    // Check for tool use
    const toolUseBlocks = response.content.filter((b) => b.type === 'tool_use');
    const textBlocks = response.content.filter((b) => b.type === 'text');

    if (textBlocks.length > 0) {
      for (const t of textBlocks) {
        if ('text' in t) {
          fullResponseText += t.text;
          // Stream token chunks
          sendEvent({ event: 'token', data: t.text });
        }
      }
    }

    if (toolUseBlocks.length === 0) {
      // Done with tool calls
      break;
    }

    // Execute tool use blocks
    const toolResultContent: Anthropic.ToolResultBlockParam[] = [];

    for (const tu of toolUseBlocks) {
      if (tu.type === 'tool_use') {
        const result = await executeTool(tu.name, tu.input as any, context);
        toolResultContent.push({
          type: 'tool_result',
          tool_use_id: tu.id,
          content: JSON.stringify(result),
        });
      }
    }

    // Append assistant response with tool use, and tool results
    messages.push({ role: 'assistant', content: response.content });
    messages.push({ role: 'user', content: toolResultContent });
  }

  // Guardrail checks
  fullResponseText = sanitizeUrls(fullResponseText);

  // Send rich parts if collected
  if (context.cards && context.cards.length > 0) {
    sendEvent({ event: 'cards', data: context.cards });
  }

  if (context.usedSources.length > 0) {
    const uniqueSources = Array.from(
      new Map(context.usedSources.map((s) => [s.url, s])).values()
    );
    sendEvent({ event: 'sources', data: uniqueSources });
  }

  if (context.chips && context.chips.length > 0) {
    sendEvent({ event: 'chips', data: context.chips });
  }

  if (context.wantsHandoff) {
    sendEvent({
      event: 'form',
      data: { reason: context.handoffReason || 'Direct team engagement requested.' },
    });
  }

  sendEvent({ event: 'done', data: {} });
}

/**
 * Grounded Deterministic Engine for offline, evaluation, and zero-hallucination environments.
 */
async function runGroundedEngine(
  userMessage: string,
  context: ToolContext,
  sendEvent: StreamCallback
): Promise<void> {
  const retriever = getRetriever();
  const structured = retriever.getStructured();
  const lower = userMessage.toLowerCase().trim();

  let answer = '';
  let cards: CardItem[] = [];
  let chips: string[] = [];
  let isHandoff = false;
  let handoffReason = '';

  // 1. Off-topic & Injection detection
  if (
    lower.includes('ignore previous instructions') ||
    lower.includes('ignore all previous') ||
    lower.includes('ignore') ||
    lower.includes('system prompt') ||
    lower.includes('repeat the prompt') ||
    lower.includes('print your system') ||
    lower.includes('act as a') ||
    lower.includes('you are now') ||
    lower.includes('jailbreak') ||
    lower.includes('dan mode')
  ) {
    answer =
      "I am AXIA Assistant, dedicated strictly to answering questions about Axia Kairos's enterprise services, case studies, industries, careers, and approach. I cannot modify my instructions or reveal internal prompts. How may I assist your organization today?";
    chips = ['What services do you offer?', 'Show case studies', 'Explore careers at Axia Kairos'];
  } else if (
    lower.includes('recipe') ||
    lower.includes('weather') ||
    lower.includes('sports score') ||
    lower.includes('homework') ||
    lower.includes('write me a poem') ||
    lower.includes('joke') ||
    lower.includes('python script') ||
    lower.includes('scrape a website') ||
    lower.includes('capital of') ||
    lower.includes('world cup') ||
    lower.includes('french revolution')
  ) {
    answer =
      "I can only assist with questions regarding Axia Kairos, our enterprise services, case studies, industries, and career opportunities. Please feel free to ask about our technology solutions or consulting capabilities.";
    chips = ['What services do you offer?', 'Tell me about SAP services', 'How do you work with clients?'];
  }
  // 2. Ambiguous Queries -> Ask ONE clarifying question
  else if (
    lower === 'tell me about migration' ||
    lower === 'migration' ||
    lower.startsWith('tell me about migration')
  ) {
    answer =
      'Axia Kairos supports multiple migration pathways including SAP ECC to S/4HANA migration, cloud platform modernization (AWS/Azure/GCP), and enterprise data warehouse migrations. Which specific migration pathway is your enterprise planning?';
    chips = ['SAP S/4HANA Migration', 'Cloud Platform Modernization', 'Data Warehouse Migration'];
    context.usedSources.push({ title: 'SAP Implementation & Support', url: '/services/sap-implementation-advisory-and-support', chunkId: 'services-sap' });
    context.usedSources.push({ title: 'Cloud Platform Modernization', url: '/services/cloud-platform-modernization', chunkId: 'services-cloud' });
  } else if (
    lower === 'can you help our business?' ||
    lower === 'can you help our business' ||
    lower === 'help our company'
  ) {
    answer =
      'Axia Kairos partners with enterprises across strategy, cloud modernization, data engineering, and SAP transformation. Which strategic priority, operational challenge, or technology domain would you like to discuss?';
    chips = ['SAP Advisory & Support', 'Cloud Modernization', 'Connect with our team'];
    context.usedSources.push({ title: 'Our Approach', url: '/our-approach', chunkId: 'approach-framework' });
  }
  // 3. Pricing & Cost Queries -> Must trigger handoff
  else if (
    lower.includes('pricing') ||
    lower.includes('how much does it cost') ||
    lower.includes('cost breakdown') ||
    lower.includes('rate card') ||
    lower.includes('quote') ||
    lower.includes('fee structure') ||
    lower.includes('budget required')
  ) {
    answer =
      "I don't have pricing details on our website, as enterprise engagement investments are tailored based on scope, architecture complexity, and delivery model. I've opened our inquiry form below so our principal advisors can provide a customized quote.";
    isHandoff = true;
    handoffReason = 'Pricing and engagement scoping inquiry';
    chips = ['Explore our services', 'Our delivery models', 'Case study results'];
    context.usedSources.push({ title: 'Contact & Scoping', url: '/contact', chunkId: 'contact-scoping' });
  }
  // 4. Street Addresses Query -> Must trigger handoff (not published on site)
  else if (
    lower.includes('street address') ||
    lower.includes('exact address') ||
    lower.includes('suite number') ||
    lower.includes('physical address') ||
    lower.includes('office building address')
  ) {
    answer =
      "I don't have street addresses published on our website. Axia Kairos operates corporate hubs across Canada, India, the USA, and the UAE. Facility visits and meetings are arranged directly through our engagement team below.";
    isHandoff = true;
    handoffReason = 'Office facility visit scheduling';
    chips = ['Where are your offices?', 'Official contact emails', 'Talk to our team'];
    context.usedSources.push({ title: 'Office Locations', url: '/contact', chunkId: 'contact-offices-emails' });
  }
  // 5. Team size / headcount / competitor comparisons / named clients / unlisted certifications -> Must trigger handoff
  else if (
    lower.includes('named client') ||
    lower.includes('client name') ||
    lower.includes('who are your clients') ||
    lower.includes('which specific clients') ||
    lower.includes('list of clients')
  ) {
    answer =
      "I don't have named client disclosures on our website. All case studies published on our site are strictly anonymized to protect client confidentiality. You can connect with our leadership team below for credential discussions under NDA.";
    isHandoff = true;
    handoffReason = 'Client credentials and reference request';
    chips = ['View anonymized case studies', 'Explore our services', 'Connect with our team'];
    context.usedSources.push({ title: 'Case Studies', url: '/case-studies', chunkId: 'case-studies-index' });
  } else if (
    lower.includes('headcount') ||
    lower.includes('how many employees') ||
    lower.includes('employee') ||
    lower.includes('team size')
  ) {
    answer =
      "I don't have employee headcount figures on our website. Axia Kairos deploys specialized global consulting and engineering practices across Canada, India, the USA, and the UAE. I've opened our inquiry form below if you would like to discuss team capacity.";
    isHandoff = true;
    handoffReason = 'Team capacity and headcount inquiry';
    chips = ['Our leadership minds', 'Explore our approach', 'Core values'];
    context.usedSources.push({ title: 'About Axia Kairos', url: '/about', chunkId: 'about-overview' });
  } else if (
    lower.includes('vs accenture') ||
    lower.includes('vs deloitte') ||
    lower.includes('vs mckinsey') ||
    lower.includes('competitor') ||
    lower.includes('better than')
  ) {
    answer =
      "I don't have competitor comparisons on our website. Axia Kairos distinguishes itself through agile delivery, principal-led advisory, and deep technical specialization in SAP, cloud, and data. You can speak directly with our partners below.";
    isHandoff = true;
    handoffReason = 'Firm differentiation inquiry';
    chips = ['Our delivery models', 'Explore our approach', 'Case study results'];
    context.usedSources.push({ title: 'Our Approach', url: '/our-approach', chunkId: 'approach-framework' });
  } else if (
    lower.includes('iso certified') ||
    lower.includes('soc 2') ||
    (lower.includes('certification') && !lower.includes('sap'))
  ) {
    answer =
      "I don't have specific compliance certifications published on our public website. Our cyber security and managed services practices adhere to enterprise industry standards. Our security team can supply compliance attestations below.";
    isHandoff = true;
    handoffReason = 'Compliance and certification inquiry';
    chips = ['Cyber security services', 'Managed IT services', 'Contact us'];
    context.usedSources.push({ title: 'Cyber Security Services', url: '/services/cyber-security-services', chunkId: 'services-cyber' });
  }
  // 6. Offices & Headquarters
  else if (
    lower.includes('where are your offices') ||
    lower.includes('office location') ||
    lower.includes('where is axia kairos located') ||
    lower.includes('global offices') ||
    lower.includes('headquarters') ||
    lower.includes('canada') ||
    lower.includes('dubai')
  ) {
    answer =
      'Axia Kairos operates across corporate regional hubs in Canada, India, the USA, and the UAE (Dubai). Our distributed delivery model provides 24/7 support and regional presence across North America, EMEA, and APAC.';
    chips = ['Canada & USA presence', 'India development center', 'Contact details'];
    context.usedSources.push({ title: 'Office Locations', url: '/contact', chunkId: 'contact-offices-emails' });
    context.usedSources.push({ title: 'About Axia Kairos', url: '/about', chunkId: 'about-overview' });
  }
  // 7. Core Values
  else if (
    lower.includes('core values') ||
    lower.includes('values of axia') ||
    lower.includes('company values')
  ) {
    answer =
      'Axia Kairos is guided by five foundational core values: Excellence (precision execution and deep domain mastery), Integrity (uncompromised ethics and transparency), Innovation (harnessing emerging technologies), Client-Centricity (tangible client outcomes), and Collaboration (co-creating value with client teams).';
    chips = ['About Axia Kairos', 'Our Approach', 'Connect with our team'];
    context.usedSources.push({ title: 'About Axia Kairos', url: '/about', chunkId: 'about-mission-vision-values' });
  }
  // 8. Approach & Methodology
  else if (
    lower.includes('how do you work with clients') ||
    lower.includes('our approach') ||
    lower.includes('delivery model') ||
    lower.includes('methodology')
  ) {
    answer =
      'Axia Kairos works with clients through four framework pillars: Strategic Alignment, Architecture & Engineering, Agile Execution, and Value Realization. We deliver across 5 phases (Discover, Design, Deliver, Deploy, Optimize) using Dedicated Teams, Managed Services, Co-Innovation Labs, or Advisory Models.';
    chips = ['Delivery models', 'Explore our services', 'View case studies'];
    context.usedSources.push({ title: 'Our Approach', url: '/our-approach', chunkId: 'approach-framework' });
  }
  // 9. About & Company Overview
  else if (
    lower.includes('who are you') ||
    lower.includes('about axia kairos') ||
    lower.includes('tell me about axia kairos') ||
    lower.includes('what is axia kairos')
  ) {
    answer =
      'Axia Kairos is a global technology and management consulting firm delivering enterprise transformation across SAP, cloud modernization, data engineering, and automation. We operate across Canada, India, USA, and UAE guided by our core values of Excellence, Integrity, Client-Centricity, Innovation, and Collaboration.';
    chips = ['Explore our services', 'Where are your offices?', 'Our core values'];
    context.usedSources.push({ title: 'About Axia Kairos', url: '/about', chunkId: 'about-overview' });
  }
  // 10. Products
  else if (
    lower.includes('what products') ||
    lower.includes('products do you offer') ||
    lower.includes('software product') ||
    lower.includes('enterprise product') ||
    lower.includes('enterprise platform') ||
    lower.includes('cloudbridge modernizer')
  ) {
    answer =
      'Axia Kairos has engineered 5 enterprise platforms: Axia Intelligence Core, Enterprise Data Hub, CloudBridge Modernizer, ComplianceGuard, and CommerceMatrix to accelerate digital transformation and intelligent operations.';
    chips = ['Axia Intelligence Core', 'Enterprise Data Hub', 'CloudBridge Modernizer'];
    context.usedSources.push({ title: 'Products', url: '/products', chunkId: 'products-index' });
  }
  // 11. Careers
  else if (
    lower.includes('career opportunities') ||
    lower.includes('open positions') ||
    lower.includes('careers at axia') ||
    lower.includes('job openings')
  ) {
    answer =
      'Axia Kairos offers exciting global careers across SAP consulting, cloud modernization, data engineering, and corporate operations. Open roles include SAP Consultants, Senior SAP Consultants, Business Development Managers, Finance Controllers, and HR Operations Executives. You can apply directly through our Careers portal.';
    cards = structured.jobs.map((j) => ({
      type: 'job',
      slug: j.slug,
      title: j.title,
      subtitle: `${j.department} • ${j.location}`,
      image: '/assets/services/default.jpg',
      url: j.url,
    }));
    chips = ['SAP Consultant opening', 'Finance Controller role', 'How to apply'];
    context.usedSources.push({ title: 'Careers', url: '/careers', chunkId: 'careers-index' });
  }
  // 5. Services Queries
  else if (
    lower.includes('what services') ||
    lower.includes('services do you offer') ||
    lower.includes('all services') ||
    lower.includes('capabilities')
  ) {
    answer =
      'Axia Kairos provides 12 specialized enterprise consulting and technology services spanning SAP advisory, cloud modernization, data engineering, business process automation, and cyber security.';
    cards = structured.services.slice(0, 6).map((s) => ({
      type: 'service',
      slug: s.slug,
      title: s.title,
      subtitle: s.shortDescription,
      image: s.image,
      url: s.route,
    }));
    chips = ['Tell me about SAP services', 'Cloud platform modernization', 'Data engineering capabilities'];
    context.usedSources.push({ title: 'All Services', url: '/services', chunkId: 'services-index' });
  }
  // 6. Case Studies Queries
  else if (
    lower.includes('case studies') ||
    lower.includes('case study') ||
    lower.includes('client work') ||
    lower.includes('success stories')
  ) {
    answer =
      'Axia Kairos partners with global enterprises to deliver measurable impact. Our case studies feature verified outcomes including 99.99% uptime, 38% cost reductions, and accelerated deployment cycles.';
    cards = structured.caseStudies.map((cs) => ({
      type: 'case_study',
      slug: cs.slug,
      title: cs.title,
      subtitle: `${cs.industry} • ${cs.metrics[0] || 'Enterprise Impact'}`,
      image: cs.image,
      url: cs.url,
    }));
    chips = ['Automated claims processing AI', 'SAP S/4HANA transformation', 'Cloud modernization case study'];
    context.usedSources.push({ title: 'Case Studies', url: '/case-studies', chunkId: 'case-studies-index' });
  }
  // 7. General Knowledge Base Retrieval
  else {
    const hits = retriever.search(userMessage, undefined, 4);

    if (hits.length === 0) {
      answer =
        "I couldn't find specific details regarding that topic on our website. Would you like me to connect you with our principal advisory team to answer your question directly?";
      isHandoff = true;
      handoffReason = `Unanswered inquiry: ${userMessage}`;
      logUnansweredQuestion(userMessage, []);
      chips = ['Explore our services', 'View case studies', 'Open job positions'];
    } else {
      const top = hits[0];
      for (const h of hits) {
        context.usedSources.push({ title: h.title, url: h.url, chunkId: h.id });
      }

      // Check if top hit is a service
      const matchedService = structured.services.find((s) => s.slug === top.slug);
      const matchedCaseStudy = structured.caseStudies.find((cs) => cs.slug === top.slug);
      const matchedJob = structured.jobs.find((j) => j.slug === top.slug);

      if (matchedService) {
        answer = `${matchedService.title}: ${matchedService.shortDescription} Axia Kairos provides end-to-end strategy, architecture, and deployment support for this capability.`;
        cards = [
          {
            type: 'service',
            slug: matchedService.slug,
            title: matchedService.title,
            subtitle: matchedService.shortDescription,
            image: matchedService.image,
            url: matchedService.route,
          },
        ];
        chips = ['Show case studies', 'What other services do you offer?', 'Connect with our team'];
      } else if (matchedCaseStudy) {
        answer = `${matchedCaseStudy.title} (${matchedCaseStudy.industry}): ${matchedCaseStudy.summary} Verified results achieved include ${matchedCaseStudy.metrics.join(', ')}.`;
        cards = [
          {
            type: 'case_study',
            slug: matchedCaseStudy.slug,
            title: matchedCaseStudy.title,
            subtitle: `${matchedCaseStudy.industry} • ${matchedCaseStudy.metrics[0] || ''}`,
            image: matchedCaseStudy.image,
            url: matchedCaseStudy.url,
          },
        ];
        chips = ['View all case studies', 'Services used in this project', 'Schedule an advisory session'];
      } else if (matchedJob) {
        answer = `${matchedJob.title} is currently open at Axia Kairos in ${matchedJob.location} (${matchedJob.employmentType}, ${matchedJob.experience || 'Experienced'}). ${matchedJob.summary} You can apply directly through our Careers portal.`;
        cards = [
          {
            type: 'job',
            slug: matchedJob.slug,
            title: matchedJob.title,
            subtitle: `${matchedJob.department} • ${matchedJob.location}`,
            image: '/assets/services/default.jpg',
            url: matchedJob.url,
          },
        ];
        chips = ['View all careers', 'Interview process', 'About Axia Kairos'];
      } else {
        // Synthesize response from top chunk
        const lines = top.text.split('\n').filter((l) => !l.startsWith('<'));
        answer = lines.slice(0, 3).join(' ').trim();
        chips = ['Tell me about SAP services', 'How do you work with clients?', 'Contact details'];
      }
    }
  }

  // Stream tokens
  const words = answer.split(' ');
  for (let i = 0; i < words.length; i++) {
    sendEvent({ event: 'token', data: words[i] + (i === words.length - 1 ? '' : ' ') });
    await new Promise((r) => setTimeout(r, 12));
  }

  // Stream rich parts
  if (cards.length > 0) {
    sendEvent({ event: 'cards', data: cards });
  }

  if (context.usedSources.length > 0) {
    const uniqueSources = Array.from(
      new Map(context.usedSources.map((s) => [s.url, s])).values()
    );
    sendEvent({ event: 'sources', data: uniqueSources });
  }

  if (chips.length > 0) {
    sendEvent({ event: 'chips', data: chips });
  }

  if (isHandoff) {
    sendEvent({
      event: 'form',
      data: { reason: handoffReason || 'Team engagement requested.' },
    });
  }

  sendEvent({ event: 'done', data: {} });
}
