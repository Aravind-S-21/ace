"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockAIProvider = void 0;
class MockAIProvider {
    providerName = 'MOCK';
    modelName = 'mock-intelligence-v1';
    async analyzeEvent(event) {
        const startTime = Date.now();
        const isAI = event.category.toLowerCase().includes('ai') || event.title.toLowerCase().includes('ai');
        const intelligence = {
            domains: isAI
                ? ['Artificial Intelligence', 'Generative AI', 'Machine Learning']
                : ['Web Development', 'Software Engineering'],
            skills: event.requiredSkills.length > 0 ? event.requiredSkills : (isAI ? ['Python', 'PyTorch'] : ['TypeScript', 'React']),
            targetAudience: ['Undergraduate Students', 'Early Career Engineers'],
            difficulty: 'INTERMEDIATE',
            careerPaths: isAI ? ['AI Engineer', 'Machine Learning Scientist'] : ['Full Stack Engineer', 'Software Developer'],
            prerequisites: isAI ? ['Basic Python', 'Linear Algebra'] : ['Web Basics'],
            learningOutcomes: ['Practical Project Building', 'Team Collaboration', 'Industry Recognition'],
            eventType: event.title.toLowerCase().includes('hackathon')
                ? 'HACKATHON'
                : event.title.toLowerCase().includes('workshop')
                    ? 'WORKSHOP'
                    : 'COMPETITION',
        };
        const durationMs = Date.now() - startTime;
        return {
            data: intelligence,
            metrics: {
                provider: 'MOCK',
                model: this.modelName,
                requestType: 'EVENT_INTELLIGENCE',
                inputTokens: 150,
                outputTokens: 80,
                totalTokens: 230,
                estimatedCost: 0.0,
                durationMs,
                success: true,
            },
        };
    }
    async refineRecommendations(studentProfile, topCandidates) {
        const startTime = Date.now();
        const recommendations = topCandidates.slice(0, 10).map((candidate) => ({
            eventId: candidate.eventId,
            reason: candidate.recommendationReason,
            explanation: `Recommended for ${studentProfile.fullName} (${studentProfile.branch}, Year ${studentProfile.yearOfStudy}) pursuing a career as ${studentProfile.careerGoal}. Matching skills: ${studentProfile.skills.slice(0, 3).join(', ')}.`,
            action: 'recommend',
        }));
        const durationMs = Date.now() - startTime;
        return {
            data: { recommendations },
            metrics: {
                provider: 'MOCK',
                model: this.modelName,
                requestType: 'RECOMMENDATION_REFINEMENT',
                inputTokens: 400,
                outputTokens: 250,
                totalTokens: 650,
                estimatedCost: 0.0,
                durationMs,
                success: true,
            },
        };
    }
}
exports.MockAIProvider = MockAIProvider;
