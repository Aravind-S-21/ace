import { Student } from '@/types';
import { mockStudent } from '@/data/mock/students';

export async function getStudentProfile(): Promise<Student> {
  // Future: return fetch('/api/students/me').then(r => r.json())
  return mockStudent;
}

export async function updateStudentProfile(data: Partial<Student>): Promise<Student> {
  // Future: return fetch('/api/students/me', { method: 'PATCH', body: JSON.stringify(data) }).then(r => r.json())
  return { ...mockStudent, ...data };
}
