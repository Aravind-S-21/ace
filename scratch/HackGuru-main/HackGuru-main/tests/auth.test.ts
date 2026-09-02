import request from 'supertest';
import { AdapterFactory } from '../src/adapters/adapterFactory';
import { InMemoryDatabaseAdapter } from '../src/adapters/inMemoryAdapter';
import app from '../src/app';

describe('Auth Endpoints API Test Suite', () => {
  beforeEach(() => {
    // Ensure fresh in-memory database adapter for each test
    AdapterFactory.setAdapter(new InMemoryDatabaseAdapter());
  });

  const testUser = {
    email: `teststudent_${Date.now()}@college.edu`,
    password: 'Password@123',
    fullName: 'Test Student',
    collegeName: 'IIT Bombay',
    branch: 'Computer Science',
    yearOfStudy: 3,
    degree: 'B.Tech',
    location: 'Mumbai, India',
    careerGoal: 'AI Research Engineer',
    bio: 'Test bio for automated tests.',
  };

  it('should register a new student successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe(testUser.email);
  });

  it('should login an existing student', async () => {
    await request(app)
      .post('/api/auth/register')
      .send(testUser);

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.success).toBe(true);
    expect(loginRes.body.data.token).toBeDefined();
  });

  it('should fetch currently logged in user profile (GET /api/auth/me)', async () => {
    const regRes = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    const token = regRes.body.data.token;

    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.success).toBe(true);
    expect(meRes.body.data.email).toBe(testUser.email);
  });
});
