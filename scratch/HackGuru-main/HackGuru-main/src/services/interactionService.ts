import { InteractionRepository } from '../repositories/interactionRepository';
import { ActionType } from '../types/enums';

export class InteractionService {
  private interactionRepository: InteractionRepository;

  constructor() {
    this.interactionRepository = new InteractionRepository();
  }

  public async logInteraction(data: {
    studentId: string;
    eventId: string;
    action: ActionType;
    metadata?: any;
  }): Promise<any> {
    return this.interactionRepository.logInteraction(data);
  }

  public async getStudentInteractions(studentId: string): Promise<any[]> {
    return this.interactionRepository.getStudentInteractions(studentId);
  }
}
