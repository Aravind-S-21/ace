import { getDatabaseAdapter } from '../db/adapters/adapterFactory';
import { IDatabaseAdapter } from '../db/adapters/databaseAdapter.interface';
import { logger } from '../utils/logger';

export class StudentIntelligenceService {
  private get adapter(): IDatabaseAdapter {
    return getDatabaseAdapter();
  }

  public async generateStudentIntelligenceProfile(userId: string | bigint): Promise<any> {
    logger.info(`[StudentIntelligenceService] Generating intelligence profile for user ${userId}...`);

    const user = await this.adapter.findUserById(userId);
    if (!user) throw new Error('User not found');

    const github = await this.adapter.getGithubConnection(userId);
    const activities = await this.adapter.getStudentActivities(userId);
    const existingSkills = await this.adapter.getStudentSkills(userId);

    const extractedSkills = new Set<string>();

    const userSkills = user.studentSkills || user.skills || [];
    userSkills.forEach((s: any) => extractedSkills.add(typeof s === 'string' ? s : s.skillName || s.name));
    (github?.topLanguages || []).forEach((l: string) => extractedSkills.add(l));
    activities.forEach((act: any) => {
      (act.skillsGained || []).forEach((s: string) => extractedSkills.add(s));
    });

    const skillsArray = Array.from(extractedSkills).filter(Boolean);

    for (const skillName of skillsArray) {
      await this.adapter.updateStudentSkill(userId, skillName, 75);
    }

    const summaryData = {
      profileSummary: `Student ${user.fullName} specializing in ${user.department || user.branch || 'Computer Science'} with career goal: ${user.careerGoal || 'AI Engineer'}.`,
      strongestSkills: skillsArray.slice(0, 5),
      emergingSkills: skillsArray.slice(5, 10),
      interestsDetected: (user.interests || []).map((i: any) => typeof i === 'string' ? i : i.interest?.name || i.name),
      careerGoalsDetected: [user.careerGoal || 'Software Engineer'],
      recommendedDomains: ['AI & ML', 'Software Development'],
      githubInsights: github ? `Connected @${github.githubUsername} (${github.publicReposCount} repos, ${github.totalStars} stars)` : 'GitHub not connected',
      activityInsights: `${activities.length} student activities recorded`,
      confidenceScore: 88.5,
    };

    const summary = await this.adapter.upsertStudentAiSummary(userId, summaryData);

    return {
      user,
      github,
      activities,
      skills: await this.adapter.getStudentSkills(userId),
      summary,
    };
  }
}
