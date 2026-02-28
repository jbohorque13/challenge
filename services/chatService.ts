/**
 * Chat Service - Phase 1 (Rest API)
 * 
 * Target: Vercel Backend
 */

// Replace with your Vercel deployment URL (e.g. 'https://your-project.vercel.app')
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL!;

// This must match the APP_SECRET in your backend environment variables
const APP_SECRET = process.env.EXPO_PUBLIC_APP_SECRET!;

export interface ChatResponse {
  reply: string;
  error?: string;
}

export const chatService = {
  /**
   * Sends a message to the Gemini/Vertex backend and returns the JSON response.
   */
  async sendMessage(userId: string, conversationId: string, message: string): Promise<ChatResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${APP_SECRET}`
        },
        body: JSON.stringify({
          userId,
          conversationId,
          message
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Server error');
      }

      return await response.json();
    } catch (error: any) {
      console.error('[chatService] Error:', error);
      throw error;
    }
  }
};
