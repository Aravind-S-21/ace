import { StudentRepository } from '../repositories/studentRepository';
import { EventRepository } from '../repositories/eventRepository';
import { RecommendationAgent } from '../agents/recommendation.agent';
import { NotificationService } from './notificationService';
import { CalendarRepository } from '../repositories/calendarRepository';
import { AdapterFactory } from '../adapters/adapterFactory';
import { IDatabaseAdapter } from '../adapters/databaseAdapter.interface';

export class DashboardService {
  private studentRepository: StudentRepository;
  private eventRepository: EventRepository;
  private recommendationAgent: RecommendationAgent;
  private notificationService: NotificationService;
  private calendarRepository: CalendarRepository;

  private get adapter(): IDatabaseAdapter {
    return AdapterFactory.getAdapter();
  }

  constructor() {
    this.studentRepository = new StudentRepository();
    this.eventRepository = new EventRepository();
    this.recommendationAgent = new RecommendationAgent();
    this.notificationService = new NotificationService();
    this.calendarRepository = new CalendarRepository();
  }

  public async getAggregatedDashboard(userId: string): Promise<any> {
    // 1. Fetch Student Profile
    const student = await this.studentRepository.findByUserId(userId);
    if (!student) {
      throw new Error('Student profile not found.');
    }

    // 2. Trigger Deadline Notification generation
    await this.notificationService.generateDeadlineNotificationsForStudent(student.id);

    // 3. Fetch Recommendations (via Adapter / RecommendationAgent)
    let recommendations = await this.adapter.findRecommendationsByStudentId(student.id);

    if (recommendations.length === 0) {
      recommendations = await this.recommendationAgent.generatePersonalizedRecommendations(student, 10);
    }

    // 4. Fetch Upcoming Opportunities (Calendar events & deadlines)
    const calendarEvents = await this.calendarRepository.getStudentCalendarEvents(student.id);

    // 5. Fetch Notifications
    const notifications = await this.notificationService.getStudentNotifications(student.id);

    // 6. Fetch General Featured Events
    const events = await this.eventRepository.findAll({ limit: 10 });

    // Aggregate into single unified payload
    return {
      studentProfile: {
        id: student.id,
        fullName: student.fullName,
        collegeName: student.collegeName,
        branch: student.branch,
        yearOfStudy: student.yearOfStudy,
        degree: student.degree,
        location: student.location,
        careerGoal: student.careerGoal,
        bio: student.bio,
      },
      interests: (student.interests || []).map((i: any) => i.interest),
      skills: (student.skills || []).map((s: any) => ({
        ...s.skill,
        proficiencyLevel: s.proficiencyLevel,
      })),
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
