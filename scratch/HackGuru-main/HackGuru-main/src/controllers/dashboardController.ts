import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboardService';
import { ResponseUtil } from '../utils/apiResponse';

export class DashboardController {
  private dashboardService: DashboardService;

  constructor() {
    this.dashboardService = new DashboardService();
  }

  public getDashboard = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const userId = (req as any).user.userId;
      const aggregatedData = await this.dashboardService.getAggregatedDashboard(userId);
      return ResponseUtil.success(res, aggregatedData, 'Aggregated student dashboard fetched successfully');
    } catch (err: any) {
      return ResponseUtil.error(res, err.message, 500);
    }
  };
}
