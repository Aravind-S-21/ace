import request from 'supertest';
import { AdapterFactory } from '../src/adapters/adapterFactory';
import { InMemoryDatabaseAdapter } from '../src/adapters/inMemoryAdapter';
import app from '../src/app';

describe('Comprehensive REST API Integration Test Suite', () => {
  let authToken: string;

  beforeEach(() => {
    process.env.AI_PRIMARY_PROVIDER = 'MOCK';
    AdapterFactory.setAdapter(new InMemoryDatabaseAdapter());
  });

  const testUser = {
    email: `api_student_${Date.now()}@college.edu`,
    password: 'Password@123',
    fullName: 'API Integration Student',
    collegeName: 'IIT Bombay',
    branch: 'Computer Science',
    yearOfStudy: 3,
    degree: 'B.Tech',
    location: 'Mumbai, India',
    careerGoal: 'AI Engineer',
    bio: 'API Testing Bio',
  };

  it('should register and authenticate a student', async () => {
    const regRes = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(regRes.status).toBe(201);
    expect(regRes.body.success).toBe(true);
    expect(regRes.body.data.token).toBeDefined();

    authToken = regRes.body.data.token;

    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${authToken}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.data.email).toBe(testUser.email);
  });

  it('should fetch events list (GET /api/events)', async () => {
    const res = await request(app).get('/api/events');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should fetch aggregated student dashboard (GET /api/dashboard)', async () => {
    const regRes = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    const token = regRes.body.data.token;

    const res = await request(app)
      .get('/api/dashboard')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.studentProfile).toBeDefined();
    expect(res.body.data.recommendations).toBeDefined();
    expect(res.body.data.upcomingDeadlines).toBeDefined();
  });

  it('should log an interaction (POST /api/interactions)', async () => {
    const regRes = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    const token = regRes.body.data.token;

    const res = await request(app)
      .post('/api/interactions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        eventId: 'event-contract-1',
        action: 'VIEW',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it('should fetch AI usage telemetry and pool statuses (GET /api/ai/usage)', async () => {
    const res = await request(app).get('/api/ai/usage');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.usageSummary).toBeDefined();
    expect(res.body.data.gatewayPools).toBeDefined();
  });
});
