import { Router } from 'express';
import { EventController } from '../controllers/eventController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const eventController = new EventController();

router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);
router.post('/import', authMiddleware, eventController.importEvents);
router.post('/:id/analyze', authMiddleware, eventController.analyzeEvent);

export default router;
