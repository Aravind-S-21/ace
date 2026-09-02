"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderSelector = void 0;
class ProviderSelector {
    geminiPool;
    openAiPool;
    hfPool;
    constructor(pools) {
        this.geminiPool = pools.geminiPool;
        this.openAiPool = pools.openAiPool;
        this.hfPool = pools.hfPool;
    }
    selectCredential(agentType) {
        const preferenceOrder = agentType === 'AGENT_2_EVENT_INTELLIGENCE'
            ? [this.geminiPool, this.openAiPool, this.hfPool]
            : [this.hfPool, this.geminiPool, this.openAiPool];
        for (const pool of preferenceOrder) {
            const available = pool.getAvailableCredentials();
            if (available.length > 0) {
                available.sort((a, b) => a.requestCount - b.requestCount);
                return { pool, credentialStatus: available[0] };
            }
        }
        return null;
    }
}
exports.ProviderSelector = ProviderSelector;
