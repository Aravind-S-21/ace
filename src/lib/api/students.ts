import { Student } from '@/types';
import { mockStudent } from '@/data/mock/students';
import { apiRequest, saveAuthToken } from './client';

export async function getStudentProfile(): Promise<Student> {
  try { return await apiRequest<Student>('/api/students/me'); } catch { return mockStudent; }
}

export async function updateStudentProfile(data: Partial<Student>): Promise<Student> {
  try { return await apiRequest<Student>('/api/students/me', { method: 'PATCH', body: JSON.stringify(data) }); } catch { return { ...mockStudent, ...data }; }
}

export async function login(email: string, password: string) {
  const result = await apiRequest<{ token: string; user: Student }>('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  saveAuthToken(result.token);
  return result;
}
