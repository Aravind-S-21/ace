import { AdapterFactory } from '../adapters/adapterFactory';
import { IDatabaseAdapter } from '../adapters/databaseAdapter.interface';
import { AIUsageMetrics } from '../types/ai.types';

export class AIUsageRepository {
  private get adapter(): IDatabaseAdapter {
    return AdapterFactory.getAdapter();
  }

  public async logUsage(metrics: AIUsageMetrics): Promise<any> {
    return this.adapter.logAIUsage(metrics);
  }

  public async logRequest(data: {
    provider: string;
    model: string;
    requestType: string;
    inputPrompt: string;
    rawResponse: string;
    durationMs: number;
    success: boolean;
    errorMessage?: string;
  }): Promise<any> {
    return this.adapter.logAIRequest(data);
  }

  public async getUsageSummary(): Promise<any> {
    return this.adapter.getAIUsageSummary();
  }
}
