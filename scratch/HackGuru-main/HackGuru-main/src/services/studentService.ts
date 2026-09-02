import { StudentRepository } from '../repositories/studentRepository';

export class StudentService {
  private studentRepository: StudentRepository;

  constructor() {
    this.studentRepository = new StudentRepository();
  }

  public async getProfileByUserId(userId: string): Promise<any> {
    const profile = await this.studentRepository.findByUserId(userId);
    if (!profile) {
      throw new Error('Student profile not found.');
    }
    return profile;
  }

  public async updateProfile(studentId: string, data: any): Promise<any> {
    return this.studentRepository.updateProfile(studentId, data);
  }

  public async updateInterests(studentId: string, interestIds: string[]): Promise<void> {
    await this.studentRepository.updateInterests(studentId, interestIds);
  }

  public async updateSkills(studentId: string, skills: { skillId: string; proficiencyLevel?: string }[]): Promise<void> {
    await this.studentRepository.updateSkills(studentId, skills);
  }

  public async getAllInterests(): Promise<any[]> {
    return this.studentRepository.getAllInterests();
  }

  public async getAllSkills(): Promise<any[]> {
    return this.studentRepository.getAllSkills();
  }
}
