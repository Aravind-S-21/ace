import { Skill } from '@/types';
import { mockSkills } from '@/data/mock/skills';

export async function getSkills(): Promise<Skill[]> {
  // Future: return fetch('/api/skills').then(r => r.json())
  return mockSkills;
}

export async function getSkillById(id: string): Promise<Skill | undefined> {
  return mockSkills.find(s => s.id === id);
}
