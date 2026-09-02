import { AIGateway } from '../src/ai/gateway/aiGateway';
import { AdapterFactory } from '../src/adapters/adapterFactory';
import { InMemoryDatabaseAdapter } from '../src/adapters/inMemoryAdapter';

jest.setTimeout(20000);

describe('Real AI Provider Gateway Integration Test Suite', () => {
  beforeEach(() => {
    process.env.AI_PRIMARY_PROVIDER = 'MOCK';
    AdapterFactory.setAdapter(new InMemoryDatabaseAdapter());
  });

  const sampleEvent = {
    title: 'HackGURU Gateway Live Hackathon 2026',
    description: 'Build production AI solutions with AI Gateway routing.',
    category: 'AI & ML',
    eligibility: 'Engineering Students',
    requiredSkills: ['Python', 'PyTorch', 'Gemini API'],
    location: 'Bengaluru / Hybrid',
    duration: '48 Hours',
    registrationDeadline: new Date('2026-10-15'),
    organizer: 'AllCollegeEvent',
  };

  it('should process event analysis through AIGateway pool selection', async () => {
    const gateway = new AIGateway();
    const result = await gateway.analyzeEvent(sampleEvent);

    expect(result).toBeDefined();
    expect(result.domains).toBeDefined();
    expect(Array.isArray(result.domains)).toBe(true);
    expect(result.eventType).toBeDefined();
  });

  it('should process recommendation refinement through AIGateway pool selection', async () => {
    const gateway = new AIGateway();

    const studentProfile = {
      fullName: 'Aarav Sharma',
      branch: 'Computer Science',
      yearOfStudy: 3,
      careerGoal: 'AI Research Engineer',
      location: 'Bengaluru',
      skills: ['Python', 'PyTorch'],
      interests: ['Generative AI'],
    };

    const candidates = [
      {
        eventId: 'ev-gateway-1',
        title: 'HackGURU AI Hackathon',
        category: 'AI & ML',
        score: 0.92,
        matchingSignals: ['Branch match', 'Skill match: Python'],
        missingRequirements: [],
        recommendationReason: 'High domain alignment with AI Research Engineer',
      },
    ];

    const result = await gateway.refineRecommendations(studentProfile, candidates);

    expect(result).toBeDefined();
    expect(result.recommendations).toBeDefined();
    expect(result.recommendations.length).toBeGreaterThan(0);
  });
});
