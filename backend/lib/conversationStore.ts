import { redis } from './redis';

export type MessageRole = 'user' | 'model';

export interface ChatMessage {
  role: MessageRole;
  parts: [{ text: string }];
}

/**
 * ConversationStore - Redis-backed chat history management.
 * Key format: chat:{userId}:{conversationId}
 */
class ConversationStore {
  private readonly MAX_HISTORY = 20;

  private getKey(userId: string, conversationId: string): string {
    return `chat:${userId}:${conversationId}`;
  }

  /**
   * Retrieves messages for a specific user and conversation.
   * Vertex AI expects a specific format: { role: 'user' | 'model', parts: [{ text: string }] }
   */
  public async getHistory(userId: string, conversationId: string): Promise<ChatMessage[]> {
    const key = this.getKey(userId, conversationId);
    try {
      const history = await redis.get<ChatMessage[]>(key);
      return history || [];
    } catch (error) {
      console.error('Redis error getting history:', error);
      return [];
    }
  }

  /**
   * Appends a new message to the conversation history and trims it to the last N messages.
   */
  public async addMessage(
    userId: string, 
    conversationId: string, 
    role: MessageRole, 
    content: string
  ): Promise<void> {
    const key = this.getKey(userId, conversationId);
    const history = await this.getHistory(userId, conversationId);

    history.push({
      role,
      parts: [{ text: content }]
    });

    const trimmedHistory = history.slice(-this.MAX_HISTORY);

    try {
      // Set with a 24-hour expiration to keep Redis clean (optional, but recommended)
      await redis.set(key, trimmedHistory, { ex: 86400 });
    } catch (error) {
      console.error('Redis error adding message:', error);
    }
  }

  /**
   * Manual trim function as an abstraction.
   */
  public async trimHistory(userId: string, conversationId: string): Promise<void> {
    const key = this.getKey(userId, conversationId);
    const history = await this.getHistory(userId, conversationId);
    if (history.length > this.MAX_HISTORY) {
      const trimmed = history.slice(-this.MAX_HISTORY);
      await redis.set(key, trimmed, { ex: 86400 });
    }
  }

  public async clear(userId: string, conversationId: string): Promise<void> {
    const key = this.getKey(userId, conversationId);
    await redis.del(key);
  }
}

export const conversationStore = new ConversationStore();
