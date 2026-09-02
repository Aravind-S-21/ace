import { Router } from 'express';
import { RecommendationController } from '../controllers/recommendationController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const recommendationController = new RecommendationController();

router.get('/', authMiddleware, recommendationController.getRecommendations);
router.post('/refresh', authMiddleware, recommendationController.refreshRecommendations);

export default router;
