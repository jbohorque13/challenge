import { VercelRequest, VercelResponse } from '@vercel/node';
import { model } from '../lib/vertex';
import { conversationStore, ChatMessage } from '../lib/conversationStore';

/**
 * /api/chat - Streaming Gemini Proxy with Redis-backed Conversation History
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Validate Authorization
  const authHeader = req.headers.authorization;
  const appSecret = process.env.APP_SECRET;
  if (!appSecret || authHeader !== `Bearer ${appSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Read Body - Support multi-user/multi-convo
  const { userId, conversationId, message } = req.body;
  if (!userId || !conversationId || !message) {
    return res.status(400).json({ 
      error: 'userId, conversationId and message are required in body' 
    });
  }

  try {
    // 1. Retrieve prior history from Redis
    const priorHistory: ChatMessage[] = await conversationStore.getHistory(userId, conversationId);
    
    // 2. Prepare the full history for the Vertex AI call
    const currentContents: ChatMessage[] = [
      ...priorHistory,
      { role: 'user' as const, parts: [{ text: message }] }
    ];

    // Persist new user message instantly
    await conversationStore.addMessage(userId, conversationId, 'user', message);

    // 3. Set SSE headers for real streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const result = await model.generateContentStream({
      contents: currentContents,
    });

    let assistantFullResponse = '';

    // 4. Stream response to client and capture assistant content
    for await (const chunk of result.stream) {
      const chunkText = chunk.candidates?.[0]?.content?.parts?.[0]?.text;
      if (chunkText) {
        assistantFullResponse += chunkText;
        res.write(chunkText);
      }
    }

    // 5. Persist the full assistant response once generation is complete
    if (assistantFullResponse) {
      await conversationStore.addMessage(userId, conversationId, 'model', assistantFullResponse);
    }

    res.end();
  } catch (error: any) {
    console.error('Vertex AI / Redis Integration Error:', error);
    if (!res.writableEnded) {
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  }
}
