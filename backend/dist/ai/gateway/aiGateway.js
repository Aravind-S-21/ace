"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIGateway = void 0;
const providerPool_1 = require("./providerPool");
const quotaManager_1 = require("./quotaManager");
const providerSelector_1 = require("./providerSelector");
const usageTracker_1 = require("./usageTracker");
const MockAIProvider_1 = require("../providers/MockAIProvider");
const env_1 = require("../../config/env");
const logger_1 = require("../../utils/logger");
const genai_1 = require("@google/genai");
const crypto_1 = __importDefault(require("crypto"));
class AIGateway {
    geminiPool;
    openAiPool;
    hfPool;
    quotaManager;
    providerSelector;
    usageTracker;
    mockProvider;
    constructor() {
        this.geminiPool = new providerPool_1.ProviderPool('GEMINI', env_1.env.GEMINI_MODEL, env_1.env.GEMINI_CREDENTIALS);
        this.openAiPool = new providerPool_1.ProviderPool('OPENAI', env_1.env.OPENAI_MODEL, env_1.env.OPENAI_CREDENTIALS);
        this.hfPool = new providerPool_1.ProviderPool('HUGGINGFACE', env_1.env.HUGGINGFACE_MODEL, env_1.env.HF_CREDENTIALS);
        this.quotaManager = new quotaManager_1.QuotaManager();
        this.providerSelector = new providerSelector_1.ProviderSelector({
            geminiPool: this.geminiPool,
            openAiPool: this.openAiPool,
            hfPool: this.hfPool,
        });
        this.usageTracker = new usageTracker_1.UsageTracker();
        this.mockProvider = new MockAIProvider_1.MockAIProvider();
    }
    computeEventContentHash(eventData) {
        const rawString = `${eventData.title}_${eventData.description}_${eventData.category}_${eventData.requiredSkills?.join(',')}_${eventData.eligibility}`;
        return crypto_1.default.createHash('sha256').update(rawString).digest('hex');
    }
    async analyzeEvent(event) {
        const startTime = Date.now();
        const promptSummary = `Analyze Event: ${event.title} (${event.category})`;
        if (env_1.env.AI_PRIMARY_PROVIDER === 'MOCK' || process.env.AI_PRIMARY_PROVIDER === 'MOCK') {
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
                logger_1.logger.warn('[AIGateway] All AI Provider credentials in pool unavailable or cooling down.');
                break;
            }
            const { pool, credentialStatus } = selection;
            try {
                logger_1.logger.info(`[AIGateway] [Agent 2] Invoking ${credentialStatus.provider} via ${credentialStatus.identifier}...`);
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
            }
            catch (err) {
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
        if (env_1.env.ENABLE_MOCK_AI_FALLBACK) {
            logger_1.logger.info('[AIGateway] Using offline Mock AI Provider fallback...');
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
    async refineRecommendations(studentProfile, topCandidates) {
        const startTime = Date.now();
        const promptSummary = `Refine Recommendations for Student: ${studentProfile.fullName} (${topCandidates.length} candidates)`;
        if (env_1.env.AI_PRIMARY_PROVIDER === 'MOCK' || process.env.AI_PRIMARY_PROVIDER === 'MOCK') {
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
                logger_1.logger.warn('[AIGateway] All AI Provider credentials in pool unavailable or cooling down.');
                break;
            }
            const { pool, credentialStatus } = selection;
            try {
                logger_1.logger.info(`[AIGateway] [Agent 1] Invoking ${credentialStatus.provider} via ${credentialStatus.identifier}...`);
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
            }
            catch (err) {
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
        if (env_1.env.ENABLE_MOCK_AI_FALLBACK) {
            logger_1.logger.info('[AIGateway] Using offline Mock AI Provider fallback...');
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
    async executeEventAnalysis(cred, event) {
        if (cred.provider === 'GEMINI') {
            const ai = new genai_1.GoogleGenAI({ apiKey: cred.secret });
            const prompt = `Analyze college event "${event.title}" (${event.description}). Skills: ${event.requiredSkills?.join(', ')}. Return JSON matching schema: {domains, skills, targetAudience, difficulty, careerPaths, prerequisites, learningOutcomes, eventType}`;
            const res = await ai.models.generateContent({
                model: cred.model,
                contents: prompt,
                config: { responseMimeType: 'application/json' },
            });
            return JSON.parse(res.text || '{}');
        }
        throw new Error(`Unsupported provider ${cred.provider}`);
    }
    async executeRecommendationRefinement(cred, studentProfile, topCandidates) {
        if (cred.provider === 'GEMINI') {
            const ai = new genai_1.GoogleGenAI({ apiKey: cred.secret });
            const prompt = `Refine and explain top candidate events for ${studentProfile.fullName} (${studentProfile.branch}, ${studentProfile.careerGoal}). Top Candidates: ${JSON.stringify(topCandidates)}. Return JSON {"recommendations": [{"eventId": "string", "reason": "string", "explanation": "string", "action": "recommend"}]}`;
            const res = await ai.models.generateContent({
                model: cred.model,
                contents: prompt,
                config: { responseMimeType: 'application/json' },
            });
            return JSON.parse(res.text || '{}');
        }
        throw new Error(`Unsupported provider ${cred.provider}`);
    }
    getPoolStatuses() {
        return {
            gemini: this.geminiPool.getAllStatuses(),
            openai: this.openAiPool.getAllStatuses(),
            huggingface: this.hfPool.getAllStatuses(),
        };
    }
}
exports.AIGateway = AIGateway;
