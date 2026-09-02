import cors from 'cors';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import { z } from 'zod';
import { env } from './config/env';
import { getDatabaseAdapter } from './db/adapters/adapterFactory';
import { AuthService } from './services/authService';
import { DashboardService } from './services/dashboardService';
import { EventService } from './services/eventService';
import { InteractionService } from './services/interactionService';
import { StudentIntelligenceService } from './services/studentIntelligenceService';
import { StudentService } from './services/studentService';
import { JwtPayload, JwtUtil } from './utils/jwt';

dotenv.config();

declare global { namespace Express { interface Request { user?: JwtPayload; } } }

const app = express();
const authService = new AuthService();
const eventService = new EventService();
const studentService = new StudentService();
const dashboardService = new DashboardService();
const intelligenceService = new StudentIntelligenceService();
const interactionService = new InteractionService();

app.set('json replacer', (_key: string, value: unknown) => typeof value === 'bigint' ? value.toString() : value);
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGINS, credentials: true }));
app.use(express.json({ limit: '1mb' }));

const asyncRoute = (handler: (req: Request, res: Response) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) => Promise.resolve(handler(req, res)).catch(next);

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const header = req.header('authorization');
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'Authorization required' });
  try { req.user = JwtUtil.verifyToken(header.slice(7)); return next(); }
  catch { return res.status(401).json({ error: 'Invalid or expired token' }); }
};

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'ace-backend', databaseAdapter: env.DATABASE_ADAPTER, timestamp: new Date().toISOString() }));
app.get('/health/db', asyncRoute(async (_req, res) => { await getDatabaseAdapter().listEvents({ limit: 1 }); res.json({ status: 'ok', databaseAdapter: env.DATABASE_ADAPTER }); }));

app.post('/api/auth/register', asyncRoute(async (req, res) => {
  const body = z.object({ email: z.string().email(), password: z.string().min(8), fullName: z.string().min(2), collegeName: z.string().min(2), branch: z.string().min(1), yearOfStudy: z.coerce.number().int().min(1), degree: z.string().min(1), location: z.string().min(1), careerGoal: z.string().min(1), bio: z.string().optional() }).parse(req.body);
  res.status(201).json(await authService.register(body));
}));
app.post('/api/auth/login', asyncRoute(async (req, res) => {
  const body = z.object({ email: z.string().email(), password: z.string().min(1) }).parse(req.body);
  res.json(await authService.login(body));
}));
app.get('/api/auth/me', requireAuth, asyncRoute(async (req, res) => res.json(await authService.getMe(req.user!.userId))));

app.get('/api/events', asyncRoute(async (req, res) => res.json(await eventService.getEvents({ category: req.query.category as string, location: req.query.location as string, search: req.query.search as string }))));
app.get('/api/events/:id', asyncRoute(async (req, res) => res.json(await eventService.getEventById(String(req.params.id)))));
app.post('/api/events/:id/analyze', requireAuth, asyncRoute(async (req, res) => res.json(await eventService.reanalyzeEvent(String(req.params.id)))));

app.get('/api/recommendations', requireAuth, asyncRoute(async (req, res) => res.json(await getDatabaseAdapter().getRecommendations(req.user!.userId))));
app.get('/api/dashboard', requireAuth, asyncRoute(async (req, res) => res.json(await dashboardService.getAggregatedDashboard(req.user!.userId))));
app.post('/api/recommendations/generate', requireAuth, asyncRoute(async (req, res) => res.json(await dashboardService.getAggregatedDashboard(req.user!.userId))));

app.get('/api/students/me', requireAuth, asyncRoute(async (req, res) => res.json(await studentService.getProfileByUserId(req.user!.userId))));
app.patch('/api/students/me', requireAuth, asyncRoute(async (req, res) => res.json(await studentService.updateProfile(req.user!.userId, req.body))));
app.get('/api/students/me/intelligence', requireAuth, asyncRoute(async (req, res) => res.json(await intelligenceService.generateStudentIntelligenceProfile(req.user!.userId))));
app.get('/api/students/me/activities', requireAuth, asyncRoute(async (req, res) => res.json(await getDatabaseAdapter().getStudentActivities(req.user!.userId))));
app.get('/api/students/me/skills', requireAuth, asyncRoute(async (req, res) => res.json(await getDatabaseAdapter().getStudentSkills(req.user!.userId))));

app.post('/api/interactions', requireAuth, asyncRoute(async (req, res) => {
  const body = z.object({ eventId: z.union([z.string(), z.number()]), action: z.string(), metadata: z.record(z.unknown()).optional() }).parse(req.body);
  res.status(201).json(await interactionService.logInteraction({ studentId: req.user!.userId, eventId: String(body.eventId), action: body.action as any, metadata: body.metadata }));
}));

app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));
app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const message = error instanceof z.ZodError ? error.issues.map((issue) => issue.message).join(', ') : error instanceof Error ? error.message : 'Internal server error';
  const status = error instanceof z.ZodError ? 400 : /not found/i.test(message) ? 404 : 500;
  if (status === 500) console.error(error);
  res.status(status).json({ error: message });
});

if (require.main === module) app.listen(env.PORT, () => console.log(`ACE backend listening on port ${env.PORT}`));
export default app;
