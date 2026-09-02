import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

function parseCredentialPool(prefix: string, count: number): Array<{ id: string; secret: string }> {
  const list: Array<{ id: string; secret: string }> = [];
  for (let i = 1; i <= count; i++) {
    const keyName = `${prefix}_${i}`;
    const secret = process.env[keyName];
    if (secret && secret.trim().length > 0 && !secret.includes('your_')) {
      list.push({ id: keyName, secret: secret.trim() });
    }
  }

  // Fallback for single key env format if specified
  const singleKey = process.env[`${prefix}`];
  if (list.length === 0 && singleKey && singleKey.trim().length > 0 && !singleKey.includes('your_')) {
    list.push({ id: `${prefix}_1`, secret: singleKey.trim() });
  }

  return list;
}

export const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_ADAPTER: process.env.DATABASE_ADAPTER || 'inmemory',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/ace_ai_db?schema=public',
  JWT_SECRET: process.env.JWT_SECRET || 'ace_ai_backend_super_secret_jwt_key_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  AI_PRIMARY_PROVIDER: process.env.AI_PRIMARY_PROVIDER || 'GEMINI',

  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  HUGGINGFACE_MODEL: process.env.HUGGINGFACE_MODEL || 'mistralai/Mistral-7B-Instruct-v0.2',

  GEMINI_CREDENTIALS: parseCredentialPool('GEMINI_API_KEY', 10),
  OPENAI_CREDENTIALS: parseCredentialPool('OPENAI_API_KEY', 5),
  HF_CREDENTIALS: parseCredentialPool('HF_API_KEY', 2),

  ENABLE_MOCK_AI_FALLBACK: process.env.ENABLE_MOCK_AI_FALLBACK !== 'false',

  RECOMMENDATION_TOP_CANDIDATES_LIMIT: parseInt(process.env.RECOMMENDATION_TOP_CANDIDATES_LIMIT || '50', 10),
  RECOMMENDATION_FINAL_LIMIT: parseInt(process.env.RECOMMENDATION_FINAL_LIMIT || '10', 10),
};
