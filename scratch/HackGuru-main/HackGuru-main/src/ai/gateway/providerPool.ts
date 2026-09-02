export type ProviderState = 'AVAILABLE' | 'COOLDOWN' | 'DISABLED' | 'FAILED';

export interface CredentialStatus {
  identifier: string; // e.g. "GEMINI_API_KEY_1" (NEVER secret)
  secret: string;
  provider: 'GEMINI' | 'OPENAI' | 'HUGGINGFACE' | 'MOCK';
  model: string;
  state: ProviderState;
  requestCount: number;
  failureCount: number;
  lastSuccessAt?: Date;
  cooldownUntil?: Date;
  lastErrorMessage?: string;
}

export class ProviderPool {
  private credentials: Map<string, CredentialStatus> = new Map();

  constructor(
    provider: 'GEMINI' | 'OPENAI' | 'HUGGINGFACE' | 'MOCK',
    model: string,
    items: Array<{ id: string; secret: string }>
  ) {
    items.forEach((item) => {
      this.credentials.set(item.id, {
        identifier: item.id,
        secret: item.secret,
        provider,
        model,
        state: 'AVAILABLE',
        requestCount: 0,
        failureCount: 0,
      });
    });
  }

  public getAvailableCredentials(): CredentialStatus[] {
    const now = new Date();
    const result: CredentialStatus[] = [];

    this.credentials.forEach((status) => {
      // Check if cooldown timer expired
      if (status.state === 'COOLDOWN' && status.cooldownUntil && now >= status.cooldownUntil) {
        status.state = 'AVAILABLE';
        status.cooldownUntil = undefined;
      }

      if (status.state === 'AVAILABLE') {
        result.push(status);
      }
    });

    return result;
  }

  public getCredentialStatus(identifier: string): CredentialStatus | undefined {
    return this.credentials.get(identifier);
  }

  public getAllStatuses(): Array<Omit<CredentialStatus, 'secret'>> {
    const list: Array<Omit<CredentialStatus, 'secret'>> = [];
    this.credentials.forEach(({ secret, ...safeStatus }) => {
      list.push(safeStatus);
    });
    return list;
  }

  public markSuccess(identifier: string) {
    const cred = this.credentials.get(identifier);
    if (cred) {
      cred.requestCount += 1;
      cred.lastSuccessAt = new Date();
      cred.state = 'AVAILABLE';
      cred.cooldownUntil = undefined;
    }
  }

  public markCooldown(identifier: string, cooldownSeconds: number, reason?: string) {
    const cred = this.credentials.get(identifier);
    if (cred) {
      cred.state = 'COOLDOWN';
      cred.failureCount += 1;
      cred.lastErrorMessage = reason;
      cred.cooldownUntil = new Date(Date.now() + cooldownSeconds * 1000);
    }
  }

  public markFailure(identifier: string, reason?: string) {
    const cred = this.credentials.get(identifier);
    if (cred) {
      cred.failureCount += 1;
      cred.lastErrorMessage = reason;
      // After 3 consecutive failures without cooldown info, mark COOLDOWN for 60s
      if (cred.failureCount >= 3) {
        cred.state = 'COOLDOWN';
        cred.cooldownUntil = new Date(Date.now() + 60000);
      }
    }
  }
}
