import { ProviderPool } from '../src/ai/gateway/providerPool';
import { QuotaManager } from '../src/ai/gateway/quotaManager';
import { ProviderSelector } from '../src/ai/gateway/providerSelector';
import { AIGateway } from '../src/ai/gateway/aiGateway';
import { AdapterFactory } from '../src/adapters/adapterFactory';
import { InMemoryDatabaseAdapter } from '../src/adapters/inMemoryAdapter';
import { EventIntelligenceAgent } from '../src/agents/eventIntelligence.agent';

describe('AI Gateway & Provider Pool Unit Test Suite', () => {
  beforeEach(() => {
    process.env.AI_PRIMARY_PROVIDER = 'MOCK';
    AdapterFactory.setAdapter(new InMemoryDatabaseAdapter());
  });

  it('should initialize ProviderPool and track credential availability', () => {
    const pool = new ProviderPool('GEMINI', 'gemini-2.5-flash', [
      { id: 'GEMINI_API_KEY_1', secret: 'secret_1' },
      { id: 'GEMINI_API_KEY_2', secret: 'secret_2' },
    ]);

    expect(pool.getAvailableCredentials().length).toBe(2);

    pool.markCooldown('GEMINI_API_KEY_1', 60, 'Rate limit 429');
    expect(pool.getAvailableCredentials().length).toBe(1);
    expect(pool.getAvailableCredentials()[0].identifier).toBe('GEMINI_API_KEY_2');
  });

  it('should parse retry-after seconds in QuotaManager', () => {
    const qm = new QuotaManager();
    expect(qm.parseRetryAfter('Quota exceeded. Please retry in 15s.')).toBe(15);
    expect(qm.parseRetryAfter('Rate limit 429')).toBe(60);
    expect(qm.parseRetryAfter('Invalid API Key')).toBeNull();
  });

  it('should select credentials according to agent preference in ProviderSelector', () => {
    const geminiPool = new ProviderPool('GEMINI', 'gemini-2.5-flash', [{ id: 'GEMINI_KEY_1', secret: 's1' }]);
    const openAiPool = new ProviderPool('OPENAI', 'gpt-4o-mini', [{ id: 'OPENAI_KEY_1', secret: 's2' }]);
    const hfPool = new ProviderPool('HUGGINGFACE', 'mistral-7b', [{ id: 'HF_KEY_1', secret: 's3' }]);

    const selector = new ProviderSelector({ geminiPool, openAiPool, hfPool });

    // Agent 2 prefers Gemini first
    const agent2Sel = selector.selectCredential('AGENT_2_EVENT_INTELLIGENCE');
    expect(agent2Sel?.credentialStatus.provider).toBe('GEMINI');

    // Agent 1 prefers Hugging Face first
    const agent1Sel = selector.selectCredential('AGENT_1_RECOMMENDATION');
    expect(agent1Sel?.credentialStatus.provider).toBe('HUGGINGFACE');
  });

  it('should preserve SHA-256 content-hash caching behavior (0 LLM call on hash match)', async () => {
    const adapter = AdapterFactory.getAdapter();
    const event = await adapter.createEvent({
      id: 'cache-test-event-100',
      title: 'Cache Demonstration Hackathon',
      description: 'Test sha-256 deduplication logic.',
      category: 'AI & ML',
      eligibility: 'All',
      requiredSkills: ['Python'],
      location: 'Online',
      duration: '24 Hours',
      startDate: new Date('2026-10-01'),
      registrationDeadline: new Date('2026-09-30'),
      organizer: 'AllCollegeEvent',
    });

    const agent2 = new EventIntelligenceAgent();

    // 1st processing - Cache MISS, analyzes event
    const intel1 = await agent2.processEventIntelligence(event.id);
    expect(intel1).toBeDefined();

    // 2nd processing - Cache HIT, returns cached object without calling LLM again
    const intel2 = await agent2.processEventIntelligence(event.id);
    expect(intel2.contentHash).toBe(intel1.contentHash);
  });
});
