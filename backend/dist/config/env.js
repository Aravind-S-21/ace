"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '.env') });
function parseCredentialPool(prefix, count) {
    const list = [];
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
exports.env = {
    PORT: parseInt(process.env.PORT || '4000', 10),
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_ADAPTER: (process.env.DATABASE_ADAPTER || process.env.DB_MODE || 'inmemory').toLowerCase(),
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/ace_db?schema=public',
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
    CORS_ORIGINS: (process.env.CORS_ORIGINS || 'http://localhost:3000').split(',').map((origin) => origin.trim()).filter(Boolean),
    RECOMMENDATION_TOP_CANDIDATES_LIMIT: parseInt(process.env.RECOMMENDATION_TOP_CANDIDATES_LIMIT || '50', 10),
    RECOMMENDATION_FINAL_LIMIT: parseInt(process.env.RECOMMENDATION_FINAL_LIMIT || '10', 10),
};
