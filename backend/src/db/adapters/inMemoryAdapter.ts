import { IDatabaseAdapter } from './databaseAdapter.interface';
import { AIUsageMetrics } from '../../types/ai.types';

export class InMemoryDatabaseAdapter implements IDatabaseAdapter {
  private users: Map<string, any> = new Map();
  private events: Map<string, any> = new Map();
  private eventAiAnalysis: Map<string, any> = new Map();
  private eventAnalytics: Map<string, any> = new Map();
  private githubConnections: Map<string, any> = new Map();
  private studentAiSummaries: Map<string, any> = new Map();
  private studentSkills: Map<string, any[]> = new Map();
  private skillEvolutions: Map<string, any[]> = new Map();
  private studentActivities: Map<string, any[]> = new Map();
  private eventParticipations: Map<string, any[]> = new Map();
  private hackathonDetails: Map<string, any> = new Map();
  private internshipDetails: Map<string, any> = new Map();
  private projectDetails: Map<string, any> = new Map();
  private workshopDetails: Map<string, any> = new Map();
  private userInteractions: Map<string, any[]> = new Map();
  private calendarEvents: Map<string, any[]> = new Map();
  private notifications: Map<string, any[]> = new Map();
  private recommendations: Map<string, any[]> = new Map();
  private aiLogs: any[] = [];
  private aiRequests: any[] = [];

  constructor() {
    this.seedSampleData();
  }

  private seedSampleData() {
    const sampleEvent = {
      id: 'event-contract-1',
      eventId: '1',
      title: 'HackGURU Shared DB AI Hackathon 2026',
      description: 'Build production AI agent systems using Gemini and PostgreSQL.',
      category: 'AI & ML',
      eligibility: 'Open to all undergraduates',
      requiredSkills: ['Python', 'Generative AI', 'PostgreSQL'],
      location: 'Bengaluru / Hybrid',
      duration: '48 Hours',
      startDate: new Date(),
      endDate: new Date(Date.now() + 172800000),
      registrationDeadline: new Date(Date.now() + 86400000),
      organizer: 'AllCollegeEvent Engine',
      externalUrl: 'https://allcollegeevent.com/hackguru-2026',
      isRaw: false,
    };
    this.events.set('event-contract-1', sampleEvent);
    this.events.set('1', sampleEvent);

    this.eventAiAnalysis.set('1', {
      eventId: '1',
      domains: ['AI & ML', 'Generative AI', 'Software Engineering'],
      skills: ['Python', 'PostgreSQL', 'LLMs'],
      targetAudience: ['Computer Science', 'Data Science'],
      difficulty: 'INTERMEDIATE',
      careerPaths: ['AI Engineer', 'Backend Developer'],
      prerequisites: ['Python Basics'],
      learningOutcomes: ['Multi-agent architecture', 'Vector search'],
      eventType: 'HACKATHON',
      contentHash: 'hash_sample_event_1',
    });
  }

  public async findUserById(id: string | bigint): Promise<any> {
    const key = String(id);
    return this.users.get(key) || null;
  }

  public async findUserByEmail(email: string): Promise<any> {
    for (const u of this.users.values()) {
      if (u.email === email) return u;
    }
    return null;
  }

