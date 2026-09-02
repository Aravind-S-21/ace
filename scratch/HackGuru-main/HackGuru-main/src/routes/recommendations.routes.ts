import { Router } from 'express';
import { RecommendationController } from '../controllers/recommendationController';
import { authenticateJwt } from '../middleware/auth';

const router = Router();
const controller = new RecommendationController();

router.get('/', authenticateJwt, controller.getRecommendations);
router.post('/refresh', authenticateJwt, controller.refreshRecommendations);

export default router;
