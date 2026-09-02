# Deterministic Recommendation Ranking Engine Specification

This document details the deterministic, non-LLM ranking engine implemented in Node.js for AllCollegeEvent.com.

---

## 📐 Scoring Pipeline Architecture

```
10,000 Total Events in Database
       ↓
Database Candidate Filtering (CandidateFilter)
       ↓
500 Active Candidate Events
       ↓
Deterministic Scoring Engine (ScoringEngine)
       ↓
Top 50 Candidate Events (RankingService)
       ↓
Opportunity Recommendation Agent (Agent 1)
       ↓
Top 10 Final Feed Recommendations
```

---

## ⚖️ Configurable Weights (`src/config/rankingConfig.ts`)

Weights are managed by `RankingConfigService` so strategies can be adjusted dynamically without code redeployment:

```typescript
export const defaultRankingConfig = {
  weights: {
    branchMatch: 0.15,
    skillOverlap: 0.25,
    interestMatch: 0.20,
    careerGoalRelevance: 0.20,
    locationEligibility: 0.10,
    interactionHistory: 0.05,
    freshnessAndUrgency: 0.05,
  },
  minCandidateScore: 0.10,
  candidateLimit: 50,
  finalRecommendationLimit: 10,
};
```

---

## 🧮 Component Score Definitions

1. **Branch Match (15%)**: Evaluates match between student's branch (e.g. Computer Science) and event category.
2. **Skill Overlap (25%)**: Calculates overlap between student's skills and event's required skills.
3. **Interest Match (20%)**: Evaluates overlap between student's interests and event domains.
4. **Career Goal Relevance (20%)**: Evaluates direct alignment with student's career goal (e.g. "AI Research Scientist").
5. **Location & Eligibility (10%)**: Boosts online/remote events or local events in student's city.
6. **Interaction History (5%)**: Applies boost for saved/calendar events, penalty for dismissed events.
7. **Freshness & Urgency (5%)**: Prioritizes upcoming registration deadlines (1-3 days remaining).

---

## 📊 Output Schema

The ranking engine outputs:
- Candidate event ID & Total Weighted Score (0.0 to 1.0)
- Detailed score breakdown
- Matching signals
- Missing requirements
- Initial recommendation reason
