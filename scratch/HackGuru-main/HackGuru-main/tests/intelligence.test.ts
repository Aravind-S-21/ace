import { MockAIProvider } from '../src/ai/mock.provider';
import { AdapterFactory } from '../src/adapters/adapterFactory';
import { InMemoryDatabaseAdapter } from '../src/adapters/inMemoryAdapter';

describe('Event Intelligence & AI Provider Test Suite', () => {
  beforeEach(() => {
    AdapterFactory.setAdapter(new InMemoryDatabaseAdapter());
  });

  it('should generate structured event intelligence with expected schema', async () => {
    const mockProvider = new MockAIProvider();
    const event = {
      title: 'HackGURU 2026 AI Hackathon',
      description: 'Build production AI applications with Gemini and PyTorch.',
      category: 'AI & ML',
      eligibility: 'Open to all undergraduates',
      requiredSkills: ['Python', 'PyTorch', 'Gemini API'],
      location: 'Bengaluru / Hybrid',
      duration: '48 Hours',
      registrationDeadline: new Date(),
      organizer: 'AllCollegeEvent',
    };

    const res = await mockProvider.analyzeEvent(event);
    const intelligence = res.data;

    expect(intelligence.domains).toBeDefined();
    expect(intelligence.skills).toBeDefined();
    expect(intelligence.targetAudience).toBeDefined();
    expect(intelligence.difficulty).toBeDefined();
    expect(intelligence.eventType).toBeDefined();
  });

  it('should refine recommendations into structured JSON with reason and explanation', async () => {
    const mockProvider = new MockAIProvider();

    const studentProfile = {
      fullName: 'Aarav Sharma',
      branch: 'Computer Science',
      yearOfStudy: 3,
      careerGoal: 'AI Research Engineer',
      location: 'Bengaluru, India',
      skills: ['Python', 'PyTorch'],
      interests: ['Generative AI'],
    };

    const candidates = [
      {
        eventId: 'ev-101',
        title: 'HackGURU AI Hackathon',
        category: 'AI & ML',
        score: 0.92,
        matchingSignals: ['Branch match', 'Skill match: Python'],
        missingRequirements: [],
        recommendationReason: 'High domain alignment with AI Research Engineer',
      },
    ];

    const res = await mockProvider.refineRecommendations(studentProfile, candidates);
    const result = res.data;

    expect(result.recommendations).toBeDefined();
    expect(result.recommendations.length).toBeGreaterThan(0);
    expect(result.recommendations[0].eventId).toBe('ev-101');
    expect(result.recommendations[0].explanation).toBeDefined();
  });
});
