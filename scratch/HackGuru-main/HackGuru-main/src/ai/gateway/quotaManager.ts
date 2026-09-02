import { ProviderPool } from './providerPool';
import { logger } from '../../utils/logger';

export class QuotaManager {
  public parseRetryAfter(errorMessage: string): number | null {
    if (!errorMessage) return null;

    // 1. Look for retry-after header pattern or "retry in X.XXs"
    const secMatch = errorMessage.match(/retry in ([\d\.]+)s/i);
    if (secMatch && secMatch[1]) {
      const seconds = Math.ceil(parseFloat(secMatch[1]));
      return seconds > 0 ? seconds : 10;
    }

    // 2. Look for "retryDelay":"8s"
    const jsonDelayMatch = errorMessage.match(/"retryDelay"\s*:\s*"(\d+)s"/i);
    if (jsonDelayMatch && jsonDelayMatch[1]) {
      return parseInt(jsonDelayMatch[1], 10);
    }

    // 3. HTTP 429 quota error default fallback cooldown (60 seconds)
    if (errorMessage.includes('429') || errorMessage.toLowerCase().includes('quota exceeded')) {
      return 60;
    }

    return null;
  }

  public handleProviderError(
    pool: ProviderPool,
    identifier: string,
    error: any
  ): { isQuotaError: boolean; cooldownSeconds: number } {
    const errorMsg = error?.message || String(error);
    const retryAfter = this.parseRetryAfter(errorMsg);

    if (retryAfter !== null) {
      logger.warn(`[QuotaManager] Credential ${identifier} rate limited/quota hit. Enforcing cooldown for ${retryAfter}s.`);
      pool.markCooldown(identifier, retryAfter, errorMsg);
      return { isQuotaError: true, cooldownSeconds: retryAfter };
    }

    pool.markFailure(identifier, errorMsg);
    return { isQuotaError: false, cooldownSeconds: 0 };
  }
}
