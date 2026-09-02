"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const studentRepository_1 = require("../repositories/studentRepository");
const eventRepository_1 = require("../repositories/eventRepository");
const recommendation_agent_1 = require("../agents/recommendation.agent");
const notificationService_1 = require("./notificationService");
const calendarRepository_1 = require("../repositories/calendarRepository");
const adapterFactory_1 = require("../db/adapters/adapterFactory");
class DashboardService {
    studentRepository;
    eventRepository;
    recommendationAgent;
    notificationService;
    calendarRepository;
    get adapter() {
        return (0, adapterFactory_1.getDatabaseAdapter)();
    }
    constructor() {
        this.studentRepository = new studentRepository_1.StudentRepository();
        this.eventRepository = new eventRepository_1.EventRepository();
        this.recommendationAgent = new recommendation_agent_1.RecommendationAgent();
        this.notificationService = new notificationService_1.NotificationService();
        this.calendarRepository = new calendarRepository_1.CalendarRepository();
    }
    async getAggregatedDashboard(userId) {
        // 1. Fetch Student Profile
        const student = await this.studentRepository.findByUserId(userId);
        if (!student) {
            throw new Error('Student profile not found.');
        }
        const studentId = student.id || student.userId;
        // 2. Trigger Deadline Notification generation
        await this.notificationService.generateDeadlineNotificationsForStudent(studentId);
        // 3. Fetch Recommendations (via Adapter / RecommendationAgent)
        let recommendations = await this.adapter.findRecommendationsByStudentId(studentId);
        if (recommendations.length === 0) {
            recommendations = await this.recommendationAgent.generatePersonalizedRecommendations(student, 10);
        }
        // 4. Fetch Upcoming Opportunities (Calendar events & deadlines)
        const calendarEvents = await this.calendarRepository.getStudentCalendarEvents(studentId);
        // 5. Fetch Notifications
        const notifications = await this.notificationService.getStudentNotifications(studentId);
        // 6. Fetch General Featured Events
        const events = await this.eventRepository.findAll({ limit: 10 });
        // Aggregate into single unified payload
        return {
            studentProfile: {
                id: studentId,
                fullName: student.fullName,
                collegeName: student.collegeName,
                branch: student.department || student.branch,
                yearOfStudy: student.yearOfStudy,
                degree: student.degree,
                location: student.location,
                careerGoal: student.careerGoal,
                bio: student.bio,
            },
            interests: (student.interests || []).map((i) => typeof i === 'string' ? i : i.interest?.name || i.name),
            skills: (student.studentSkills || student.skills || []).map((s) => typeof s === 'string' ? { name: s, proficiencyLevel: 50 } : {
                name: s.skill?.name || s.skillName,
                proficiencyLevel: s.proficiencyScore || 50,
            }),
            hackathons: student.hackathons || [],
            internships: student.internships || [],
            projects: student.projects || [],
            events,
            upcomingDeadlines: calendarEvents,
            recommendations,
            notifications,
        };
    }
}
exports.DashboardService = DashboardService;
