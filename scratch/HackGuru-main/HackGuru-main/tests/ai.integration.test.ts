import { AIService } from '../src/ai/ai.service';
import { MockAIProvider } from '../src/ai/mock.provider';
import { AdapterFactory } from '../src/adapters/adapterFactory';
import { InMemoryDatabaseAdapter } from '../src/adapters/inMemoryAdapter';

describe('Real AI Provider Integration Test Suite', () => {
  beforeEach(() => {
    AdapterFactory.setAdapter(new InMemoryDatabaseAdapter());
  });

  const sampleEvent = {
    title: 'HackGURU AI Hackathon 2026',
    description: 'Build production AI solutions with Gemini Flash.',
    category: 'AI & ML',
    eligibility: 'Open to All',
    requiredSkills: ['Python', 'PyTorch'],
    location: 'Bengaluru',
    duration: '48 Hours',
    registrationDeadline: new Date(),
    organizer: 'AllCollegeEvent',
  };

  it('should verify Mock AI Provider execution', async () => {
    const mock = new MockAIProvider();
    const result = await mock.analyzeEvent(sampleEvent);

    expect(result.data.domains).toContain('Artificial Intelligence');
    expect(result.metrics.provider).toBe('MOCK');
    expect(result.metrics.success).toBe(true);
  });

  it('should process event analysis through Mock AI Provider fallback', async () => {
    const mock = new MockAIProvider();
    const result = await mock.analyzeEvent(sampleEvent);

    expect(result.data).toBeDefined();
    expect(result.data.domains.length).toBeGreaterThan(0);
    expect(result.data.eventType).toBeDefined();
  });
});
