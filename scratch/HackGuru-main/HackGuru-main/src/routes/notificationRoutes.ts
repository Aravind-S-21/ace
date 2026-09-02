import { Router } from 'express';
import { NotificationController } from '../controllers/notificationController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const notificationController = new NotificationController();

router.get('/', authMiddleware, notificationController.getNotifications);
router.post('/:id/read', authMiddleware, notificationController.markAsRead);

export default router;
