import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';
import { z } from 'zod';
import { validateRequest } from '../middleware/validate';

const router = Router();
const authController = new AuthController();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(2),
  collegeName: z.string().min(2),
  branch: z.string().min(2),
  yearOfStudy: z.number().int().min(1).max(5),
  degree: z.string().min(2),
  location: z.string().min(2),
  careerGoal: z.string().min(2),
  bio: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post('/register', validateRequest(registerSchema), authController.register);
router.post('/login', validateRequest(loginSchema), authController.login);
router.get('/me', authMiddleware, authController.getMe);

export default router;
