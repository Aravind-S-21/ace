import { AdapterFactory } from '../adapters/adapterFactory';
import { IDatabaseAdapter } from '../adapters/databaseAdapter.interface';
import { logger } from '../utils/logger';

export class SkillEvolutionService {
  private get adapter(): IDatabaseAdapter {
    return AdapterFactory.getAdapter();
  }

  public async recordEventParticipationAndSkillEvolution(
    userId: string | bigint,
    eventId: string | bigint,
    skillsGained: string[] = [],
    outcome: string = 'COMPLETED'
  ): Promise<any> {
    logger.info(`[SkillEvolutionService] Processing participation & skill evolution for user ${userId} on event ${eventId}...`);

    // 1. Record event participation
    const participation = await this.adapter.registerEventParticipation(userId, eventId, 'COMPLETED');
    await this.adapter.updateEventParticipation(userId, eventId, {
      attended: true,
      completed: true,
      completionDate: new Date(),
      outcome,
    });

    // 2. Add activity
    const event = await this.adapter.getEventById(eventId);
    const activity = await this.adapter.addStudentActivity(userId, {
      title: event ? `Completed ${event.title}` : `Completed Event ${eventId}`,
      description: `Participated and achieved ${outcome}`,
      activityType: 'EVENT_PARTICIPATION',
      eventId,
      status: 'COMPLETED',
      skillsGained,
      source: 'EVENT',
    });

    // 3. Evolve Skills & Log History
    const updatedSkills: any[] = [];
    for (const skillName of skillsGained) {
      const existingSkills = await this.adapter.getStudentSkills(userId);
      const existing = existingSkills.find((s) => s.skillName === skillName);
      const prevProficiency = existing ? Number(existing.proficiencyScore) || 50 : 0;
      const newProficiency = Math.min(100, prevProficiency + 15);

      // Log Evolution record
      await this.adapter.logSkillEvolution({
        userId,
        skillName,
        previousProficiency: prevProficiency,
        newProficiency,
        changeReason: `Completed ${event?.title || 'Event'}`,
        eventId,
      });

      // Update dedicated student skill
      const updatedSkill = await this.adapter.updateStudentSkill(userId, skillName, newProficiency);
      updatedSkills.push(updatedSkill);
    }

    return {
      participation,
      activity,
      updatedSkills,
    };
  }
}
