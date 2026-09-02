"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiProvider = void 0;
const genai_1 = require("@google/genai");
const env_1 = require("../../config/env");
const logger_1 = require("../../utils/logger");
class GeminiProvider {
    providerName = 'GEMINI';
    modelName = env_1.env.GEMINI_MODEL || 'gemini-2.5-flash';
    credentials;
    constructor() {
        this.credentials = env_1.env.GEMINI_CREDENTIALS;
    }
    getGenAI(key) {
        return new genai_1.GoogleGenAI({ apiKey: key });
    }
    async analyzeEvent(event) {
        const startTime = Date.now();
        if (this.credentials.length === 0) {
            throw new Error('Gemini API Key not configured.');
        }
        const prompt = `Analyze the following college event and extract structured JSON intelligence.
Event Details:
Title: ${event.title}
Description: ${event.description}
Category: ${event.category}
Eligibility: ${event.eligibility}
Required Skills: ${event.requiredSkills.join(', ')}
Location: ${event.location}
Duration: ${event.duration}
Organizer: ${event.organizer}

Return EXACTLY a JSON object matching this schema:
{
  "domains": ["string"],
  "skills": ["string"],
  "targetAudience": ["string"],
  "difficulty": "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ALL_LEVELS",
  "careerPaths": ["string"],
  "prerequisites": ["string"],
  "learningOutcomes": ["string"],
  "eventType": "HACKATHON" | "WORKSHOP" | "INTERNSHIP" | "SEMINAR" | "COMPETITION" | "PROJECT_COLLAB" | "OTHER"
}`;
        let lastError = null;
        for (const cred of this.credentials) {
            try {
                const ai = this.getGenAI(cred.secret);
                const response = await ai.models.generateContent({
                    model: this.modelName,
                    contents: prompt,
                    config: { responseMimeType: 'application/json' },
                });
                const text = response.text || '{}';
                const durationMs = Date.now() - startTime;
                const data = JSON.parse(text);
                return {
                    data,
                    metrics: {
                        provider: 'GEMINI',
                        model: this.modelName,
                        requestType: 'EVENT_INTELLIGENCE',
                        inputTokens: 200,
                        outputTokens: 100,
                        totalTokens: 300,
                        estimatedCost: 300 * 0.000001,
                        durationMs,
                        success: true,
                    },
                };
            }
            catch (err) {
                logger_1.logger.warn(`[GeminiProvider] Credential ${cred.id} failed: ${err.message}`);
                lastError = err;
            }
        }
        throw lastError || new Error('All Gemini API keys failed.');
    }
    async refineRecommendations(studentProfile, topCandidates) {
        const startTime = Date.now();
        if (this.credentials.length === 0) {
            throw new Error('Gemini API Key not configured.');
        }
        const prompt = `You are Agent 1 (Opportunity Recommendation Agent) for AllCollegeEvent.com.
Refine and explain top candidate events for the student.

Student Context:
Name: ${studentProfile.fullName}
Branch: ${studentProfile.branch} (Year ${studentProfile.yearOfStudy})
Career Goal: ${studentProfile.careerGoal}
Location: ${studentProfile.location}
Skills: ${studentProfile.skills.join(', ')}
Interests: ${studentProfile.interests.join(', ')}

Top Candidate Events:
${JSON.stringify(topCandidates, null, 2)}

Return EXACTLY a JSON object with this schema:
{
  "recommendations": [
    {
      "eventId": "string",
      "reason": "short high level summary",
      "explanation": "detailed personalized reason why this event fits the student profile",
      "action": "recommend"
    }
  ]
}`;
        let lastError = null;
        for (const cred of this.credentials) {
            try {
                const ai = this.getGenAI(cred.secret);
                const response = await ai.models.generateContent({
                    model: this.modelName,
                    contents: prompt,
                    config: { responseMimeType: 'application/json' },
                });
                const text = response.text || '{}';
                const durationMs = Date.now() - startTime;
                const data = JSON.parse(text);
                return {
                    data,
                    metrics: {
                        provider: 'GEMINI',
                        model: this.modelName,
                        requestType: 'RECOMMENDATION_REFINEMENT',
                        inputTokens: 500,
                        outputTokens: 300,
                        totalTokens: 800,
                        estimatedCost: 800 * 0.000001,
                        durationMs,
                        success: true,
                    },
                };
            }
            catch (err) {
                logger_1.logger.warn(`[GeminiProvider] Credential ${cred.id} failed: ${err.message}`);
                lastError = err;
            }
        }
        throw lastError || new Error('All Gemini API keys failed.');
    }
}
exports.GeminiProvider = GeminiProvider;
