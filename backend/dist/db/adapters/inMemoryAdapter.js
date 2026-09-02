"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryDatabaseAdapter = void 0;
class InMemoryDatabaseAdapter {
    users = new Map();
    events = new Map();
    eventAiAnalysis = new Map();
    eventAnalytics = new Map();
    githubConnections = new Map();
    studentAiSummaries = new Map();
    studentSkills = new Map();
    skillEvolutions = new Map();
    studentActivities = new Map();
    eventParticipations = new Map();
    hackathonDetails = new Map();
    internshipDetails = new Map();
    projectDetails = new Map();
    workshopDetails = new Map();
    userInteractions = new Map();
    calendarEvents = new Map();
    notifications = new Map();
    recommendations = new Map();
    aiLogs = [];
    aiRequests = [];
    constructor() {
        this.seedSampleData();
    }
    seedSampleData() {
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
    async findUserById(id) {
        const key = String(id);
        return this.users.get(key) || null;
    }
    async findUserByEmail(email) {
        for (const u of this.users.values()) {
            if (u.email === email)
                return u;
        }
        return null;
    }
    async createUser(data) {
        const id = data.id || data.userId || `user_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        const user = { id, userId: id, ...data, createdAt: new Date() };
        this.users.set(String(id), user);
        return user;
    }
    async updateUser(id, data) {
        const key = String(id);
        const existing = this.users.get(key) || { id: key, userId: key };
        const updated = { ...existing, ...data, updatedAt: new Date() };
        this.users.set(key, updated);
        return updated;
    }
    async findStudentByUserId(userId) {
        return this.findUserById(userId);
    }
    async findStudentById(id) {
        return this.findUserById(id);
    }
    async createStudentProfile(data) {
        if (data.userId && this.users.has(String(data.userId))) {
            return this.updateUser(data.userId, data);
        }
        return this.createUser(data);
    }
    async updateStudentProfile(id, data) {
        return this.updateUser(id, data);
    }
    async updateStudentInterests(studentId, interests) {
        return this.updateUser(studentId, { interests });
    }
    async updateStudentSkills(studentId, skills) {
        for (const s of skills) {
            const name = typeof s === 'string' ? s : s.name || s.skillName;
            const prof = typeof s === 'object' ? s.proficiencyScore || 50 : 50;
            if (name) {
                await this.updateStudentSkill(studentId, name, prof);
            }
        }
        return this.getStudentSkills(studentId);
    }
    async getAllInterests() {
        return [
            { id: 'int-ai', name: 'Artificial Intelligence', category: 'AI & ML' },
            { id: 'int-web', name: 'Web Development', category: 'Software' },
            { id: 'int-mobile', name: 'Mobile App Development', category: 'Software' },
            { id: 'int-cloud', name: 'Cloud Computing', category: 'DevOps' },
            { id: 'int-cyber', name: 'Cybersecurity', category: 'Security' },
        ];
    }
    async getAllSkills() {
        return [
            { id: 'skill-python', name: 'Python', category: 'Programming' },
            { id: 'skill-ts', name: 'TypeScript', category: 'Programming' },
            { id: 'skill-react', name: 'React', category: 'Frontend' },
            { id: 'skill-node', name: 'Node.js', category: 'Backend' },
            { id: 'skill-pg', name: 'PostgreSQL', category: 'Database' },
        ];
    }
    async getGithubConnection(userId) {
        return this.githubConnections.get(String(userId)) || null;
    }
    async upsertGithubConnection(userId, data) {
        const key = String(userId);
        const conn = { userId: key, ...data, updatedAt: new Date() };
        this.githubConnections.set(key, conn);
        return conn;
    }
    async getStudentAiSummary(userId) {
        return this.studentAiSummaries.get(String(userId)) || null;
    }
    async upsertStudentAiSummary(userId, data) {
        const key = String(userId);
        const summary = { userId: key, ...data, updatedAt: new Date() };
        this.studentAiSummaries.set(key, summary);
        return summary;
    }
    async getStudentSkills(userId) {
        return this.studentSkills.get(String(userId)) || [];
    }
    async addStudentSkill(userId, skillData) {
        const key = String(userId);
        const list = this.studentSkills.get(key) || [];
        const skill = { id: `skill_${Date.now()}`, ...skillData };
        list.push(skill);
        this.studentSkills.set(key, list);
        return skill;
    }
    async updateStudentSkill(userId, skillName, proficiency) {
        const key = String(userId);
        const list = this.studentSkills.get(key) || [];
        const idx = list.findIndex((s) => s.skillName === skillName);
        if (idx >= 0) {
            list[idx].proficiencyScore = proficiency;
            list[idx].lastUpdatedAt = new Date();
        }
        else {
            list.push({ skillName, proficiencyScore: proficiency, lastUpdatedAt: new Date() });
        }
        this.studentSkills.set(key, list);
        return list;
    }
    async logSkillEvolution(data) {
        const key = String(data.userId);
        const list = this.skillEvolutions.get(key) || [];
        const item = { id: `evo_${Date.now()}`, recordedAt: new Date(), ...data };
        list.push(item);
        this.skillEvolutions.set(key, list);
        return item;
    }
    async getSkillEvolutionHistory(userId) {
        return this.skillEvolutions.get(String(userId)) || [];
    }
    async getStudentActivities(userId) {
        return this.studentActivities.get(String(userId)) || [];
    }
    async addStudentActivity(userId, activityData) {
        const key = String(userId);
        const list = this.studentActivities.get(key) || [];
        const activity = { id: `act_${Date.now()}`, createdAt: new Date(), ...activityData };
        list.push(activity);
        this.studentActivities.set(key, list);
        return activity;
    }
    async getEventParticipations(userId) {
        return this.eventParticipations.get(String(userId)) || [];
    }
    async registerEventParticipation(userId, eventId, status = 'REGISTERED') {
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
    async updateEventParticipation(userId, eventId, data) {
        const key = String(userId);
        const list = this.eventParticipations.get(key) || [];
        const idx = list.findIndex((p) => String(p.eventId) === String(eventId));
        if (idx >= 0) {
            list[idx] = { ...list[idx], ...data, updatedAt: new Date() };
        }
        this.eventParticipations.set(key, list);
        return list[idx] || null;
    }
    async getEventById(id) {
        const key = String(id);
        const event = this.events.get(key);
        if (!event)
            return null;
        const intel = this.eventAiAnalysis.get(key);
        return { ...event, intelligence: intel || null };
    }
    async findEventById(id) {
        return this.getEventById(id);
    }
    async findAllEvents(params) {
        return this.listEvents(params);
    }
    async getCandidateEventsForStudent(limit = 500) {
        return this.listEvents({ limit });
    }
    async listEvents(filters) {
        const results = [];
        const seen = new Set();
        for (const e of this.events.values()) {
            const key = String(e.eventId || e.id);
            if (seen.has(key))
                continue;
            seen.add(key);
            const intel = this.eventAiAnalysis.get(String(e.eventId || e.id));
            results.push({ ...e, intelligence: intel || null });
        }
        return results;
    }
    async createEvent(data) {
        const id = data.id || data.eventId || `event_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        const event = { id, eventId: id, ...data, createdAt: new Date() };
        this.events.set(String(id), event);
        return event;
    }
    async getEventAiAnalysis(eventId) {
        return this.eventAiAnalysis.get(String(eventId)) || null;
    }
    async upsertEventAiAnalysis(eventId, analysisData) {
        const key = String(eventId);
        const intel = { eventId: key, ...analysisData, updatedAt: new Date() };
        this.eventAiAnalysis.set(key, intel);
        return intel;
    }
    async upsertEventIntelligence(eventId, analysisData) {
        return this.upsertEventAiAnalysis(eventId, analysisData);
    }
    async getEventAnalytics(eventId) {
        return this.eventAnalytics.get(String(eventId)) || { views: 0, clicks: 0, saves: 0, registrations: 0, shares: 0 };
    }
    async updateEventAnalytics(eventId, analyticsData) {
        const key = String(eventId);
        const existing = await this.getEventAnalytics(key);
        const updated = { ...existing, ...analyticsData, updatedAt: new Date() };
        this.eventAnalytics.set(key, updated);
        return updated;
    }
    async getHackathonDetails(eventId) {
        return this.hackathonDetails.get(String(eventId)) || null;
    }
    async getInternshipDetails(eventId) {
        return this.internshipDetails.get(String(eventId)) || null;
    }
    async getProjectDetails(eventId) {
        return this.projectDetails.get(String(eventId)) || null;
    }
    async getWorkshopDetails(eventId) {
        return this.workshopDetails.get(String(eventId)) || null;
    }
    async logInteraction(data) {
        const key = String(data.userId || data.studentId || 1);
        const list = this.userInteractions.get(key) || [];
        const item = { id: `int_${Date.now()}`, interactionTime: new Date(), ...data };
        list.push(item);
        this.userInteractions.set(key, list);
        return item;
    }
    async getStudentInteractions(userId) {
        return this.userInteractions.get(String(userId)) || [];
    }
    async addCalendarEvent(data) {
        const key = String(data.studentId || data.userId);
        const list = this.calendarEvents.get(key) || [];
        const event = { id: `cal_${Date.now()}`, createdAt: new Date(), ...data };
        list.push(event);
        this.calendarEvents.set(key, list);
        return event;
    }
    async getStudentCalendarEvents(studentId) {
        return this.calendarEvents.get(String(studentId)) || [];
    }
    async removeCalendarEvent(id) {
        for (const [key, list] of this.calendarEvents.entries()) {
            const filtered = list.filter((item) => item.id !== id);
            this.calendarEvents.set(key, filtered);
        }
        return { success: true };
    }
    async createNotification(data) {
        const key = String(data.studentId || data.userId);
        const list = this.notifications.get(key) || [];
        const notif = { id: `notif_${Date.now()}`, isRead: false, createdAt: new Date(), ...data };
        list.push(notif);
        this.notifications.set(key, list);
        return notif;
    }
    async getStudentNotifications(studentId) {
        return this.notifications.get(String(studentId)) || [];
    }
    async markNotificationAsRead(id) {
        for (const list of this.notifications.values()) {
            const target = list.find((n) => n.id === id);
            if (target)
                target.isRead = true;
        }
        return { success: true };
    }
    async getRecommendations(userId) {
        const rawList = this.recommendations.get(String(userId)) || [];
        return rawList.map((r) => {
            const event = this.events.get(String(r.eventId));
            return { ...r, event: event || null };
        });
    }
    async findRecommendationsByStudentId(userId) {
        return this.getRecommendations(userId);
    }
    async upsertRecommendation(dataOrStudentId, eventId, score, reason) {
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
        }
        else {
            list.push(item);
        }
        this.recommendations.set(key, list);
        return item;
    }
    async saveRecommendations(userId, recommendationsList) {
        const key = String(userId);
        this.recommendations.set(key, recommendationsList);
        return recommendationsList;
    }
    async logAIUsage(metrics) {
        const item = { id: `usage_${Date.now()}`, timestamp: new Date(), ...metrics };
        this.aiLogs.push(item);
        return item;
    }
    async logAIRequest(data) {
        const item = { id: `req_${Date.now()}`, createdAt: new Date(), ...data };
        this.aiRequests.push(item);
        return item;
    }
    async getAIUsageSummary() {
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
exports.InMemoryDatabaseAdapter = InMemoryDatabaseAdapter;
