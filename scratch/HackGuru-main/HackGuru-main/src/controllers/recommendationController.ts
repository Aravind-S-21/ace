import { Request, Response, NextFunction } from 'express';
import { RecommendationAgent } from '../agents/recommendation.agent';
import { StudentRepository } from '../repositories/studentRepository';
import { ResponseUtil } from '../utils/apiResponse';
import { AdapterFactory } from '../adapters/adapterFactory';
import { IDatabaseAdapter } from '../adapters/databaseAdapter.interface';

export class RecommendationController {
  private recommendationAgent: RecommendationAgent;
  private studentRepository: StudentRepository;

  private get adapter(): IDatabaseAdapter {
    return AdapterFactory.getAdapter();
  }

  constructor() {
    this.recommendationAgent = new RecommendationAgent();
    this.studentRepository = new StudentRepository();
  }

  public getRecommendations = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const studentId = (req as any).user.studentId;
      const existing = await this.adapter.findRecommendationsByStudentId(studentId);

      if (existing.length > 0) {
        return ResponseUtil.success(res, existing, 'Personalized recommendations fetched');
      }

      // Generate if empty
      const student = await this.studentRepository.findById(studentId);
      const generated = await this.recommendationAgent.generatePersonalizedRecommendations(student);
      return ResponseUtil.success(res, generated, 'Personalized recommendations generated');
    } catch (err: any) {
      return ResponseUtil.error(res, err.message, 500);
    }
  };

  public refreshRecommendations = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const studentId = (req as any).user.studentId;
      const student = await this.studentRepository.findById(studentId);
      const refreshed = await this.recommendationAgent.generatePersonalizedRecommendations(student, 10);
      return ResponseUtil.success(res, refreshed, 'Recommendations refreshed successfully');
    } catch (err: any) {
      return ResponseUtil.error(res, err.message, 500);
    }
  };
}
