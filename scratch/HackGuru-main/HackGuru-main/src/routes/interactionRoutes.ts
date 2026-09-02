import { Router } from 'express';
import { InteractionController } from '../controllers/interactionController';
import { authMiddleware } from '../middleware/auth';
import { z } from 'zod';
import { validateRequest } from '../middleware/validate';

const router = Router();
const interactionController = new InteractionController();

const interactionSchema = z.object({
  eventId: z.string().min(1),
  action: z.enum(['VIEW', 'SAVE', 'SHARE', 'REGISTER', 'DISMISS', 'SEARCH', 'CALENDAR_ADD']),
  metadata: z.record(z.any()).optional(),
});

router.post('/', authMiddleware, validateRequest(interactionSchema), interactionController.logInteraction);

export default router;
