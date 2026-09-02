import { HfInference } from '@huggingface/inference';
import { AIProvider, AIProviderResponse } from './ai.provider.interface';
import { StructuredEventIntelligence, StructuredRecommendationOutput } from '../types/ai.types';
import { env } from '../config/env';
import { logger } from '../utils/logger';

export class HuggingFaceProvider implements AIProvider {
  public readonly providerName = 'HUGGINGFACE';
  public readonly modelName = env.HUGGINGFACE_MODEL || 'mistralai/Mistral-7B-Instruct-v0.2';
  private credentials: Array<{ id: string; secret: string }>;

  constructor() {
    this.credentials = env.HF_CREDENTIALS;
  }

  private getHfClient(token: string): HfInference {
    return new HfInference(token);
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
      throw new Error('Hugging Face API Token not configured.');
    }

    const prompt = `Analyze event "${event.title}" (${event.description}). Category: ${event.category}. Skills: ${event.requiredSkills.join(', ')}. Return pure JSON object with keys: domains, skills, targetAudience, difficulty, careerPaths, prerequisites, learningOutcomes, eventType.`;

    let lastError: any = null;

    for (const cred of this.credentials) {
      try {
        const hf = this.getHfClient(cred.secret);
        const res = await hf.chatCompletion({
          model: 'Qwen/Qwen2.5-Coder-32B-Instruct',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 500,
        });

        const content = res.choices[0]?.message?.content || '';
        const durationMs = Date.now() - startTime;
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('Failed to parse JSON response from Hugging Face model');
        }

        const data: StructuredEventIntelligence = JSON.parse(jsonMatch[0]);

        return {
          data,
          metrics: {
            provider: 'HUGGINGFACE',
            model: 'Qwen/Qwen2.5-Coder-32B-Instruct',
            requestType: 'EVENT_INTELLIGENCE',
            inputTokens: res.usage?.prompt_tokens || 180,
            outputTokens: res.usage?.completion_tokens || 120,
            totalTokens: res.usage?.total_tokens || 300,
            estimatedCost: 0.0,
            durationMs,
            success: true,
          },
        };
      } catch (err: any) {
        logger.warn(`[HuggingFaceProvider] Credential ${cred.id} failed: ${err.message}`);
        lastError = err;
      }
    }

    throw lastError || new Error('All Hugging Face API tokens failed.');
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
      throw new Error('Hugging Face API Token not configured.');
    }

    const prompt = `Refine recommendations for ${studentProfile.fullName} (${studentProfile.branch}, ${studentProfile.careerGoal}). Candidates: ${JSON.stringify(topCandidates)}. Return pure JSON {"recommendations": [{"eventId": "${topCandidates[0]?.eventId || 'ev-1'}", "reason": "High relevance", "explanation": "Detailed fit for student profile", "action": "recommend"}]}.`;

    let lastError: any = null;

    for (const cred of this.credentials) {
      try {
        const hf = this.getHfClient(cred.secret);
        const res = await hf.chatCompletion({
          model: 'Qwen/Qwen2.5-Coder-32B-Instruct',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 800,
        });

        const content = res.choices[0]?.message?.content || '';
        const durationMs = Date.now() - startTime;
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('Failed to parse JSON response from Hugging Face model');
        }

        const data: StructuredRecommendationOutput = JSON.parse(jsonMatch[0]);

        return {
          data,
          metrics: {
            provider: 'HUGGINGFACE',
            model: 'Qwen/Qwen2.5-Coder-32B-Instruct',
            requestType: 'RECOMMENDATION_REFINEMENT',
            inputTokens: res.usage?.prompt_tokens || 450,
            outputTokens: res.usage?.completion_tokens || 300,
            totalTokens: res.usage?.total_tokens || 750,
            estimatedCost: 0.0,
            durationMs,
            success: true,
          },
        };
      } catch (err: any) {
        logger.warn(`[HuggingFaceProvider] Credential ${cred.id} failed: ${err.message}`);
        lastError = err;
      }
    }

    throw lastError || new Error('All Hugging Face API tokens failed.');
  }
}
