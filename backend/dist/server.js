"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const zod_1 = require("zod");
const env_1 = require("./config/env");
const adapterFactory_1 = require("./db/adapters/adapterFactory");
const authService_1 = require("./services/authService");
const dashboardService_1 = require("./services/dashboardService");
const eventService_1 = require("./services/eventService");
const interactionService_1 = require("./services/interactionService");
const studentIntelligenceService_1 = require("./services/studentIntelligenceService");
const studentService_1 = require("./services/studentService");
const jwt_1 = require("./utils/jwt");
dotenv_1.default.config();
const app = (0, express_1.default)();
const authService = new authService_1.AuthService();
const eventService = new eventService_1.EventService();
const studentService = new studentService_1.StudentService();
const dashboardService = new dashboardService_1.DashboardService();
const intelligenceService = new studentIntelligenceService_1.StudentIntelligenceService();
const interactionService = new interactionService_1.InteractionService();
app.set('json replacer', (_key, value) => typeof value === 'bigint' ? value.toString() : value);
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: env_1.env.CORS_ORIGINS, credentials: true }));
app.use(express_1.default.json({ limit: '1mb' }));
const asyncRoute = (handler) => (req, res, next) => Promise.resolve(handler(req, res)).catch(next);
const requireAuth = (req, res, next) => {
    const header = req.header('authorization');
    if (!header?.startsWith('Bearer '))
        return res.status(401).json({ error: 'Authorization required' });
    try {
        req.user = jwt_1.JwtUtil.verifyToken(header.slice(7));
        return next();
    }
    catch {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'ace-backend', databaseAdapter: env_1.env.DATABASE_ADAPTER, timestamp: new Date().toISOString() }));
app.get('/health/db', asyncRoute(async (_req, res) => { await (0, adapterFactory_1.getDatabaseAdapter)().listEvents({ limit: 1 }); res.json({ status: 'ok', databaseAdapter: env_1.env.DATABASE_ADAPTER }); }));
app.post('/api/auth/register', asyncRoute(async (req, res) => {
    const body = zod_1.z.object({ email: zod_1.z.string().email(), password: zod_1.z.string().min(8), fullName: zod_1.z.string().min(2), collegeName: zod_1.z.string().min(2), branch: zod_1.z.string().min(1), yearOfStudy: zod_1.z.coerce.number().int().min(1), degree: zod_1.z.string().min(1), location: zod_1.z.string().min(1), careerGoal: zod_1.z.string().min(1), bio: zod_1.z.string().optional() }).parse(req.body);
    res.status(201).json(await authService.register(body));
}));
app.post('/api/auth/login', asyncRoute(async (req, res) => {
    const body = zod_1.z.object({ email: zod_1.z.string().email(), password: zod_1.z.string().min(1) }).parse(req.body);
    res.json(await authService.login(body));
}));
app.get('/api/auth/me', requireAuth, asyncRoute(async (req, res) => res.json(await authService.getMe(req.user.userId))));
app.get('/api/events', asyncRoute(async (req, res) => res.json(await eventService.getEvents({ category: req.query.category, location: req.query.location, search: req.query.search }))));
app.get('/api/events/:id', asyncRoute(async (req, res) => res.json(await eventService.getEventById(String(req.params.id)))));
app.post('/api/events/:id/analyze', requireAuth, asyncRoute(async (req, res) => res.json(await eventService.reanalyzeEvent(String(req.params.id)))));
app.get('/api/recommendations', requireAuth, asyncRoute(async (req, res) => res.json(await (0, adapterFactory_1.getDatabaseAdapter)().getRecommendations(req.user.userId))));
app.get('/api/dashboard', requireAuth, asyncRoute(async (req, res) => res.json(await dashboardService.getAggregatedDashboard(req.user.userId))));
app.post('/api/recommendations/generate', requireAuth, asyncRoute(async (req, res) => res.json(await dashboardService.getAggregatedDashboard(req.user.userId))));
app.get('/api/students/me', requireAuth, asyncRoute(async (req, res) => res.json(await studentService.getProfileByUserId(req.user.userId))));
app.patch('/api/students/me', requireAuth, asyncRoute(async (req, res) => res.json(await studentService.updateProfile(req.user.userId, req.body))));
app.get('/api/students/me/intelligence', requireAuth, asyncRoute(async (req, res) => res.json(await intelligenceService.generateStudentIntelligenceProfile(req.user.userId))));
app.get('/api/students/me/activities', requireAuth, asyncRoute(async (req, res) => res.json(await (0, adapterFactory_1.getDatabaseAdapter)().getStudentActivities(req.user.userId))));
app.get('/api/students/me/skills', requireAuth, asyncRoute(async (req, res) => res.json(await (0, adapterFactory_1.getDatabaseAdapter)().getStudentSkills(req.user.userId))));
app.post('/api/interactions', requireAuth, asyncRoute(async (req, res) => {
    const body = zod_1.z.object({ eventId: zod_1.z.union([zod_1.z.string(), zod_1.z.number()]), action: zod_1.z.string(), metadata: zod_1.z.record(zod_1.z.unknown()).optional() }).parse(req.body);
    res.status(201).json(await interactionService.logInteraction({ studentId: req.user.userId, eventId: String(body.eventId), action: body.action, metadata: body.metadata }));
}));
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));
app.use((error, _req, res, _next) => {
    const message = error instanceof zod_1.z.ZodError ? error.issues.map((issue) => issue.message).join(', ') : error instanceof Error ? error.message : 'Internal server error';
    const status = error instanceof zod_1.z.ZodError ? 400 : /not found/i.test(message) ? 404 : 500;
    if (status === 500)
        console.error(error);
    res.status(status).json({ error: message });
});
if (require.main === module)
    app.listen(env_1.env.PORT, () => console.log(`ACE backend listening on port ${env_1.env.PORT}`));
exports.default = app;
