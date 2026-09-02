import { GoogleGenAI } from '@google/genai';
import { AIProvider, AIProviderResponse } from './ai.provider.interface';
import { StructuredEventIntelligence, StructuredRecommendationOutput } from '../../types/ai.types';
import { env } from '../../config/env';
import { logger } from '../../utils/logger';

export class GeminiProvider implements AIProvider {
  public readonly providerName = 'GEMINI';
  public readonly modelName = env.GEMINI_MODEL || 'gemini-2.5-flash';
  private credentials: Array<{ id: string; secret: string }>;

  constructor() {
    this.credentials = env.GEMINI_CREDENTIALS;
  }

  private getGenAI(key: string): GoogleGenAI {
    return new GoogleGenAI({ apiKey: key });
  }

  public async analyzeEvent(event: {
    title: string;
    description: string;
    category: string;
    eligibility: string;
    requiredSkills: string[];
    location: string;
    duration: string;
    registrationDeadline: Date | string;
    organizer: string;
  }): Promise<AIProviderResponse<StructuredEventIntelligence>> {
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

    let lastError: any = null;

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
        const data: StructuredEventIntelligence = JSON.parse(text);

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
      } catch (err: any) {
        logger.warn(`[GeminiProvider] Credential ${cred.id} failed: ${err.message}`);
        lastError = err;
      }
    }

    throw lastError || new Error('All Gemini API keys failed.');
  }

  public async refineRecommendations(
    studentProfile: {
      fullName: string;
      branch: string;
      yearOfStudy: number;
      careerGoal: string;
      location: string;
      skills: string[];
      interests: string[];
      recentInteractions?: string[];
    },
    topCandidates: Array<{
      eventId: string;
      title: string;
      category: string;
      score: number;
      matchingSignals: string[];
      missingRequirements: string[];
      recommendationReason: string;
    }>
  ): Promise<AIProviderResponse<StructuredRecommendationOutput>> {
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

    let lastError: any = null;

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
        const data: StructuredRecommendationOutput = JSON.parse(text);

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
      } catch (err: any) {
        logger.warn(`[GeminiProvider] Credential ${cred.id} failed: ${err.message}`);
        lastError = err;
      }
    }

    throw lastError || new Error('All Gemini API keys failed.');
  }
}
