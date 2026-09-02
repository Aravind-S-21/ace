"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderPool = void 0;
class ProviderPool {
    credentials = new Map();
    constructor(provider, model, items) {
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
    getAvailableCredentials() {
        const now = new Date();
        const result = [];
        this.credentials.forEach((status) => {
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
    getCredentialStatus(identifier) {
        return this.credentials.get(identifier);
    }
    getAllStatuses() {
        const list = [];
        this.credentials.forEach(({ secret, ...safeStatus }) => {
            list.push(safeStatus);
        });
        return list;
    }
    markSuccess(identifier) {
        const cred = this.credentials.get(identifier);
        if (cred) {
            cred.requestCount += 1;
            cred.lastSuccessAt = new Date();
            cred.state = 'AVAILABLE';
            cred.cooldownUntil = undefined;
        }
    }
    markCooldown(identifier, cooldownSeconds, reason) {
        const cred = this.credentials.get(identifier);
        if (cred) {
            cred.state = 'COOLDOWN';
            cred.failureCount += 1;
            cred.lastErrorMessage = reason;
            cred.cooldownUntil = new Date(Date.now() + cooldownSeconds * 1000);
        }
    }
    markFailure(identifier, reason) {
        const cred = this.credentials.get(identifier);
        if (cred) {
            cred.failureCount += 1;
            cred.lastErrorMessage = reason;
            if (cred.failureCount >= 3) {
                cred.state = 'COOLDOWN';
                cred.cooldownUntil = new Date(Date.now() + 60000);
            }
        }
    }
}
exports.ProviderPool = ProviderPool;
