import { PrismaClient } from '@prisma/client';
import { IDatabaseAdapter } from './databaseAdapter.interface';
import { AIUsageMetrics } from '../../types/ai.types';

export class PrismaDatabaseAdapter implements IDatabaseAdapter {
  private prisma: PrismaClient;
  private memoryTelemetryLogs: AIUsageMetrics[] = [];

  constructor() {
    this.prisma = new PrismaClient();
  }

  private toBigInt(id: string | bigint): bigint {
    if (typeof id === 'bigint') return id;
    const parsed = parseInt(id, 10);
    return isNaN(parsed) ? BigInt(0) : BigInt(parsed);
  }

  public async findUserById(id: string | bigint): Promise<any> {
    return this.prisma.user.findUnique({
      where: { userId: this.toBigInt(id) },
      include: {
        githubConnection: true,
        studentAiSummary: true,
        studentSkills: true,
        studentActivities: true,
      },
    });
  }

  public async findUserByEmail(email: string): Promise<any> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  public async createUser(data: any): Promise<any> {
    return this.prisma.user.create({
      data: {
        fullName: data.fullName || 'Student User',
        email: data.email,
        department: data.department || data.branch,
        college: data.collegeName || data.college,
        location: data.location,
        careerGoal: data.careerGoal,
        skills: data.skills || [],
        interests: data.interests || [],
      },
    });
  }

  public async updateUser(id: string | bigint, data: any): Promise<any> {
    return this.prisma.user.update({
      where: { userId: this.toBigInt(id) },
      data,
    });
  }

  public async findStudentByUserId(userId: string | bigint): Promise<any> {
    return this.findUserById(userId);
  }

  public async findStudentById(id: string | bigint): Promise<any> {
    return this.findUserById(id);
  }

  public async createStudentProfile(data: any): Promise<any> {
    return this.createUser(data);
  }

  public async updateStudentProfile(id: string | bigint, data: any): Promise<any> {
    return this.updateUser(id, data);
  }

  public async updateStudentInterests(studentId: string | bigint, interests: any[]): Promise<any> {
    return this.updateUser(studentId, { interests });
  }

  public async updateStudentSkills(studentId: string | bigint, skills: any[]): Promise<any> {
    for (const s of skills) {
      const name = typeof s === 'string' ? s : s.name || s.skillName;
      const prof = typeof s === 'object' ? s.proficiencyScore || 50 : 50;
      if (name) {
        await this.updateStudentSkill(studentId, name, prof);
      }
    }
    return this.getStudentSkills(studentId);
  }

  public async getAllInterests(): Promise<any[]> {
    return [
      { id: 'int-ai', name: 'Artificial Intelligence', category: 'AI & ML' },
      { id: 'int-web', name: 'Web Development', category: 'Software' },
      { id: 'int-mobile', name: 'Mobile App Development', category: 'Software' },
      { id: 'int-cloud', name: 'Cloud Computing', category: 'DevOps' },
      { id: 'int-cyber', name: 'Cybersecurity', category: 'Security' },
    ];
  }

  public async getAllSkills(): Promise<any[]> {
    return [
      { id: 'skill-python', name: 'Python', category: 'Programming' },
      { id: 'skill-ts', name: 'TypeScript', category: 'Programming' },
      { id: 'skill-react', name: 'React', category: 'Frontend' },
      { id: 'skill-node', name: 'Node.js', category: 'Backend' },
      { id: 'skill-pg', name: 'PostgreSQL', category: 'Database' },
    ];
  }

  public async getGithubConnection(userId: string | bigint): Promise<any> {
    return this.prisma.githubConnection.findUnique({
      where: { userId: this.toBigInt(userId) },
    });
  }

  public async upsertGithubConnection(userId: string | bigint, data: any): Promise<any> {
    const bId = this.toBigInt(userId);
    return this.prisma.githubConnection.upsert({
      where: { userId: bId },
      create: { userId: bId, ...data },
      update: data,
    });
  }

  public async getStudentAiSummary(userId: string | bigint): Promise<any> {
    return this.prisma.studentAiSummary.findUnique({
      where: { userId: this.toBigInt(userId) },
    });
  }

  public async upsertStudentAiSummary(userId: string | bigint, data: any): Promise<any> {
    const bId = this.toBigInt(userId);
    return this.prisma.studentAiSummary.upsert({
      where: { userId: bId },
      create: { userId: bId, ...data },
      update: data,
    });
  }

  public async getStudentSkills(userId: string | bigint): Promise<any[]> {
    return this.prisma.studentSkill.findMany({
      where: { userId: this.toBigInt(userId) },
    });
  }

  public async addStudentSkill(userId: string | bigint, skillData: any): Promise<any> {
    return this.prisma.studentSkill.create({
      data: {
        userId: this.toBigInt(userId),
        ...skillData,
      },
    });
  }

