import OpenAI from 'openai';
import { AIProvider, AIProviderResponse } from './ai.provider.interface';
import { StructuredEventIntelligence, StructuredRecommendationOutput } from '../types/ai.types';
import { env } from '../config/env';
import { logger } from '../utils/logger';

export class OpenAIProvider implements AIProvider {
  public readonly providerName = 'OPENAI';
  public readonly modelName = env.OPENAI_MODEL || 'gpt-4o-mini';
  private credentials: Array<{ id: string; secret: string }>;

  constructor() {
    this.credentials = env.OPENAI_CREDENTIALS;
  }

  private getClient(apiKey: string): OpenAI {
    return new OpenAI({ apiKey });
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
      throw new Error('OpenAI API Key not configured.');
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
        const openai = this.getClient(cred.secret);
        const completion = await openai.chat.completions.create({
          model: this.modelName,
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
        });

        const text = completion.choices[0].message.content || '{}';
        const durationMs = Date.now() - startTime;
        const data: StructuredEventIntelligence = JSON.parse(text);

        return {
          data,
          metrics: {
            provider: 'OPENAI',
            model: this.modelName,
            requestType: 'EVENT_INTELLIGENCE',
            inputTokens: completion.usage?.prompt_tokens || 200,
            outputTokens: completion.usage?.completion_tokens || 100,
            totalTokens: completion.usage?.total_tokens || 300,
            estimatedCost: (completion.usage?.total_tokens || 300) * 0.000002,
            durationMs,
            success: true,
          },
        };
      } catch (err: any) {
        logger.warn(`[OpenAIProvider] Credential ${cred.id} failed: ${err.message}`);
        lastError = err;
      }
    }

    throw lastError || new Error('All OpenAI API keys failed.');
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
      throw new Error('OpenAI API Key not configured.');
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
        const openai = this.getClient(cred.secret);
        const completion = await openai.chat.completions.create({
          model: this.modelName,
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
        });

        const text = completion.choices[0].message.content || '{}';
        const durationMs = Date.now() - startTime;
        const data: StructuredRecommendationOutput = JSON.parse(text);

        return {
          data,
          metrics: {
            provider: 'OPENAI',
            model: this.modelName,
            requestType: 'RECOMMENDATION_REFINEMENT',
            inputTokens: completion.usage?.prompt_tokens || 500,
            outputTokens: completion.usage?.completion_tokens || 300,
            totalTokens: completion.usage?.total_tokens || 800,
            estimatedCost: (completion.usage?.total_tokens || 800) * 0.000002,
            durationMs,
            success: true,
          },
        };
      } catch (err: any) {
        logger.warn(`[OpenAIProvider] Credential ${cred.id} failed: ${err.message}`);
        lastError = err;
      }
    }

    throw lastError || new Error('All OpenAI API keys failed.');
  }
}
