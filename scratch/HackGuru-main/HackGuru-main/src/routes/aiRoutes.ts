import { Router } from 'express';
import { getAIUsage } from '../controllers/aiController';

const router = Router();

// GET /api/ai/usage
router.get('/usage', getAIUsage);

export default router;