  public async updateStudentSkill(userId: string | bigint, skillName: string, proficiency: number): Promise<any> {
    const bId = this.toBigInt(userId);
    return this.prisma.studentSkill.upsert({
      where: {
        userId_skillName: { userId: bId, skillName },
      },
      create: {
        userId: bId,
        skillName,
        proficiencyScore: proficiency,
      },
      update: {
        proficiencyScore: proficiency,
        lastUpdatedAt: new Date(),
      },
    });
  }

  public async logSkillEvolution(data: any): Promise<any> {
    return this.prisma.skillEvolution.create({
      data: {
        userId: this.toBigInt(data.userId),
        skillName: data.skillName,
        previousProficiency: data.previousProficiency,
        newProficiency: data.newProficiency,
        changeReason: data.changeReason,
        eventId: data.eventId ? this.toBigInt(data.eventId) : undefined,
      },
    });
  }

  public async getSkillEvolutionHistory(userId: string | bigint): Promise<any[]> {
    return this.prisma.skillEvolution.findMany({
      where: { userId: this.toBigInt(userId) },
      orderBy: { recordedAt: 'desc' },
    });
  }

  public async getStudentActivities(userId: string | bigint): Promise<any[]> {
    return this.prisma.studentActivity.findMany({
      where: { userId: this.toBigInt(userId) },
    });
  }

  public async addStudentActivity(userId: string | bigint, activityData: any): Promise<any> {
    return this.prisma.studentActivity.create({
      data: {
        userId: this.toBigInt(userId),
        ...activityData,
      },
    });
  }

  public async getEventParticipations(userId: string | bigint): Promise<any[]> {
    return this.prisma.eventParticipation.findMany({
      where: { userId: this.toBigInt(userId) },
      include: { event: true },
    });
  }

  public async registerEventParticipation(userId: string | bigint, eventId: string | bigint, status: string = 'REGISTERED'): Promise<any> {
    const uId = this.toBigInt(userId);
    const eId = this.toBigInt(eventId);
    return this.prisma.eventParticipation.upsert({
      where: { userId_eventId: { userId: uId, eventId: eId } },
      create: { userId: uId, eventId: eId, participationStatus: status },
      update: { participationStatus: status },
    });
  }

  public async updateEventParticipation(userId: string | bigint, eventId: string | bigint, data: any): Promise<any> {
    const uId = this.toBigInt(userId);
    const eId = this.toBigInt(eventId);
    return this.prisma.eventParticipation.update({
      where: { userId_eventId: { userId: uId, eventId: eId } },
      data,
    });
  }

  public async getEventById(id: string | bigint): Promise<any> {
    return this.prisma.event.findUnique({
      where: { eventId: this.toBigInt(id) },
      include: { aiAnalysis: true, analytics: true },
    });
  }

  public async findEventById(id: string | bigint): Promise<any> {
    return this.getEventById(id);
  }

  public async findAllEvents(params?: any): Promise<any[]> {
    return this.listEvents(params);
  }

  public async getCandidateEventsForStudent(limit: number = 500): Promise<any[]> {
    return this.listEvents({ limit });
  }

  public async listEvents(filters?: any): Promise<any[]> {
    return this.prisma.event.findMany({
      take: filters?.limit || 50,
      include: { aiAnalysis: true, analytics: true },
    });
  }

  public async createEvent(data: any): Promise<any> {
    return this.prisma.event.create({
      data,
    });
  }

  public async getEventAiAnalysis(eventId: string | bigint): Promise<any> {
    return this.prisma.eventAiAnalysis.findUnique({
      where: { eventId: this.toBigInt(eventId) },
    });
  }

  public async upsertEventAiAnalysis(eventId: string | bigint, analysisData: any): Promise<any> {
    const eId = this.toBigInt(eventId);
    return this.prisma.eventAiAnalysis.upsert({
      where: { eventId: eId },
      create: { eventId: eId, ...analysisData },
      update: analysisData,
    });
  }

  public async upsertEventIntelligence(eventId: string | bigint, analysisData: any): Promise<any> {
    return this.upsertEventAiAnalysis(eventId, analysisData);
  }

  public async getEventAnalytics(eventId: string | bigint): Promise<any> {
    return this.prisma.eventAnalytics.findUnique({
      where: { eventId: this.toBigInt(eventId) },
    });
  }

  public async updateEventAnalytics(eventId: string | bigint, analyticsData: any): Promise<any> {
    const eId = this.toBigInt(eventId);
    return this.prisma.eventAnalytics.upsert({
      where: { eventId: eId },
      create: { eventId: eId, ...analyticsData },
      update: analyticsData,
    });
  }

  public async getHackathonDetails(eventId: string | bigint): Promise<any> {
    return this.prisma.hackathonDetail.findUnique({
      where: { eventId: this.toBigInt(eventId) },
    });
  }

  public async getInternshipDetails(eventId: string | bigint): Promise<any> {
    return this.prisma.internshipDetail.findUnique({
      where: { eventId: this.toBigInt(eventId) },
    });
  }