  public async createUser(data: any): Promise<any> {
    const id = data.id || data.userId || `user_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const user = { id, userId: id, ...data, createdAt: new Date() };
    this.users.set(String(id), user);
    return user;
  }

  public async updateUser(id: string | bigint, data: any): Promise<any> {
    const key = String(id);
    const existing = this.users.get(key) || { id: key, userId: key };
    const updated = { ...existing, ...data, updatedAt: new Date() };
    this.users.set(key, updated);
    return updated;
  }

  public async findStudentByUserId(userId: string | bigint): Promise<any> {
    return this.findUserById(userId);
  }

  public async findStudentById(id: string | bigint): Promise<any> {
    return this.findUserById(id);
  }

  public async createStudentProfile(data: any): Promise<any> {
    if (data.userId && this.users.has(String(data.userId))) {
      return this.updateUser(data.userId, data);
    }
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
    return this.githubConnections.get(String(userId)) || null;
  }

  public async upsertGithubConnection(userId: string | bigint, data: any): Promise<any> {
    const key = String(userId);
    const conn = { userId: key, ...data, updatedAt: new Date() };
    this.githubConnections.set(key, conn);
    return conn;
  }

  public async getStudentAiSummary(userId: string | bigint): Promise<any> {
    return this.studentAiSummaries.get(String(userId)) || null;
  }

  public async upsertStudentAiSummary(userId: string | bigint, data: any): Promise<any> {
    const key = String(userId);
    const summary = { userId: key, ...data, updatedAt: new Date() };
    this.studentAiSummaries.set(key, summary);
    return summary;
  }

  public async getStudentSkills(userId: string | bigint): Promise<any[]> {
    return this.studentSkills.get(String(userId)) || [];
  }

  public async addStudentSkill(userId: string | bigint, skillData: any): Promise<any> {
    const key = String(userId);
    const list = this.studentSkills.get(key) || [];
    const skill = { id: `skill_${Date.now()}`, ...skillData };
    list.push(skill);
    this.studentSkills.set(key, list);
    return skill;
  }

  public async updateStudentSkill(userId: string | bigint, skillName: string, proficiency: number): Promise<any> {
    const key = String(userId);
    const list = this.studentSkills.get(key) || [];
    const idx = list.findIndex((s) => s.skillName === skillName);
    if (idx >= 0) {
      list[idx].proficiencyScore = proficiency;
      list[idx].lastUpdatedAt = new Date();
    } else {
      list.push({ skillName, proficiencyScore: proficiency, lastUpdatedAt: new Date() });
    }
    this.studentSkills.set(key, list);
    return list;
  }

  public async logSkillEvolution(data: any): Promise<any> {
    const key = String(data.userId);
    const list = this.skillEvolutions.get(key) || [];
    const item = { id: `evo_${Date.now()}`, recordedAt: new Date(), ...data };
    list.push(item);
    this.skillEvolutions.set(key, list);
    return item;
  }

  public async getSkillEvolutionHistory(userId: string | bigint): Promise<any[]> {
    return this.skillEvolutions.get(String(userId)) || [];
  }

  public async getStudentActivities(userId: string | bigint): Promise<any[]> {
    return this.studentActivities.get(String(userId)) || [];
  }

  public async addStudentActivity(userId: string | bigint, activityData: any): Promise<any> {
    const key = String(userId);
    const list = this.studentActivities.get(key) || [];
    const activity = { id: `act_${Date.now()}`, createdAt: new Date(), ...activityData };
    list.push(activity);
    this.studentActivities.set(key, list);
    return activity;
  }

  public async getEventParticipations(userId: string | bigint): Promise<any[]> {
    return this.eventParticipations.get(String(userId)) || [];
  }

  public async registerEventParticipation(userId: string | bigint, eventId: string | bigint, status: string = 'REGISTERED'): Promise<any> {
    const key = String(userId);
    const list = this.eventParticipations.get(key) || [];
    const part = {
      userId: key,
      eventId: String(eventId),
      registrationDate: new Date(),
      participationStatus: status,
      attended: false,
      completed: false,
    };
    list.push(part);
    this.eventParticipations.set(key, list);
    return part;
  }

  public async updateEventParticipation(userId: string | bigint, eventId: string | bigint, data: any): Promise<any> {
    const key = String(userId);
    const list = this.eventParticipations.get(key) || [];
    const idx = list.findIndex((p) => String(p.eventId) === String(eventId));
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...data, updatedAt: new Date() };
    }
    this.eventParticipations.set(key, list);
    return list[idx] || null;
  }

  public async getEventById(id: string | bigint): Promise<any> {
    const key = String(id);
    const event = this.events.get(key);
    if (!event) return null;
    const intel = this.eventAiAnalysis.get(key);
    return { ...event, intelligence: intel || null };
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
    const results: any[] = [];
    const seen = new Set<string>();
    for (const e of this.events.values()) {
      const key = String(e.eventId || e.id);
      if (seen.has(key)) continue;
      seen.add(key);
      const intel = this.eventAiAnalysis.get(String(e.eventId || e.id));
      results.push({ ...e, intelligence: intel || null });
    }
    return results;
  }

  public async createEvent(data: any): Promise<any> {
    const id = data.id || data.eventId || `event_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const event = { id, eventId: id, ...data, createdAt: new Date() };
    this.events.set(String(id), event);
    return event;
  }

  public async getEventAiAnalysis(eventId: string | bigint): Promise<any> {
    return this.eventAiAnalysis.get(String(eventId)) || null;
  }

  public async upsertEventAiAnalysis(eventId: string | bigint, analysisData: any): Promise<any> {
    const key = String(eventId);
    const intel = { eventId: key, ...analysisData, updatedAt: new Date() };
    this.eventAiAnalysis.set(key, intel);
    return intel;
  }

  public async upsertEventIntelligence(eventId: string | bigint, analysisData: any): Promise<any> {
    return this.upsertEventAiAnalysis(eventId, analysisData);
  }

  public async getEventAnalytics(eventId: string | bigint): Promise<any> {
    return this.eventAnalytics.get(String(eventId)) || { views: 0, clicks: 0, saves: 0, registrations: 0, shares: 0 };
  }

  public async updateEventAnalytics(eventId: string | bigint, analyticsData: any): Promise<any> {
    const key = String(eventId);
    const existing = await this.getEventAnalytics(key);
    const updated = { ...existing, ...analyticsData, updatedAt: new Date() };
    this.eventAnalytics.set(key, updated);
    return updated;
  }

  public async getHackathonDetails(eventId: string | bigint): Promise<any> {
    return this.hackathonDetails.get(String(eventId)) || null;
  }

  public async getInternshipDetails(eventId: string | bigint): Promise<any> {
    return this.internshipDetails.get(String(eventId)) || null;
  }

