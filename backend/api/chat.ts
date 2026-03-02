import { VercelRequest, VercelResponse } from '@vercel/node';
import { model } from '../lib/vertex';
import { conversationStore, ChatMessage } from '../lib/conversationStore';

/**
 * /api/chat - Production Streaming Gemini Proxy
 * 
 * Target: Vercel Serverless Function (Node runtime)
 * Protocol: Server-Sent Events (SSE)
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Method Validation
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 2. Authentication Validation
  const authHeader = req.headers.authorization;
  const appSecret = process.env.APP_SECRET;

  if (!appSecret || authHeader !== `Bearer ${appSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // 3. Payload Validation
  const { userId, conversationId, message } = req.body;
  if (!userId || !conversationId || !message) {
    return res.status(400).json({ error: 'userId, conversationId and message are required' });
  }

  try {
    // 4. Persistence: Retrieve history and add user message
    const priorHistory: ChatMessage[] = await conversationStore.getHistory(userId, conversationId);
    
    const currentContents: ChatMessage[] = [
      ...priorHistory,
      { role: 'user' as const, parts: [{ text: message }] }
    ];

    await conversationStore.addMessage(userId, conversationId, 'user', message);

    // 5. Streaming Configuration
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Prevent buffering in some proxy setups

    // 6. Request Stream from Vertex AI
    const result = await model.generateContentStream({
      contents: currentContents,
    });

    let assistantFullResponse = '';

    // 7. Iterate through chunks and stream to client
    for await (const chunk of result.stream) {
      const chunkText = chunk.candidates?.[0]?.content?.parts?.[0]?.text;
      if (chunkText) {
        assistantFullResponse += chunkText;
        // SSE Format: data: {content}\n\n
        res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
      }
    }

    // 8. Persistence: Save assistant's completed response
    if (assistantFullResponse) {
      await conversationStore.addMessage(userId, conversationId, 'model', assistantFullResponse);
    }

    // 9. Finalize Stream
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error: any) {
    console.error('Vertex AI Streaming Error:', error);
    
    // If headers were already sent, we can't send a normal JSON error
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ error: 'Stream interrupted', details: error.message })}\n\n`);
      res.end();
    } else {
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  }
}