  public async getProjectDetails(eventId: string | bigint): Promise<any> {
    return this.prisma.projectDetail.findUnique({
      where: { eventId: this.toBigInt(eventId) },
    });
  }

  public async getWorkshopDetails(eventId: string | bigint): Promise<any> {
    return this.prisma.workshopDetail.findUnique({
      where: { eventId: this.toBigInt(eventId) },
    });
  }

  public async logInteraction(data: any): Promise<any> {
    return this.prisma.userInteraction.create({
      data: {
        userId: this.toBigInt(data.userId || data.studentId || 1),
        eventId: this.toBigInt(data.eventId),
        interactionType: data.action as any,
      },
    });
  }

  public async getStudentInteractions(userId: string | bigint): Promise<any[]> {
    return this.prisma.userInteraction.findMany({
      where: { userId: this.toBigInt(userId) },
      include: { event: true },
    });
  }

  public async addCalendarEvent(data: any): Promise<any> {
    return { id: `cal_${Date.now()}`, ...data };
  }

  public async getStudentCalendarEvents(studentId: string | bigint): Promise<any[]> {
    return [];
  }

  public async removeCalendarEvent(id: string): Promise<any> {
    return { success: true };
  }

  public async createNotification(data: any): Promise<any> {
    return { id: `notif_${Date.now()}`, isRead: false, ...data };
  }

  public async getStudentNotifications(studentId: string | bigint): Promise<any[]> {
    return [];
  }

  public async markNotificationAsRead(id: string): Promise<any> {
    return { success: true };
  }

  public async getRecommendations(userId: string | bigint): Promise<any[]> {
    return this.prisma.recommendation.findMany({
      where: { userId: this.toBigInt(userId) },
      include: { event: true },
    });
  }

  public async findRecommendationsByStudentId(userId: string | bigint): Promise<any[]> {
    return this.getRecommendations(userId);
  }

  public async upsertRecommendation(dataOrStudentId: any, eventId?: string | bigint, score?: number, reason?: string): Promise<any> {
    let studentId = dataOrStudentId;
    let targetEventId = eventId;
    let targetScore = score || 0.9;
    let targetReason = reason || 'Recommended';

    if (typeof dataOrStudentId === 'object' && dataOrStudentId !== null) {
      studentId = dataOrStudentId.studentId || dataOrStudentId.userId;
      targetEventId = dataOrStudentId.eventId;
      targetScore = dataOrStudentId.score || 0.9;
      targetReason = dataOrStudentId.reason || dataOrStudentId.explanation || 'Recommended';
    }

    const uId = this.toBigInt(studentId || '1');
    const eId = this.toBigInt(targetEventId || '1');

    return this.prisma.recommendation.upsert({
      where: { userId_eventId: { userId: uId, eventId: eId } },
      create: { userId: uId, eventId: eId, matchScore: targetScore, recommendationReason: targetReason },
      update: { matchScore: targetScore, recommendationReason: targetReason },
    });
  }

  public async saveRecommendations(userId: string | bigint, recommendationsList: any[]): Promise<any> {
    const uId = this.toBigInt(userId);
    const results: any[] = [];

    for (const rec of recommendationsList) {
      const eId = this.toBigInt(rec.eventId);
      const item = await this.prisma.recommendation.upsert({
        where: { userId_eventId: { userId: uId, eventId: eId } },
        create: {
          userId: uId,
          eventId: eId,
          matchScore: rec.score || 0.9,
          recommendationReason: rec.reason || rec.explanation,
        },
        update: {
          matchScore: rec.score || 0.9,
          recommendationReason: rec.reason || rec.explanation,
        },
      });
      results.push(item);
    }
    return results;
  }

  // Safe in-memory / stdout fallback for telemetry (ACE schema has no telemetry tables)
  public async logAIUsage(metrics: AIUsageMetrics): Promise<any> {
    this.memoryTelemetryLogs.push(metrics);
    console.log(`[AI TELEMETRY LOG] ${metrics.provider} | ${metrics.model} | ${metrics.requestType} | success: ${metrics.success}`);
    return { id: `log_${Date.now()}`, ...metrics };
  }

  public async logAIRequest(data: any): Promise<any> {
    console.log(`[AI REQUEST LOG] ${data.provider} | ${data.model} | ${data.requestType} | duration: ${data.durationMs}ms`);
    return { id: `req_${Date.now()}`, ...data };
  }

  public async getAIUsageSummary(): Promise<any> {
    const totalRequests = this.memoryTelemetryLogs.length;
    const successfulRequests = this.memoryTelemetryLogs.filter(l => l.success).length;
    const totalTokens = this.memoryTelemetryLogs.reduce((acc, curr) => acc + (curr.totalTokens || 0), 0);
    const totalEstimatedCost = this.memoryTelemetryLogs.reduce((acc, curr) => acc + (curr.estimatedCost || 0.0), 0);

    return {
      totalRequests,
      successfulRequests,
      failedRequests: totalRequests - successfulRequests,
      totalTokens,
      totalEstimatedCost,
    };
  }
}
