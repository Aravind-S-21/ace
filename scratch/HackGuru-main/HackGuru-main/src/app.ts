import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import { apiRateLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';

const app: Application = express();

// Security Middlewares
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));

// Body Parser & Rate Limiter
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiRateLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'AllCollegeEvent AI Intelligence Layer Backend',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api', routes);

// Centralized Error Handler
app.use(errorHandler);

export default app;
