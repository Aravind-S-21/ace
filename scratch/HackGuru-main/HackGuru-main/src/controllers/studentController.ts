import { Request, Response, NextFunction } from 'express';
import { StudentService } from '../services/studentService';
import { StudentIntelligenceService } from '../services/studentIntelligenceService';
import { SkillEvolutionService } from '../services/skillEvolutionService';
import { AdapterFactory } from '../adapters/adapterFactory';
import { ResponseUtil } from '../utils/apiResponse';

export class StudentController {
  private studentService: StudentService;
  private intelligenceService: StudentIntelligenceService;
  private skillEvolutionService: SkillEvolutionService;

  constructor() {
    this.studentService = new StudentService();
    this.intelligenceService = new StudentIntelligenceService();
    this.skillEvolutionService = new SkillEvolutionService();
  }

  public getMe = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const userId = (req as any).user.userId;
      const profile = await this.studentService.getProfileByUserId(userId);
      return ResponseUtil.success(res, profile, 'Student profile fetched successfully');
    } catch (err: any) {
      return ResponseUtil.error(res, err.message, 404);
    }
  };

  public updateMe = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const userId = (req as any).user.userId;
      const updated = await this.studentService.updateProfile(userId, req.body);
      return ResponseUtil.success(res, updated, 'Student profile updated successfully');
    } catch (err: any) {
      return ResponseUtil.error(res, err.message, 400);
    }
  };

  public getInterests = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const interests = await this.studentService.getAllInterests();
      return ResponseUtil.success(res, interests, 'All interests fetched');
    } catch (err: any) {
      return ResponseUtil.error(res, err.message, 500);
    }
  };

  public getMyInterests = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const userId = (req as any).user.userId;
      const profile = await this.studentService.getProfileByUserId(userId);
      return ResponseUtil.success(res, profile?.interests || [], 'Student interests fetched');
    } catch (err: any) {
      return ResponseUtil.error(res, err.message, 404);
    }
  };

  public updateMyInterests = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const userId = (req as any).user.userId;
      const { interestIds, interests } = req.body;
      await this.studentService.updateInterests(userId, interestIds || interests || []);
      const profile = await this.studentService.getProfileByUserId(userId);
      return ResponseUtil.success(res, profile?.interests || [], 'Student interests updated');
    } catch (err: any) {
      return ResponseUtil.error(res, err.message, 400);
    }
  };

  public getMySkills = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const userId = (req as any).user.userId;
      const adapter = AdapterFactory.getAdapter();
      const skills = await adapter.getStudentSkills(userId);
      return ResponseUtil.success(res, skills, 'Student skills fetched');
    } catch (err: any) {
      return ResponseUtil.error(res, err.message, 404);
    }
  };

  public connectGithub = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const userId = (req as any).user.userId;
      const { githubUsername, topLanguages, publicReposCount, totalStars } = req.body;
      const adapter = AdapterFactory.getAdapter();
      const conn = await adapter.upsertGithubConnection(userId, {
        githubUsername,
        topLanguages: topLanguages || ['Python', 'TypeScript'],
        publicReposCount: publicReposCount || 10,
        totalStars: totalStars || 5,
        lastSyncedAt: new Date(),
      });
      return ResponseUtil.success(res, conn, 'GitHub connection updated successfully');
    } catch (err: any) {
      return ResponseUtil.error(res, err.message, 400);
    }
  };

  public getActivities = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const userId = (req as any).user.userId;
      const adapter = AdapterFactory.getAdapter();
      const activities = await adapter.getStudentActivities(userId);
      return ResponseUtil.success(res, activities, 'Student activities fetched');
    } catch (err: any) {
      return ResponseUtil.error(res, err.message, 500);
    }
  };

  public addActivity = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const userId = (req as any).user.userId;
      const adapter = AdapterFactory.getAdapter();
      const activity = await adapter.addStudentActivity(userId, req.body);
      return ResponseUtil.success(res, activity, 'Student activity added');
    } catch (err: any) {
      return ResponseUtil.error(res, err.message, 400);
    }
  };

  public getSkillEvolution = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const userId = (req as any).user.userId;
      const adapter = AdapterFactory.getAdapter();
      const history = await adapter.getSkillEvolutionHistory(userId);
      return ResponseUtil.success(res, history, 'Skill evolution history fetched');
    } catch (err: any) {
      return ResponseUtil.error(res, err.message, 500);
    }
  };

  public getIntelligenceProfile = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const userId = (req as any).user.userId;
      const profile = await this.intelligenceService.generateStudentIntelligenceProfile(userId);
      return ResponseUtil.success(res, profile, 'Student AI intelligence profile generated');
    } catch (err: any) {
      return ResponseUtil.error(res, err.message, 500);
    }
  };

  public participateInEvent = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const userId = (req as any).user.userId;
      const { eventId, skillsGained, outcome } = req.body;
      const result = await this.skillEvolutionService.recordEventParticipationAndSkillEvolution(
        userId,
        eventId,
        skillsGained || ['Generative AI'],
        outcome || 'COMPLETED'
      );
      return ResponseUtil.success(res, result, 'Event participation recorded and skill evolution updated');
    } catch (err: any) {
      return ResponseUtil.error(res, err.message, 400);
    }
  };
}
