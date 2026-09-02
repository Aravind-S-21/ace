import app from './app';
import { env } from './config/env';
import { logger } from './utils/logger';

const PORT = env.PORT;

app.listen(PORT, () => {
  logger.info(`🚀 AllCollegeEvent AI Backend running on port ${PORT}`);
  logger.info(`🌐 Environment: ${env.NODE_ENV}`);
  logger.info(`🤖 AI Primary Provider: ${env.AI_PRIMARY_PROVIDER}`);
});
