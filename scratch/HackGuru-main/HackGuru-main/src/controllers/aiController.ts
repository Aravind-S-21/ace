import { Request, Response } from 'express';
import { AIUsageRepository } from '../repositories/aiUsageRepository';
import { AIService } from '../ai/ai.service';
import { ResponseUtil } from '../utils/apiResponse';

export async function getAIUsage(req: Request, res: Response): Promise<void> {
  try {
    const aiUsageRepo = new AIUsageRepository();
    const aiService = new AIService();

    const summary = await aiUsageRepo.getUsageSummary();
    const poolStatuses = aiService.getGatewayStatuses();

    ResponseUtil.success(
      res,
      {
        usageSummary: summary,
        gatewayPools: poolStatuses,
      },
      'AI Usage Telemetry and Gateway Pool Status retrieved successfully'
    );
  } catch (err: any) {
    ResponseUtil.error(res, `Failed to retrieve AI usage: ${err.message}`, 500);
  }
}
