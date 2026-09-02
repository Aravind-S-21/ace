import { ProviderPool } from './providerPool';
import { QuotaManager } from './quotaManager';
import { ProviderSelector } from './providerSelector';
import { UsageTracker } from './usageTracker';
import { MockAIProvider } from '../mock.provider';
import { StructuredEventIntelligence, StructuredRecommendationOutput } from '../../types/ai.types';
import { env } from '../../config/env';
import { logger } from '../../utils/logger';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { HfInference } from '@huggingface/inference';
import crypto from 'crypto';

export class AIGateway {
  private geminiPool: ProviderPool;
  private openAiPool: ProviderPool;
  private hfPool: ProviderPool;
  private quotaManager: QuotaManager;
  private providerSelector: ProviderSelector;
  private usageTracker: UsageTracker;
  private mockProvider: MockAIProvider;

  constructor() {
    this.geminiPool = new ProviderPool('GEMINI', env.GEMINI_MODEL, env.GEMINI_CREDENTIALS);
    this.openAiPool = new ProviderPool('OPENAI', env.OPENAI_MODEL, env.OPENAI_CREDENTIALS);
    this.hfPool = new ProviderPool('HUGGINGFACE', env.HUGGINGFACE_MODEL, env.HF_CREDENTIALS);

    this.quotaManager = new QuotaManager();
    this.providerSelector = new ProviderSelector({
      geminiPool: this.geminiPool,
      openAiPool: this.openAiPool,
      hfPool: this.hfPool,
    });
    this.usageTracker = new UsageTracker();
    this.mockProvider = new MockAIProvider();
  }

  public computeEventContentHash(eventData: any): string {
    const rawString = `${eventData.title}_${eventData.description}_${eventData.category}_${eventData.requiredSkills?.join(',')}_${eventData.eligibility}`;
    return crypto.createHash('sha256').update(rawString).digest('hex');
  }

  public async analyzeEvent(event: {
    title: string;
    description: string;
    category: string;
    eligibility: string;
    requiredSkills: string[];
    location: string;
    duration: string;
    registrationDeadline: Date | string;
    organizer: string;
  }): Promise<StructuredEventIntelligence> {
    const startTime = Date.now();
    const promptSummary = `Analyze Event: ${event.title} (${event.category})`;

    // Forced Mock Mode (e.g. during fast Jest unit testing)
    if (env.AI_PRIMARY_PROVIDER === 'MOCK' || process.env.AI_PRIMARY_PROVIDER === 'MOCK') {
      const mockRes = await this.mockProvider.analyzeEvent(event);
      await this.usageTracker.track({
        agent: 'Agent 2',
        provider: 'MOCK',
        credentialIdentifier: 'MOCK_KEY',
        model: 'mock-model',
        requestType: 'EVENT_INTELLIGENCE',
        inputPrompt: promptSummary,
        rawResponse: JSON.stringify(mockRes.data),
        durationMs: Date.now() - startTime,
        success: true,
        cacheStatus: 'MISS',
        fallbackUsed: false,
      });
      return mockRes.data;
    }

    let attempts = 0;
    const maxAttempts = 5;
    let fallbackUsed = false;

    while (attempts < maxAttempts) {
      attempts++;
      const selection = this.providerSelector.selectCredential('AGENT_2_EVENT_INTELLIGENCE');

      if (!selection) {
        logger.warn('[AIGateway] All AI Provider credentials in pool unavailable or cooling down.');
        break;
      }

      const { pool, credentialStatus } = selection;
      try {
        logger.info(`[AIGateway] [Agent 2] Invoking ${credentialStatus.provider} via ${credentialStatus.identifier}...`);
        const resultData = await this.executeEventAnalysis(credentialStatus, event);
        pool.markSuccess(credentialStatus.identifier);

        const durationMs = Date.now() - startTime;
        await this.usageTracker.track({
          agent: 'Agent 2',
          provider: credentialStatus.provider,
          credentialIdentifier: credentialStatus.identifier,
          model: credentialStatus.model,
          requestType: 'EVENT_INTELLIGENCE',
          inputPrompt: promptSummary,
          rawResponse: JSON.stringify(resultData),
          durationMs,
          success: true,
          cacheStatus: 'MISS',
          fallbackUsed,
        });

        return resultData;
      } catch (err: any) {
        fallbackUsed = true;
        this.quotaManager.handleProviderError(pool, credentialStatus.identifier, err);
        await this.usageTracker.track({
          agent: 'Agent 2',
          provider: credentialStatus.provider,
          credentialIdentifier: credentialStatus.identifier,
          model: credentialStatus.model,
          requestType: 'EVENT_INTELLIGENCE',
          inputPrompt: promptSummary,
          rawResponse: '',
          durationMs: Date.now() - startTime,
          success: false,
          errorMessage: err.message,
          cacheStatus: 'MISS',
          fallbackUsed: true,
        });
      }
    }

    // Graceful Fallback to Mock Provider if all credentials/pools failed
    if (env.ENABLE_MOCK_AI_FALLBACK) {
      logger.info('[AIGateway] Using offline Mock AI Provider fallback...');
      const mockRes = await this.mockProvider.analyzeEvent(event);
      await this.usageTracker.track({
        agent: 'Agent 2',
        provider: 'MOCK',
        credentialIdentifier: 'MOCK_FALLBACK',
        model: 'mock-model',
        requestType: 'EVENT_INTELLIGENCE',
        inputPrompt: promptSummary,
        rawResponse: JSON.stringify(mockRes.data),
        durationMs: Date.now() - startTime,
        success: true,
        cacheStatus: 'MISS',
        fallbackUsed: true,
      });
      return mockRes.data;
    }

    throw new Error('All AI Providers and credentials in Gateway pool failed for analyzeEvent.');
  }

