# REST API Documentation

Base URL: `http://localhost:5000/api`

---

## 🔑 Authentication Endpoints

### 1. Register Student
`POST /api/auth/register`

**Payload:**
```json
{
  "email": "student1@college.edu",
  "password": "Password123",
  "fullName": "Aarav Sharma",
  "collegeName": "IIT Bombay",
  "branch": "Computer Science",
  "yearOfStudy": 3,
  "degree": "B.Tech",
  "location": "Bengaluru, India",
  "careerGoal": "AI Research Scientist",
  "bio": "Passionate about LLMs and Multi-agent systems."
}
```

### 2. Login
`POST /api/auth/login`

### 3. Current User Profile
`GET /api/auth/me` (Header: `Authorization: Bearer <token>`)

---

## 🎓 Student Profile & Taxonomy

- `GET /api/students/me`
- `PUT /api/students/me`
- `GET /api/interests`
- `GET /api/students/me/interests`
- `PUT /api/students/me/interests`
- `GET /api/students/me/skills`

---

## 🎪 Event Management & Ingestion

- `GET /api/events` (QueryParams: `category`, `location`, `search`)
- `GET /api/events/:id`
- `POST /api/events/import` (Ingests external events)
- `POST /api/events/:id/analyze` (Triggers Agent 2 re-analysis)

---

## 🎯 Personalized Recommendations

- `GET /api/recommendations` (Fetches top personalized events)
- `POST /api/recommendations/refresh` (Triggers Agent 1 refresh)

---

## 📊 Interactions Telemetry

- `POST /api/interactions`

**Payload:**
```json
{
  "eventId": "uuid-here",
  "action": "SAVE", // Options: VIEW, SAVE, SHARE, REGISTER, DISMISS, SEARCH, CALENDAR_ADD
  "metadata": { "platform": "flutter-android" }
}
```

---

## 📅 Calendar & Reminders

- `GET /api/calendar`
- `POST /api/calendar`
- `DELETE /api/calendar/:id`

---

## 🔔 Notifications

- `GET /api/notifications`
- `POST /api/notifications/:id/read`

---

## 📱 Aggregated Dashboard API

`GET /api/dashboard` (Header: `Authorization: Bearer <token>`)

Aggregates student profile, interests, skills, hackathons, internships, projects, events, upcoming deadlines, recommendations, and notifications in one payload.

---

## 🤖 AI Telemetry & Gateway Pool Status

`GET /api/ai/usage`

Returns total tokens consumed, request counts, estimated costs, latency, cache hit/miss stats, and current Gateway Pool health for Gemini, OpenAI, and Hugging Face.

