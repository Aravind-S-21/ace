# Shared Database Integration & Adapter Setup Guide

This document details how the AI Backend integrates with the shared PostgreSQL database owned by another team member.

---

## 🏛️ Database Ownership Principle

The PostgreSQL database is owned and developed by another team member.
- The AI backend does **NOT** run migrations (`npx prisma db push` or `prisma migrate`).
- The AI backend does **NOT** alter existing shared tables or seed production data.
- The AI backend consumes the shared database via the **Database Adapter Layer** (`IDatabaseAdapter`).

---

## 🔌 Database Adapter Configurations (`src/adapters/`)

The application supports two adapter modes configured via `DATABASE_ADAPTER` in `.env`:

### 1. `inmemory` Mode (Default for Local Dev & Testing)
- Zero external database dependencies.
- Instantly populates mock contract data for offline execution and fast Jest tests.

### 2. `prisma` Mode (Production / Shared PostgreSQL)
- Connects to the shared PostgreSQL database using Prisma Client.
- Respects the contract defined in [`DATABASE_CONTRACT.md`](file:///e:/HackGuru/DATABASE_CONTRACT.md).

---

## 📋 Read/Write Contract Summary

For complete field specifications, refer to [`DATABASE_CONTRACT.md`](file:///e:/HackGuru/DATABASE_CONTRACT.md).

### Shared Read Tables:
- `users`
- `student_profiles`
- `interests` & `student_interests`
- `skills` & `student_skills`
- `events`
- `projects`
- `hackathons` & `hackathon_participations`
- `internships`
- `interactions`

### AI Backend Write Tables:
- `event_intelligence`
- `recommendations`
- `calendar_events`
- `notifications` & `notification_preferences`
- `ai_usage` & `ai_request_logs`