  public async refineRecommendations(
    studentProfile: any,
    topCandidates: any[]
  ): Promise<StructuredRecommendationOutput> {
    const startTime = Date.now();
    const promptSummary = `Refine Recommendations for Student: ${studentProfile.fullName} (${topCandidates.length} candidates)`;

    if (env.AI_PRIMARY_PROVIDER === 'MOCK' || process.env.AI_PRIMARY_PROVIDER === 'MOCK') {
      const mockRes = await this.mockProvider.refineRecommendations(studentProfile, topCandidates);
      await this.usageTracker.track({
        agent: 'Agent 1',
        provider: 'MOCK',
        credentialIdentifier: 'MOCK_KEY',
        model: 'mock-model',
        requestType: 'RECOMMENDATION_REFINEMENT',
        inputPrompt: promptSummary,
        rawResponse: JSON.stringify(mockRes.data),
        durationMs: Date.now() - startTime,
        success: true,
        cacheStatus: 'MISS',
        fallbackUsed: false,
      });
      return mockRes.data;
    }

    let attempts = 0;
    const maxAttempts = 5;
    let fallbackUsed = false;

    while (attempts < maxAttempts) {
      attempts++;
      const selection = this.providerSelector.selectCredential('AGENT_1_RECOMMENDATION');

      if (!selection) {
        logger.warn('[AIGateway] All AI Provider credentials in pool unavailable or cooling down.');
        break;
      }

      const { pool, credentialStatus } = selection;
      try {
        logger.info(`[AIGateway] [Agent 1] Invoking ${credentialStatus.provider} via ${credentialStatus.identifier}...`);
        const resultData = await this.executeRecommendationRefinement(credentialStatus, studentProfile, topCandidates);
        pool.markSuccess(credentialStatus.identifier);

        const durationMs = Date.now() - startTime;
        await this.usageTracker.track({
          agent: 'Agent 1',
          provider: credentialStatus.provider,
          credentialIdentifier: credentialStatus.identifier,
          model: credentialStatus.model,
          requestType: 'RECOMMENDATION_REFINEMENT',
          inputPrompt: promptSummary,
          rawResponse: JSON.stringify(resultData),
          durationMs,
          success: true,
          cacheStatus: 'MISS',
          fallbackUsed,
        });

        return resultData;
      } catch (err: any) {
        fallbackUsed = true;
        this.quotaManager.handleProviderError(pool, credentialStatus.identifier, err);
        await this.usageTracker.track({
          agent: 'Agent 1',
          provider: credentialStatus.provider,
          credentialIdentifier: credentialStatus.identifier,
          model: credentialStatus.model,
          requestType: 'RECOMMENDATION_REFINEMENT',
          inputPrompt: promptSummary,
          rawResponse: '',
          durationMs: Date.now() - startTime,
          success: false,
          errorMessage: err.message,
          cacheStatus: 'MISS',
          fallbackUsed: true,
        });
      }
    }

    if (env.ENABLE_MOCK_AI_FALLBACK) {
      logger.info('[AIGateway] Using offline Mock AI Provider fallback...');
      const mockRes = await this.mockProvider.refineRecommendations(studentProfile, topCandidates);
      await this.usageTracker.track({
        agent: 'Agent 1',
        provider: 'MOCK',
        credentialIdentifier: 'MOCK_FALLBACK',
        model: 'mock-model',
        requestType: 'RECOMMENDATION_REFINEMENT',
        inputPrompt: promptSummary,
        rawResponse: JSON.stringify(mockRes.data),
        durationMs: Date.now() - startTime,
        success: true,
        cacheStatus: 'MISS',
        fallbackUsed: true,
      });
      return mockRes.data;
    }

    throw new Error('All AI Providers and credentials in Gateway pool failed for refineRecommendations.');
  }

