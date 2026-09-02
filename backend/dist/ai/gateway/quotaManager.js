"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuotaManager = void 0;
const logger_1 = require("../../utils/logger");
class QuotaManager {
    parseRetryAfter(errorMessage) {
        if (!errorMessage)
            return null;
        const secMatch = errorMessage.match(/retry in ([\d\.]+)s/i);
        if (secMatch && secMatch[1]) {
            const seconds = Math.ceil(parseFloat(secMatch[1]));
            return seconds > 0 ? seconds : 10;
        }
        const jsonDelayMatch = errorMessage.match(/"retryDelay"\s*:\s*"(\d+)s"/i);
        if (jsonDelayMatch && jsonDelayMatch[1]) {
            return parseInt(jsonDelayMatch[1], 10);
        }
        if (errorMessage.includes('429') || errorMessage.toLowerCase().includes('quota exceeded')) {
            return 60;
        }
        return null;
    }
    handleProviderError(pool, identifier, error) {
        const errorMsg = error?.message || String(error);
        const retryAfter = this.parseRetryAfter(errorMsg);
        if (retryAfter !== null) {
            logger_1.logger.warn(`[QuotaManager] Credential ${identifier} rate limited/quota hit. Enforcing cooldown for ${retryAfter}s.`);
            pool.markCooldown(identifier, retryAfter, errorMsg);
            return { isQuotaError: true, cooldownSeconds: retryAfter };
        }
        pool.markFailure(identifier, errorMsg);
        return { isQuotaError: false, cooldownSeconds: 0 };
    }
}
exports.QuotaManager = QuotaManager;
