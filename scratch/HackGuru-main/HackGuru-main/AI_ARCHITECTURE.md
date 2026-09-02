# AI Architecture & Multi-Agent Specifications

This document outlines the dual-agent AI architecture, provider abstraction layer, token management, and cost optimization strategies for AllCollegeEvent.com.

---

## 🤖 Dual AI Agent System

```
                      +-----------------------------+
                      | Raw Ingested Event Payload  |
                      +-----------------------------+
                                     |
                                     v
                      +-----------------------------+
                      | AGENT 2: Event Intelligence |
                      +-----------------------------+
                                     |
                                     v
                      +-----------------------------+
                      |  PostgreSQL Intelligence    |
                      +-----------------------------+
                                     |
                                     v
                      +-----------------------------+
                      | Deterministic Ranking Engine| (10,000 -> 50 Candidates)
                      +-----------------------------+
                                     |
                                     v
                      +-----------------------------+
                      | AGENT 1: Recommendation Agent| (50 -> 10 Final Feed)
                      +-----------------------------+
```

---

## 🔹 Agent 2: Event Intelligence Agent

- **Purpose**: Structure raw unstructured event descriptions into standardized domain, skill, target audience, difficulty, career path, and learning outcome tags.
- **Trigger**: Ingestion of a new event, content change, or manual request (`POST /api/events/:id/analyze`).
- **Caching**: Generates a SHA-256 `contentHash`. If the hash has not changed, cached intelligence is returned from PostgreSQL without calling LLMs.

---

## 🔹 Agent 1: Opportunity Recommendation Agent

- **Purpose**: Refine top candidates from the deterministic ranking engine and write personalized natural language explanations (`reason`, `explanation`, `action`).
- **Safety Boundary**: Never processes thousands of raw events. Only receives top candidate events pre-filtered by the deterministic ranking engine.

---

## 🛡️ Centralized AI Provider Abstraction (`src/ai/`)

- Interface: `AIProvider` (`analyzeEvent`, `refineRecommendations`).
- Providers:
  1. `GeminiProvider`: Primary provider utilizing Gemini API (`gemini-1.5-flash`).
  2. `HuggingFaceProvider`: Secondary fallback provider (`mistralai/Mistral-7B-Instruct-v0.2`).
  3. `MockAIProvider`: Zero-network fallback for development and testing environments.

---

## 📊 Token & Cost Optimization

Every AI request records:
- Provider, model, request type
- Input tokens, output tokens, total tokens
- Estimated cost (USD)
- Execution latency (`durationMs`)
- Success / failure logs

Stored in PostgreSQL tables `AIUsage` and `AIRequestLog`. Admin telemetry endpoint available at `GET /api/ai/usage`.
