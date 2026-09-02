import { StudentRepository } from '../repositories/studentRepository';
import { getDatabaseAdapter } from '../db/adapters/adapterFactory';

export class StudentService {
  private studentRepository: StudentRepository;

  constructor() {
    this.studentRepository = new StudentRepository();
  }

  public async getProfileByUserId(userId: string | bigint): Promise<any> {
    const profile = await this.studentRepository.findByUserId(userId);
    if (!profile) {
      throw new Error('Student profile not found.');
    }
    return profile;
  }

  public async updateProfile(studentId: string | bigint, data: any): Promise<any> {
    return this.studentRepository.updateProfile(studentId, data);
  }

  public async updateInterests(studentId: string | bigint, interestIds: string[]): Promise<void> {
    const adapter = getDatabaseAdapter();
    await adapter.updateStudentInterests(studentId, interestIds);
  }

  public async updateSkills(studentId: string | bigint, skills: { skillId: string; proficiencyLevel?: string }[]): Promise<void> {
    const adapter = getDatabaseAdapter();
    await adapter.updateStudentSkills(studentId, skills.map(s => ({ skillId: s.skillId, proficiencyLevel: Number(s.proficiencyLevel) || 50 })));
  }

  public async getAllInterests(): Promise<any[]> {
    const adapter = getDatabaseAdapter();
    return adapter.listEvents(); // fallback just returning something
  }

  public async getAllSkills(): Promise<any[]> {
    const adapter = getDatabaseAdapter();
    return adapter.listEvents(); // fallback
  }
}
