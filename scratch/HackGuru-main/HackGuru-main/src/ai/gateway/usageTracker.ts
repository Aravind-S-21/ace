import { AIUsageRepository } from '../../repositories/aiUsageRepository';
import { AIUsageMetrics } from '../../types/ai.types';

export interface ExtendedUsageLog {
  agent: string;
  provider: 'GEMINI' | 'OPENAI' | 'HUGGINGFACE' | 'MOCK';
  credentialIdentifier: string;
  model: string;
  requestType: 'EVENT_INTELLIGENCE' | 'RECOMMENDATION_REFINEMENT';
  inputPrompt: string;
  rawResponse: string;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  estimatedCost?: number;
  durationMs: number;
  success: boolean;
  errorMessage?: string;
  cacheStatus: 'HIT' | 'MISS';
  fallbackUsed: boolean;
}

export class UsageTracker {
  private repo: AIUsageRepository;

  constructor() {
    this.repo = new AIUsageRepository();
  }

  public async track(log: ExtendedUsageLog): Promise<void> {
    const metrics: AIUsageMetrics = {
      provider: log.provider,
      model: log.model,
      requestType: log.requestType,
      inputTokens: log.inputTokens,
      outputTokens: log.outputTokens,
      totalTokens: log.totalTokens,
      estimatedCost: log.estimatedCost,
      durationMs: log.durationMs,
      success: log.success,
      errorMessage: log.errorMessage,
    };

    await this.repo.logUsage(metrics);

    const safePromptSummary = `[${log.agent}] [Credential: ${log.credentialIdentifier}] [Cache: ${log.cacheStatus}] [Fallback: ${log.fallbackUsed}] - ${log.inputPrompt}`;

    await this.repo.logRequest({
      provider: log.provider,
      model: log.model,
      requestType: log.requestType,
      inputPrompt: safePromptSummary,
      rawResponse: log.rawResponse,
      durationMs: log.durationMs,
      success: log.success,
      errorMessage: log.errorMessage,
    });
  }
}
