import { createClient } from 'redis';
import { randomUUID } from 'crypto';
import type { AgentInputItem, Session } from '@openai/agents';

export class RedisSession implements Session {
  private client;
  private sessionId: string;
  private readonly ttl = 86400; // 24 hours expiry

  constructor(sessionId?: string, redisUrl: string = 'redis://localhost:6379') {
    this.sessionId = sessionId ?? `session_${randomUUID()}`;
    this.client = createClient({ url: redisUrl });
    this.client.connect().catch(console.error);
  }

  async getSessionId(): Promise<string> {
    return this.sessionId;
  }

  setSessionId(id: string): void {
    this.sessionId = id;
  }

  async getItems(limit?: number): Promise<AgentInputItem[]> {
    const data = await this.client.get(`chat:${this.sessionId}`);
    const items: AgentInputItem[] = data ? JSON.parse(data) : [];
    
    // Return last X items if limit is provided
    if (limit && limit > 0) {
      return items.slice(-limit);
    }
    return items;
  }

  async addItems(newItems: AgentInputItem[]): Promise<void> {
    const existingData = await this.client.get(`chat:${this.sessionId}`);
    let items: AgentInputItem[] = existingData ? JSON.parse(existingData) : [];
    
    const maxItems = parseInt(process.env["SHORT_TERM_MEMORY_SIZE"] || '8', 10);
    items = [...items, ...newItems].slice(-maxItems);

    await this.client.set(`chat:${this.sessionId}`, JSON.stringify(items), {
      EX: this.ttl
    });
  }

  async popItem(): Promise<AgentInputItem | undefined> {
    const data = await this.client.get(`chat:${this.sessionId}`);
    if (!data) return undefined;

    let items: AgentInputItem[] = JSON.parse(data);
    const popped = items.pop();
    
    await this.client.set(`chat:${this.sessionId}`, JSON.stringify(items), {
      EX: this.ttl
    });
    return popped;
  }

  async clearSession(): Promise<void> {
    await this.client.del(`chat:${this.sessionId}`);
  }
}