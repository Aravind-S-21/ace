"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsageTracker = void 0;
const adapterFactory_1 = require("../../db/adapters/adapterFactory");
class UsageTracker {
    async track(log) {
        const metrics = {
            provider: log.provider,
            model: log.model,
            requestType: log.requestType,
            inputTokens: log.inputTokens,
            outputTokens: log.outputTokens,
            totalTokens: log.totalTokens,
            estimatedCost: log.estimatedCost,
            durationMs: log.durationMs,
            success: log.success,
            errorMessage: log.errorMessage,
        };
        const db = (0, adapterFactory_1.getDatabaseAdapter)();
        await db.logAIUsage(metrics);
        const safePromptSummary = `[${log.agent}] [Credential: ${log.credentialIdentifier}] [Cache: ${log.cacheStatus}] [Fallback: ${log.fallbackUsed}] - ${log.inputPrompt}`;
        await db.logAIRequest({
            provider: log.provider,
            model: log.model,
            requestType: log.requestType,
            inputPrompt: safePromptSummary,
            rawResponse: log.rawResponse,
            durationMs: log.durationMs,
            success: log.success,
            errorMessage: log.errorMessage,
        });
    }
}
exports.UsageTracker = UsageTracker;
