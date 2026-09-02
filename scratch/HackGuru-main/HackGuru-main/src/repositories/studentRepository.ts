import { AdapterFactory } from '../adapters/adapterFactory';
import { IDatabaseAdapter } from '../adapters/databaseAdapter.interface';

export class StudentRepository {
  private get adapter(): IDatabaseAdapter {
    return AdapterFactory.getAdapter();
  }

  public async findByUserId(userId: string | bigint): Promise<any | null> {
    return this.adapter.findUserById(userId);
  }

  public async findById(id: string | bigint): Promise<any | null> {
    return this.adapter.findUserById(id);
  }

  public async createProfile(data: any): Promise<any> {
    if (data.userId) {
      return this.adapter.updateUser(data.userId, data);
    }
    return this.adapter.createUser(data);
  }

  public async updateProfile(studentId: string | bigint, data: any): Promise<any> {
    return this.adapter.updateUser(studentId, data);
  }

  public async updateInterests(studentId: string | bigint, interests: string[]): Promise<void> {
    await this.adapter.updateUser(studentId, { interests });
  }

  public async updateSkills(studentId: string | bigint, skills: any[]): Promise<void> {
    for (const s of skills) {
      const name = typeof s === 'string' ? s : s.name || s.skillName;
      const prof = typeof s === 'object' ? s.proficiencyScore || 50 : 50;
      if (name) {
        await this.adapter.updateStudentSkill(studentId, name, prof);
      }
    }
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
}