  private async executeEventAnalysis(cred: any, event: any): Promise<StructuredEventIntelligence> {
    if (cred.provider === 'GEMINI') {
      const genAI = new GoogleGenerativeAI(cred.secret);
      const model = genAI.getGenerativeModel({
        model: cred.model,
        generationConfig: { responseMimeType: 'application/json' },
      });

      const prompt = `Analyze college event "${event.title}" (${event.description}). Skills: ${event.requiredSkills?.join(', ')}. Return JSON matching schema: {domains, skills, targetAudience, difficulty, careerPaths, prerequisites, learningOutcomes, eventType}`;
      const res = await model.generateContent(prompt);
      return JSON.parse(res.response.text());
    }

    if (cred.provider === 'OPENAI') {
      const openai = new OpenAI({ apiKey: cred.secret });
      const prompt = `Analyze college event "${event.title}" (${event.description}). Return JSON: {domains, skills, targetAudience, difficulty, careerPaths, prerequisites, learningOutcomes, eventType}`;
      const completion = await openai.chat.completions.create({
        model: cred.model,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      });
      return JSON.parse(completion.choices[0].message.content || '{}');
    }

    if (cred.provider === 'HUGGINGFACE') {
      const hf = new HfInference(cred.secret);
      const prompt = `Analyze event "${event.title}" (${event.description}). Return pure JSON object with keys: domains, skills, targetAudience, difficulty, careerPaths, prerequisites, learningOutcomes, eventType.`;
      const res = await hf.chatCompletion({
        model: 'Qwen/Qwen2.5-Coder-32B-Instruct',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
      });
      const content = res.choices[0]?.message?.content || '';
      const match = content.match(/\{[\s\S]*\}/);
      if (!match) throw new Error('Invalid JSON from Hugging Face');
      return JSON.parse(match[0]);
    }

    throw new Error(`Unsupported provider ${cred.provider}`);
  }

  private async executeRecommendationRefinement(cred: any, studentProfile: any, topCandidates: any[]): Promise<StructuredRecommendationOutput> {
    if (cred.provider === 'HUGGINGFACE') {
      const hf = new HfInference(cred.secret);
      const prompt = `Refine recommendations for ${studentProfile.fullName} (${studentProfile.branch}, ${studentProfile.careerGoal}). Candidates: ${JSON.stringify(topCandidates)}. Return pure JSON {"recommendations": [{"eventId": "${topCandidates[0]?.eventId || 'ev-1'}", "reason": "High relevance", "explanation": "Detailed fit for student profile", "action": "recommend"}]}.`;
      const res = await hf.chatCompletion({
        model: 'Qwen/Qwen2.5-Coder-32B-Instruct',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800,
      });
      const content = res.choices[0]?.message?.content || '';
      const match = content.match(/\{[\s\S]*\}/);
      if (!match) throw new Error('Invalid JSON from Hugging Face');
      return JSON.parse(match[0]);
    }

    if (cred.provider === 'GEMINI') {
      const genAI = new GoogleGenerativeAI(cred.secret);
      const model = genAI.getGenerativeModel({
        model: cred.model,
        generationConfig: { responseMimeType: 'application/json' },
      });

      const prompt = `Refine and explain top candidate events for ${studentProfile.fullName} (${studentProfile.branch}, ${studentProfile.careerGoal}). Top Candidates: ${JSON.stringify(topCandidates)}. Return JSON {"recommendations": [{"eventId": "string", "reason": "string", "explanation": "string", "action": "recommend"}]}`;
      const res = await model.generateContent(prompt);
      return JSON.parse(res.response.text());
    }

    if (cred.provider === 'OPENAI') {
      const openai = new OpenAI({ apiKey: cred.secret });
      const prompt = `Refine top candidate events for ${studentProfile.fullName} (${studentProfile.branch}). Candidates: ${JSON.stringify(topCandidates)}. Return JSON: {"recommendations": [{"eventId": "string", "reason": "string", "explanation": "string", "action": "recommend"}]}`;
      const completion = await openai.chat.completions.create({
        model: cred.model,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      });
      return JSON.parse(completion.choices[0].message.content || '{}');
    }

    throw new Error(`Unsupported provider ${cred.provider}`);
  }

  public getPoolStatuses() {
    return {
      gemini: this.geminiPool.getAllStatuses(),
      openai: this.openAiPool.getAllStatuses(),
      huggingface: this.hfPool.getAllStatuses(),
    };
  }
}
