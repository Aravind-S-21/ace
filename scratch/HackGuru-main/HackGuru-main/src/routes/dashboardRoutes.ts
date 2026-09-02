import { Router } from 'express';
import { DashboardController } from '../controllers/dashboardController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const dashboardController = new DashboardController();

router.get('/', authMiddleware, dashboardController.getDashboard);

export default router;
