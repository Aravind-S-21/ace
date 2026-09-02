# AllCollegeEvent PostgreSQL Database Contract (`allcollegeevent.sql`)

This document defines the decoupled read/write database adapter contract mapping our Node.js/TypeScript AI backend (`e:\HackGuru`) to the external PostgreSQL database schema (`allcollegeevent.sql`).

---

## PostgreSQL Database Schema & 21-Requirement Matrix

The `allcollegeevent.sql` schema consists of **18 PostgreSQL tables and views**:

| # | Requirement | PostgreSQL Table/View | Key Columns | Implementation |
| :-: | :--- | :--- | :--- | :--- |
| 1 | **Student registration** | `users` | `user_id`, `full_name`, `email`, `department`, `college` | `authService.register` / `createUser` |
| 2 | **Student profiles** | `users`, `student_ai_summary` | `career_goal`, `location`, `skills`, `interests` | `studentService.getProfileByUserId` |
| 3 | **Interests** | `users.interests`, `student_ai_summary` | `interests text[]` | `studentController.updateMyInterests` |
| 4 | **Events** | `events` | `event_id`, `title`, `description`, `event_type`, `deadline` | `eventRepository.findAll` / `createEvent` |
| 5 | **Hackathons** | `hackathon_details` | `event_id`, `team_size_min`, `prize_pool`, `judging_criteria` | `adapter.getHackathonDetails` |
| 6 | **Internships** | `internship_details` | `event_id`, `company_name`, `stipend_amount`, `duration_months` | `adapter.getInternshipDetails` |
| 7 | **Projects** | `project_details` | `event_id`, `tech_stack`, `project_type`, `difficulty_level` | `adapter.getProjectDetails` |
| 8 | **Workshops** | `workshop_details` | `event_id`, `instructor_name`, `hands_on`, `prerequisites` | `adapter.getWorkshopDetails` |
| 9 | **User interactions** | `user_interactions` | `interaction_id`, `user_id`, `event_id`, `interaction_type` | `interactionRepository.logInteraction` |
| 10 | **Event AI analysis** | `event_ai_analysis` | `analysis_id`, `event_id`, `extracted_skills`, `target_audience` | `EventIntelligenceAgent` / `upsertEventAiAnalysis` |
| 11 | **Event analytics** | `event_analytics` | `analytics_id`, `event_id`, `views`, `clicks`, `saves`, `registrations` | `adapter.updateEventAnalytics` |
| 12 | **Recommendations** | `recommendations` | `recommendation_id`, `user_id`, `event_id`, `match_score`, `reason` | `RecommendationAgent` / `saveRecommendations` |
| 13 | **GitHub connections** | `github_connections` | `connection_id`, `user_id`, `github_username`, `top_languages`, `total_stars` | `studentController.connectGithub` |
| 14 | **Student activities** | `student_activities` | `activity_id`, `user_id`, `title`, `activity_type`, `skills_gained` | `studentController.addActivity` |
| 15 | **Student AI summary** | `student_ai_summary` | `summary_id`, `user_id`, `profile_summary`, `strongest_skills` | `StudentIntelligenceService` |
| 16 | **Dedicated student skills** | `student_skills` | `student_skill_id`, `user_id`, `skill_name`, `proficiency_score` | `adapter.updateStudentSkill` |
| 17 | **Skill evolution** | `skill_evolution` | `evolution_id`, `user_id`, `skill_name`, `previous_proficiency`, `new_proficiency` | `SkillEvolutionService.recordEventParticipation...` |
| 18 | **Event participation** | `event_participation` | `participation_id`, `user_id`, `event_id`, `participation_status` | `studentController.participateInEvent` |
| 19 | **Student intelligence** | `student_intelligence_profile` (View) | SQL View joining user, AI summary, skills, activities, GitHub data | `StudentIntelligenceService.generateStudentIntelligenceProfile` |
| 20 | **Integrity validation** | Foreign Key Constraints | `FOREIGN KEY (user_id)`, `FOREIGN KEY (event_id)` | Prisma & PostgreSQL FK validations |
| 21 | **Sample test data** | SQL Seed Statements | Pre-seeded SQL records in `allcollegeevent.sql` | `InMemoryDatabaseAdapter` & PostgreSQL seeds |

---

## Complete Feedback Loop Architecture Flow

```text
STUDENT ──> REGISTER ──> CREATE PROFILE ──> (Interests, Activities, GitHub)
                                                    │
                                                    ▼
                                           AI STUDENT PROFILER
                                                    │
                                      ┌─────────────┴─────────────┐
                                      ▼                           ▼
                            Student AI Summary            Skill Extraction
                                      │                           │
                                      └─────────────┬─────────────┘
                                                    ▼
                                       STUDENT INTELLIGENCE PROFILE
                                                    │
EVENT DATA ──> AI EVENT ANALYSIS ───────────────────┼──> RECOMMENDATION ENGINE
                                                    │           │
                                                    │           ▼
                                                    │   RECOMMENDED EVENTS
                                                    │           │
                                                    │           ▼
                                                    │      PARTICIPATES
                                                    │           │
                                                    │           ▼
                                                    │      NEW ACTIVITY
                                                    │           │
                                                    │           ▼
                                                    └── UPDATE SKILL EVOLUTION
```
