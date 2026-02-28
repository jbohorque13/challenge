import { VercelRequest, VercelResponse } from '@vercel/node';
import { model } from '../lib/vertex';
import { conversationStore, ChatMessage } from '../lib/conversationStore';

/**
 * /api/chat - Streaming Gemini Proxy with Conversation History
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const authHeader = req.headers.authorization;
  const appSecret = process.env.APP_SECRET;

  if (!appSecret || authHeader !== `Bearer ${appSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { conversationId, message } = req.body;
  if (!conversationId || !message) {
    return res.status(400).json({ error: 'conversationId and message are required' });
  }

  try {
    // 1. Get history and append user message
    const history: ChatMessage[] = conversationStore.getHistory(conversationId);
    
    // We append the new user message locally and use it to call the model
    const currentContents: ChatMessage[] = [
      ...history,
      { role: 'user' as const, parts: [{ text: message }] }
    ];

    conversationStore.addMessage(conversationId, 'user', message);

    // 2. Headless stream config
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const result = await model.generateContentStream({
      contents: currentContents,
    });

    let assistantFullResponse = '';

    // 3. Forward stream to client and capture full response
    for await (const chunk of result.stream) {
      const chunkText = chunk.candidates?.[0]?.content?.parts?.[0]?.text;
      if (chunkText) {
        assistantFullResponse += chunkText;
        res.write(chunkText);
      }
    }

    // 4. Persistence: add assistant response to history
    if (assistantFullResponse) {
      conversationStore.addMessage(conversationId, 'model', assistantFullResponse);
    }

    res.end();
  } catch (error: any) {
    console.error('Vertex AI Error:', error);
    if (!res.writableEnded) {
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  }
}
