export type MessageRole = 'user' | 'model';

export interface ChatMessage {
  role: MessageRole;
  parts: [{ text: string }];
}

/**
 * ConversationStore - Abstraction for managing chat history.
 * Current implementation: In-memory Map (Best effort for single-instance/dev).
 * Scalable for future DB integration (Redis/Postgres).
 */
class ConversationStore {
  private conversations: Map<string, ChatMessage[]> = new Map();
  private readonly MAX_HISTORY = 20;

  public getHistory(conversationId: string): ChatMessage[] {
    return this.conversations.get(conversationId) || [];
  }

  public addMessage(conversationId: string, role: MessageRole, content: string): void {
    const history = this.getHistory(conversationId);
    
    history.push({
      role,
      parts: [{ text: content }]
    });

    // Keep only the last N messages to prevent token overflow
    const trimmedHistory = history.slice(-this.MAX_HISTORY);
    this.conversations.set(conversationId, trimmedHistory);
  }

  public clear(conversationId: string): void {
    this.conversations.delete(conversationId);
  }
}

// Singleton instance for the application
export const conversationStore = new ConversationStore();
