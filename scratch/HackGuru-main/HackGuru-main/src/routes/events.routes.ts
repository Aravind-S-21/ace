import { Router } from 'express';
import { EventController } from '../controllers/eventController';

const router = Router();
const controller = new EventController();

router.get('/', controller.getEvents);
router.get('/:id', controller.getEventById);
router.post('/import', controller.importEvents);
router.post('/:id/analyze', controller.analyzeEvent);

export default router;
