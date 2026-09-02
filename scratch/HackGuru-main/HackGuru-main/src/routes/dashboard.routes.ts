import { Router } from 'express';
import { DashboardController } from '../controllers/dashboardController';
import { authenticateJwt } from '../middleware/auth';

const router = Router();
const controller = new DashboardController();

router.get('/', authenticateJwt, controller.getDashboard);

export default router;
