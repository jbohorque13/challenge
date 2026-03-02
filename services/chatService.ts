/**
 * Chat Service - Phase 3 (React Native Streaming Implementation)
 * 
 * Target: Expo SDK 54 / React Native
 * Protocol: Server-Sent Events (SSE) via XMLHttpRequest
 * 
 * Rationale: fetch() in React Native does not support streaming (response.body is undefined).
 * XMLHttpRequest with onprogress is the established way to achieve incremental reads.
 */

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL!;
const APP_SECRET = process.env.EXPO_PUBLIC_APP_SECRET!;

export interface StreamOptions {
  userId: string;
  conversationId: string;
  message: string;
  onToken: (token: string) => void;
  onComplete: () => void;
  onError: (error: Error) => void;
}

export interface ChatStream {
  cancel: () => void;
}

export const chatService = {
  /**
   * sendMessageStream - Fully encapsulates SSE streaming logic using XMLHttpRequest.
   * UI remains agnostic of the underlying protocol.
   */
  sendMessageStream(options: StreamOptions): ChatStream {
    const { userId, conversationId, message, onToken, onComplete, onError } = options;

    const xhr = new XMLHttpRequest();
    let lastIndex = 0;
    let buffer = '';
    let isTerminated = false;

    const processBuffer = (incrementalText: string) => {
      buffer += incrementalText;

      // SSE messages are separated by double newlines
      const messages = buffer.split('\n\n');
      
      // Keep the last segment in the buffer as it might be incomplete
      buffer = messages.pop() || '';

      for (const rawMessage of messages) {
        const line = rawMessage.trim();
        if (!line || !line.startsWith('data: ')) continue;

        const dataContent = line.replace('data: ', '');

        if (dataContent === '[DONE]') {
          if (!isTerminated) {
            isTerminated = true;
            onComplete();
          }
          return;
        }

        try {
          const parsed = JSON.parse(dataContent);
          if (parsed.text) {
            onToken(parsed.text);
          } else if (parsed.error) {
            throw new Error(parsed.error);
          }
        } catch (e) {
          console.warn('[chatService] Error parsing chunk:', e, dataContent);
        }
      }
    };

    xhr.open('POST', `${API_BASE_URL}/api/chat`);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', `Bearer ${APP_SECRET}`);

    xhr.onprogress = () => {
      if (xhr.status === 200) {
        const incrementalText = xhr.responseText.substring(lastIndex);
        lastIndex = xhr.responseText.length;
        processBuffer(incrementalText);
      }
    };

    xhr.onload = () => {
      if (xhr.status !== 200) {
        try {
          const errorData = JSON.parse(xhr.responseText);
          onError(new Error(errorData.error || `HTTP ${xhr.status}`));
        } catch {
          onError(new Error(`Server error: ${xhr.status}`));
        }
        return;
      }
      
      // Process any remaining buffer at the end
      const finalIncremental = xhr.responseText.substring(lastIndex);
      if (finalIncremental) processBuffer(finalIncremental);
      
      if (!isTerminated) {
        isTerminated = true;
        onComplete();
      }
    };

    xhr.onerror = () => {
      if (!isTerminated) {
        onError(new Error('Network request failed'));
      }
    };

    xhr.ontimeout = () => {
      if (!isTerminated) {
        onError(new Error('Request timed out'));
      }
    };

    xhr.send(JSON.stringify({ userId, conversationId, message }));

    return {
      cancel: () => {
        isTerminated = true;
        xhr.abort();
      },
    };
  },
};
