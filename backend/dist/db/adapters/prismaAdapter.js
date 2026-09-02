"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaDatabaseAdapter = void 0;
const client_1 = require("@prisma/client");
class PrismaDatabaseAdapter {
    prisma;
    memoryTelemetryLogs = [];
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    toBigInt(id) {
        if (typeof id === 'bigint')
            return id;
        const parsed = parseInt(id, 10);
        return isNaN(parsed) ? BigInt(0) : BigInt(parsed);
    }
    async findUserById(id) {
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
    async findUserByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }
    async createUser(data) {
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
    async updateUser(id, data) {
        return this.prisma.user.update({
            where: { userId: this.toBigInt(id) },
            data,
        });
    }
    async findStudentByUserId(userId) {
        return this.findUserById(userId);
    }
    async findStudentById(id) {
        return this.findUserById(id);
    }
    async createStudentProfile(data) {
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
        return this.prisma.githubConnection.findUnique({
            where: { userId: this.toBigInt(userId) },
        });
    }
    async upsertGithubConnection(userId, data) {
        const bId = this.toBigInt(userId);
        return this.prisma.githubConnection.upsert({
            where: { userId: bId },
            create: { userId: bId, ...data },
            update: data,
        });
    }
    async getStudentAiSummary(userId) {
        return this.prisma.studentAiSummary.findUnique({
            where: { userId: this.toBigInt(userId) },
        });
    }
    async upsertStudentAiSummary(userId, data) {
        const bId = this.toBigInt(userId);
        return this.prisma.studentAiSummary.upsert({
            where: { userId: bId },
            create: { userId: bId, ...data },
            update: data,
        });
    }
    async getStudentSkills(userId) {
        return this.prisma.studentSkill.findMany({
            where: { userId: this.toBigInt(userId) },
        });
    }
    async addStudentSkill(userId, skillData) {
        return this.prisma.studentSkill.create({
            data: {
                userId: this.toBigInt(userId),
                ...skillData,
            },
        });
    }
    async updateStudentSkill(userId, skillName, proficiency) {
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
    async logSkillEvolution(data) {
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
    async getSkillEvolutionHistory(userId) {
        return this.prisma.skillEvolution.findMany({
            where: { userId: this.toBigInt(userId) },
            orderBy: { recordedAt: 'desc' },
        });
    }
    async getStudentActivities(userId) {
        return this.prisma.studentActivity.findMany({
            where: { userId: this.toBigInt(userId) },
        });
    }
    async addStudentActivity(userId, activityData) {
        return this.prisma.studentActivity.create({
            data: {
                userId: this.toBigInt(userId),
                ...activityData,
            },
        });
    }
    async getEventParticipations(userId) {
        return this.prisma.eventParticipation.findMany({
            where: { userId: this.toBigInt(userId) },
            include: { event: true },
        });
    }
    async registerEventParticipation(userId, eventId, status = 'REGISTERED') {
        const uId = this.toBigInt(userId);
        const eId = this.toBigInt(eventId);
        return this.prisma.eventParticipation.upsert({
            where: { userId_eventId: { userId: uId, eventId: eId } },
            create: { userId: uId, eventId: eId, participationStatus: status },
            update: { participationStatus: status },
        });
    }
    async updateEventParticipation(userId, eventId, data) {
        const uId = this.toBigInt(userId);
        const eId = this.toBigInt(eventId);
        return this.prisma.eventParticipation.update({
            where: { userId_eventId: { userId: uId, eventId: eId } },
            data,
        });
    }
    async getEventById(id) {
        return this.prisma.event.findUnique({
            where: { eventId: this.toBigInt(id) },
            include: { aiAnalysis: true, analytics: true },
        });
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
        return this.prisma.event.findMany({
            take: filters?.limit || 50,
            include: { aiAnalysis: true, analytics: true },
        });
    }
    async createEvent(data) {
        return this.prisma.event.create({
            data,
        });
    }
    async getEventAiAnalysis(eventId) {
        return this.prisma.eventAiAnalysis.findUnique({
            where: { eventId: this.toBigInt(eventId) },
        });
    }
    async upsertEventAiAnalysis(eventId, analysisData) {
        const eId = this.toBigInt(eventId);
        return this.prisma.eventAiAnalysis.upsert({
            where: { eventId: eId },
            create: { eventId: eId, ...analysisData },
            update: analysisData,
        });
    }
    async upsertEventIntelligence(eventId, analysisData) {
        return this.upsertEventAiAnalysis(eventId, analysisData);
    }
    async getEventAnalytics(eventId) {
        return this.prisma.eventAnalytics.findUnique({
            where: { eventId: this.toBigInt(eventId) },
        });
    }
    async updateEventAnalytics(eventId, analyticsData) {
        const eId = this.toBigInt(eventId);
        return this.prisma.eventAnalytics.upsert({
            where: { eventId: eId },
            create: { eventId: eId, ...analyticsData },
            update: analyticsData,
        });
    }
    async getHackathonDetails(eventId) {
        return this.prisma.hackathonDetail.findUnique({
            where: { eventId: this.toBigInt(eventId) },
        });
    }
    async getInternshipDetails(eventId) {
        return this.prisma.internshipDetail.findUnique({
            where: { eventId: this.toBigInt(eventId) },
        });
    }
    async getProjectDetails(eventId) {
        return this.prisma.projectDetail.findUnique({
            where: { eventId: this.toBigInt(eventId) },
        });
    }
    async getWorkshopDetails(eventId) {
        return this.prisma.workshopDetail.findUnique({
            where: { eventId: this.toBigInt(eventId) },
        });
    }
    async logInteraction(data) {
        return this.prisma.userInteraction.create({
            data: {
                userId: this.toBigInt(data.userId || data.studentId || 1),
                eventId: this.toBigInt(data.eventId),
                interactionType: data.action,
            },
        });
    }
    async getStudentInteractions(userId) {
        return this.prisma.userInteraction.findMany({
            where: { userId: this.toBigInt(userId) },
            include: { event: true },
        });
    }
    async addCalendarEvent(data) {
        return { id: `cal_${Date.now()}`, ...data };
    }
    async getStudentCalendarEvents(studentId) {
        return [];
    }
    async removeCalendarEvent(id) {
        return { success: true };
    }
    async createNotification(data) {
        return { id: `notif_${Date.now()}`, isRead: false, ...data };
    }
    async getStudentNotifications(studentId) {
        return [];
    }
    async markNotificationAsRead(id) {
        return { success: true };
    }
    async getRecommendations(userId) {
        return this.prisma.recommendation.findMany({
            where: { userId: this.toBigInt(userId) },
            include: { event: true },
        });
    }
    async findRecommendationsByStudentId(userId) {
        return this.getRecommendations(userId);
    }
    async upsertRecommendation(dataOrStudentId, eventId, score, reason) {
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
    async saveRecommendations(userId, recommendationsList) {
        const uId = this.toBigInt(userId);
        const results = [];
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
    async logAIUsage(metrics) {
        this.memoryTelemetryLogs.push(metrics);
        console.log(`[AI TELEMETRY LOG] ${metrics.provider} | ${metrics.model} | ${metrics.requestType} | success: ${metrics.success}`);
        return { id: `log_${Date.now()}`, ...metrics };
    }
    async logAIRequest(data) {
        console.log(`[AI REQUEST LOG] ${data.provider} | ${data.model} | ${data.requestType} | duration: ${data.durationMs}ms`);
        return { id: `req_${Date.now()}`, ...data };
    }
    async getAIUsageSummary() {
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
exports.PrismaDatabaseAdapter = PrismaDatabaseAdapter;
