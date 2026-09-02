# AllCollegeEvent.com - AI Intelligence Layer Backend (HackGURU 2026)

Production-style modular Node.js + TypeScript + Express backend serving as the AI-powered intelligence layer and recommendation engine for **AllCollegeEvent.com**.

Designed to power both:
1. **Flutter** (Android/iOS) Mobile Application
2. **Next.js** Web Application

---

## 🏛️ Architecture & Shared Database Ownership

> [!IMPORTANT]
> **External/Shared Database Model:**
> The PostgreSQL database schema is owned and developed by another team member.
> Our AI backend does **NOT** alter the schema, create competing tables, or automatically run migrations (`prisma db push`).
> All database access is decoupled behind a **Database Adapter Layer** (`IDatabaseAdapter`) implementing an explicit **[Database Contract](file:///e:/HackGuru/DATABASE_CONTRACT.md)**.

---

## 🌟 Key Features

- **AI Gateway & Provider Pools**: Centralized router (`src/ai/gateway/`) managing **10 Gemini keys**, **5 OpenAI keys**, **2 Hugging Face keys**, and an offline **Mock Fallback**. Handles credential isolation, load balancing, and rate-limit cooldowns without quota evasion.
- **Event Intelligence Agent (Agent 2)**: Parses incoming college events into structured domain, skill, target audience, difficulty, career path, and learning outcome tags. SHA-256 content-hash caching prevents redundant LLM invocations.
- **Deterministic Recommendation Ranking Engine**: High-performance Node.js scoring engine evaluating branch, skills, interests, career goals, location, and interaction history. Configurable weights (`src/config/rankingConfig.ts`). Reduces 10,000 events → 50 candidates → top 10 recommendations.
- **Opportunity Recommendation Agent (Agent 1)**: Refines top candidate events into personalized natural language feed recommendations for individual students.
- **Unified Dashboard Aggregation API (`GET /api/dashboard`)**: Aggregates student profile, interests, skills, hackathons, internships, projects, upcoming deadlines, recommendations, and notifications into a single JSON payload.
- **Calendar & Smart Notifications**: Manages registration deadline reminders, event start reminders, deterministic deadline alerts, and selective recommendation notifications.
- **AI Usage & Token Telemetry**: Tracks latency, token consumption, provider model, cache status, and safe credential identifiers (`GEMINI_API_KEY_1`, `OPENAI_API_KEY_2`, `HF_API_KEY_1`).

---

## 🛠️ Technology Stack

- **Backend**: Node.js (v24+), TypeScript (v5+), Express.js (v4+)
- **Database Access**: Database Adapter Layer (`PrismaDatabaseAdapter` & `InMemoryDatabaseAdapter`)
- **AI Gateway**: `AIGateway`, `ProviderPool`, `QuotaManager`, `ProviderSelector`, `UsageTracker`
- **AI SDKs**: Gemini API (`@google/generative-ai`), OpenAI API (`openai`), Hugging Face (`@huggingface/inference`)
- **Authentication & Security**: JWT (`jsonwebtoken`), Password hashing (`bcryptjs`), Rate limiting (`express-rate-limit`), Security headers (`helmet`), Request validation (`zod`)
- **Testing**: Jest, Supertest

---

## 🚀 Quick Start Guide

### 1. Installation
```bash
npm install
```

### 2. Configure Database Adapter Mode & AI Credentials
In `.env`:
```env
# Database Adapter (inmemory | prisma)
DATABASE_ADAPTER="inmemory"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ace_ai_db?schema=public"

# AI Credential Pools
GEMINI_API_KEY_1="your_gemini_key_1"
OPENAI_API_KEY_1="your_openai_key_1"
HF_API_KEY_1="your_hf_key_1"
```

### 3. Development Server
```bash
npm run dev
```
The server will start at `http://localhost:5000`.

### 4. Production Build & Start
```bash
npm run build
npm start
```

### 5. Automated Tests
```bash
npm test
```

---

## 📚 Documentation Links

- 🤖 [AI Architecture & Gateway Guide](file:///e:/HackGuru/docs/AI_ARCHITECTURE.md)
- 📋 [Database Contract Specifications](file:///e:/HackGuru/DATABASE_CONTRACT.md)
- 🔌 [API Documentation](file:///e:/HackGuru/API_DOCUMENTATION.md)
- ⚖️ [Recommendation Engine Specification](file:///e:/HackGuru/RECOMMENDATION_ENGINE.md)
