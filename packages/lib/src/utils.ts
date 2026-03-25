import { randomUUID } from "node:crypto";

export function generateId(): string {
  return randomUUID();
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface RetryOptions {
  attempts?: number;
  delayMs?: number;
  backoff?: boolean;
}

export async function retry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const { attempts = 3, delayMs = 1000, backoff = true } = options;
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < attempts - 1) {
        const delay = backoff ? delayMs * 2 ** i : delayMs;
        await sleep(delay);
      }
    }
  }
  throw lastError;
}
