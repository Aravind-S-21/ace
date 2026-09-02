import { ProviderPool, CredentialStatus } from './providerPool';

export type AgentType = 'AGENT_1_RECOMMENDATION' | 'AGENT_2_EVENT_INTELLIGENCE';

export interface SelectedCredential {
  pool: ProviderPool;
  credentialStatus: CredentialStatus;
}

export class ProviderSelector {
  private geminiPool: ProviderPool;
  private openAiPool: ProviderPool;
  private hfPool: ProviderPool;

  constructor(pools: { geminiPool: ProviderPool; openAiPool: ProviderPool; hfPool: ProviderPool }) {
    this.geminiPool = pools.geminiPool;
    this.openAiPool = pools.openAiPool;
    this.hfPool = pools.hfPool;
  }

  public selectCredential(agentType: AgentType): SelectedCredential | null {
    // Preferred provider order by agent type
    const preferenceOrder =
      agentType === 'AGENT_2_EVENT_INTELLIGENCE'
        ? [this.geminiPool, this.openAiPool, this.hfPool]
        : [this.hfPool, this.geminiPool, this.openAiPool];

    for (const pool of preferenceOrder) {
      const available = pool.getAvailableCredentials();
      if (available.length > 0) {
        // Pick credential with lowest request count for load balancing across pool
        available.sort((a, b) => a.requestCount - b.requestCount);
        return { pool, credentialStatus: available[0] };
      }
    }

    return null;
  }
}