  public async getProjectDetails(eventId: string | bigint): Promise<any> {
    return this.projectDetails.get(String(eventId)) || null;
  }

  public async getWorkshopDetails(eventId: string | bigint): Promise<any> {
    return this.workshopDetails.get(String(eventId)) || null;
  }

  public async logInteraction(data: any): Promise<any> {
    const key = String(data.userId || data.studentId || 1);
    const list = this.userInteractions.get(key) || [];
    const item = { id: `int_${Date.now()}`, interactionTime: new Date(), ...data };
    list.push(item);
    this.userInteractions.set(key, list);
    return item;
  }

  public async getStudentInteractions(userId: string | bigint): Promise<any[]> {
    return this.userInteractions.get(String(userId)) || [];
  }

  public async addCalendarEvent(data: any): Promise<any> {
    const key = String(data.studentId || data.userId);
    const list = this.calendarEvents.get(key) || [];
    const event = { id: `cal_${Date.now()}`, createdAt: new Date(), ...data };
    list.push(event);
    this.calendarEvents.set(key, list);
    return event;
  }

  public async getStudentCalendarEvents(studentId: string | bigint): Promise<any[]> {
    return this.calendarEvents.get(String(studentId)) || [];
  }

  public async removeCalendarEvent(id: string): Promise<any> {
    for (const [key, list] of this.calendarEvents.entries()) {
      const filtered = list.filter((item) => item.id !== id);
      this.calendarEvents.set(key, filtered);
    }
    return { success: true };
  }

  public async createNotification(data: any): Promise<any> {
    const key = String(data.studentId || data.userId);
    const list = this.notifications.get(key) || [];
    const notif = { id: `notif_${Date.now()}`, isRead: false, createdAt: new Date(), ...data };
    list.push(notif);
    this.notifications.set(key, list);
    return notif;
  }

  public async getStudentNotifications(studentId: string | bigint): Promise<any[]> {
    return this.notifications.get(String(studentId)) || [];
  }

  public async markNotificationAsRead(id: string): Promise<any> {
    for (const list of this.notifications.values()) {
      const target = list.find((n) => n.id === id);
      if (target) target.isRead = true;
    }
    return { success: true };
  }

  public async getRecommendations(userId: string | bigint): Promise<any[]> {
    const rawList = this.recommendations.get(String(userId)) || [];
    return rawList.map((r) => {
      const event = this.events.get(String(r.eventId));
      return { ...r, event: event || null };
    });
  }

  public async findRecommendationsByStudentId(userId: string | bigint): Promise<any[]> {
    return this.getRecommendations(userId);
  }

  public async upsertRecommendation(dataOrStudentId: any, eventId?: string | bigint, score?: number, reason?: string): Promise<any> {
    let studentId = dataOrStudentId;
    let targetEventId = eventId;
    let targetScore = score;
    let targetReason = reason;

    if (typeof dataOrStudentId === 'object' && dataOrStudentId !== null) {
      studentId = dataOrStudentId.studentId || dataOrStudentId.userId;
      targetEventId = dataOrStudentId.eventId;
      targetScore = dataOrStudentId.score;
      targetReason = dataOrStudentId.reason || dataOrStudentId.explanation;
    }

    const key = String(studentId);
    const list = this.recommendations.get(key) || [];
    const existingIdx = list.findIndex((r) => String(r.eventId) === String(targetEventId));
    const item = { studentId: key, eventId: String(targetEventId), score: targetScore, reason: targetReason, explanation: targetReason };
    if (existingIdx >= 0) {
      list[existingIdx] = item;
    } else {
      list.push(item);
    }
    this.recommendations.set(key, list);
    return item;
  }

  public async saveRecommendations(userId: string | bigint, recommendationsList: any[]): Promise<any> {
    const key = String(userId);
    this.recommendations.set(key, recommendationsList);
    return recommendationsList;
  }

  public async logAIUsage(metrics: AIUsageMetrics): Promise<any> {
    const item = { id: `usage_${Date.now()}`, timestamp: new Date(), ...metrics };
    this.aiLogs.push(item);
    return item;
  }

  public async logAIRequest(data: any): Promise<any> {
    const item = { id: `req_${Date.now()}`, createdAt: new Date(), ...data };
    this.aiRequests.push(item);
    return item;
  }

  public async getAIUsageSummary(): Promise<any> {
    const totalRequests = this.aiLogs.length;
    const successfulRequests = this.aiLogs.filter((l) => l.success).length;
    const totalTokens = this.aiLogs.reduce((acc, curr) => acc + (curr.totalTokens || 0), 0);
    const totalEstimatedCost = this.aiLogs.reduce((acc, curr) => acc + (curr.estimatedCost || 0), 0);

    return {
      totalRequests,
      successfulRequests,
      failedRequests: totalRequests - successfulRequests,
      totalTokens,
      totalEstimatedCost,
      logsCount: this.aiLogs.length,
      requestLogsCount: this.aiRequests.length,
    };
  }
}
