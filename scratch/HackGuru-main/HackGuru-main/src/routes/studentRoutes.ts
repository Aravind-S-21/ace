import { Router } from 'express';
import { StudentController } from '../controllers/studentController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const studentController = new StudentController();

// Global interests catalogue
router.get('/interests', studentController.getInterests);

// Student profile & interests/skills endpoints (mounted at /api/students)
router.get('/me', authMiddleware, studentController.getMe);
router.put('/me', authMiddleware, studentController.updateMe);

router.get('/me/interests', authMiddleware, studentController.getMyInterests);
router.put('/me/interests', authMiddleware, studentController.updateMyInterests);

router.get('/me/skills', authMiddleware, studentController.getMySkills);

// GitHub connection
router.post('/me/github', authMiddleware, studentController.connectGithub);

// Student activities & participation
router.get('/me/activities', authMiddleware, studentController.getActivities);
router.post('/me/activities', authMiddleware, studentController.addActivity);
router.post('/me/participate', authMiddleware, studentController.participateInEvent);

// Dedicated skill evolution history
router.get('/me/skills/evolution', authMiddleware, studentController.getSkillEvolution);

// AI Student Intelligence profile summary
router.get('/me/intelligence', authMiddleware, studentController.getIntelligenceProfile);

export default router;
