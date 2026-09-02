import { AIUsageMetrics } from '../../types/ai.types';

export interface IDatabaseAdapter {
  // Users & Profiles
  findUserById(id: string | bigint): Promise<any>;
  findUserByEmail(email: string): Promise<any>;
  createUser(data: any): Promise<any>;
  updateUser(id: string | bigint, data: any): Promise<any>;
  findStudentByUserId(userId: string | bigint): Promise<any>;
  findStudentById(id: string | bigint): Promise<any>;
  createStudentProfile(data: any): Promise<any>;
  updateStudentProfile(id: string | bigint, data: any): Promise<any>;
  updateStudentInterests(studentId: string | bigint, interests: any[]): Promise<any>;
  updateStudentSkills(studentId: string | bigint, skills: any[]): Promise<any>;
  getAllInterests(): Promise<any[]>;
  getAllSkills(): Promise<any[]>;

  // GitHub Connections
  getGithubConnection(userId: string | bigint): Promise<any>;
  upsertGithubConnection(userId: string | bigint, data: any): Promise<any>;

  // Student AI Summary
  getStudentAiSummary(userId: string | bigint): Promise<any>;
  upsertStudentAiSummary(userId: string | bigint, data: any): Promise<any>;

  // Dedicated Student Skills
  getStudentSkills(userId: string | bigint): Promise<any[]>;
  addStudentSkill(userId: string | bigint, skillData: any): Promise<any>;
  updateStudentSkill(userId: string | bigint, skillName: string, proficiency: number): Promise<any>;

  // Skill Evolution History
  logSkillEvolution(data: {
    userId: string | bigint;
    skillName: string;
    previousProficiency: number;
    newProficiency: number;
    changeReason?: string;
    eventId?: string | bigint;
  }): Promise<any>;
  getSkillEvolutionHistory(userId: string | bigint): Promise<any[]>;

  // Student Activities
  getStudentActivities(userId: string | bigint): Promise<any[]>;
  addStudentActivity(userId: string | bigint, activityData: any): Promise<any>;

  // Event Participation
  getEventParticipations(userId: string | bigint): Promise<any[]>;
  registerEventParticipation(userId: string | bigint, eventId: string | bigint, status?: string): Promise<any>;
  updateEventParticipation(userId: string | bigint, eventId: string | bigint, data: any): Promise<any>;

  // Events & Categories
  getEventById(id: string | bigint): Promise<any>;
  findEventById(id: string | bigint): Promise<any>;
  findAllEvents(params?: any): Promise<any[]>;
  getCandidateEventsForStudent(limit?: number): Promise<any[]>;
  listEvents(filters?: any): Promise<any[]>;
  createEvent(data: any): Promise<any>;

  // Event AI Analysis & Analytics
  getEventAiAnalysis(eventId: string | bigint): Promise<any>;
  upsertEventAiAnalysis(eventId: string | bigint, analysisData: any): Promise<any>;
  upsertEventIntelligence(eventId: string | bigint, analysisData: any): Promise<any>;
  getEventAnalytics(eventId: string | bigint): Promise<any>;
  updateEventAnalytics(eventId: string | bigint, analyticsData: any): Promise<any>;

  // Category Details
  getHackathonDetails(eventId: string | bigint): Promise<any>;
  getInternshipDetails(eventId: string | bigint): Promise<any>;
  getProjectDetails(eventId: string | bigint): Promise<any>;
  getWorkshopDetails(eventId: string | bigint): Promise<any>;

  // User Interactions & Telemetry
  logInteraction(data: { userId?: string | bigint; studentId?: string | bigint; eventId: string | bigint; action: string; metadata?: any }): Promise<any>;
  getStudentInteractions(userId: string | bigint): Promise<any[]>;

  // Calendar & Notifications
  addCalendarEvent(data: any): Promise<any>;
  getStudentCalendarEvents(studentId: string | bigint): Promise<any[]>;
  removeCalendarEvent(id: string): Promise<any>;
  createNotification(data: any): Promise<any>;
  getStudentNotifications(studentId: string | bigint): Promise<any[]>;
  markNotificationAsRead(id: string): Promise<any>;

  // Recommendations
  getRecommendations(userId: string | bigint): Promise<any[]>;
  findRecommendationsByStudentId(userId: string | bigint): Promise<any[]>;
  upsertRecommendation(dataOrStudentId: any, eventId?: string | bigint, score?: number, reason?: string): Promise<any>;
  saveRecommendations(userId: string | bigint, recommendations: any[]): Promise<any>;

  // AI Telemetry (Safe in-memory / stdout fallback if DB tables absent)
  logAIUsage(metrics: AIUsageMetrics): Promise<any>;
  logAIRequest(data: any): Promise<any>;
  getAIUsageSummary(): Promise<any>;
}
