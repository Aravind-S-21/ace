import request from 'supertest';
import app from '../src/app';
import { AdapterFactory } from '../src/adapters/adapterFactory';
import { InMemoryDatabaseAdapter } from '../src/adapters/inMemoryAdapter';

describe('Student Intelligence & Skill Evolution Lifecycle Test Suite', () => {
  let token: string;
  let userId: string;

  beforeEach(async () => {
    AdapterFactory.setAdapter(new InMemoryDatabaseAdapter());

    const regRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: `lifecycle_student_${Date.now()}@college.edu`,
        password: 'Password123!',
        fullName: 'Raja Murugappa',
        collegeName: 'Anna University',
        branch: 'Computer Science',
        yearOfStudy: 3,
        degree: 'B.E.',
        location: 'Chennai',
        careerGoal: 'AI Research Lead',
      });

    token = regRes.body.data.token;
    userId = regRes.body.data.user.id;
  });

  it('should connect GitHub profile and extract repository insights', async () => {
    const ghRes = await request(app)
      .post('/api/students/me/github')
      .set('Authorization', `Bearer ${token}`)
      .send({
        githubUsername: 'rajamurugappa',
        topLanguages: ['Python', 'TypeScript', 'C++'],
        publicReposCount: 24,
        totalStars: 142,
      });

    expect(ghRes.status).toBe(200);
    expect(ghRes.body.success).toBe(true);
    expect(ghRes.body.data.githubUsername).toBe('rajamurugappa');
  });

  it('should generate AI student intelligence profile with skill extraction', async () => {
    // 1. Connect GitHub
    await request(app)
      .post('/api/students/me/github')
      .set('Authorization', `Bearer ${token}`)
      .send({
        githubUsername: 'rajamurugappa',
        topLanguages: ['Python', 'PyTorch'],
        publicReposCount: 15,
        totalStars: 80,
      });

    // 2. Fetch AI Intelligence Profile
    const intelRes = await request(app)
      .get('/api/students/me/intelligence')
      .set('Authorization', `Bearer ${token}`);

    expect(intelRes.status).toBe(200);
    expect(intelRes.body.success).toBe(true);
    expect(intelRes.body.data.summary).toBeDefined();
    expect(intelRes.body.data.skills).toBeDefined();
  });

  it('should record event participation and trigger skill evolution feedback loop', async () => {
    // Participate in AI Event
    const partRes = await request(app)
      .post('/api/students/me/participate')
      .set('Authorization', `Bearer ${token}`)
      .send({
        eventId: 'event-contract-1',
        skillsGained: ['PostgreSQL', 'LLMs', 'Generative AI'],
        outcome: 'WINNER_1ST_PLACE',
      });

    expect(partRes.status).toBe(200);
    expect(partRes.body.success).toBe(true);
    expect(partRes.body.data.updatedSkills.length).toBeGreaterThan(0);

    // Verify Skill Evolution History
    const evoRes = await request(app)
      .get('/api/students/me/skills/evolution')
      .set('Authorization', `Bearer ${token}`);

    expect(evoRes.status).toBe(200);
    expect(evoRes.body.success).toBe(true);
    expect(evoRes.body.data.length).toBeGreaterThan(0);
  });
});
