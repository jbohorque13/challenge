import { VercelRequest, VercelResponse } from '@vercel/node';
import { model } from '../lib/vertex';
import { conversationStore, ChatMessage } from '../lib/conversationStore';

/**
 * /api/chat - Phase 1: Regular JSON Response
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

  const { userId, conversationId, message } = req.body;
  if (!userId || !conversationId || !message) {
    return res.status(400).json({ error: 'userId, conversationId and message are required' });
  }

  try {
    const priorHistory: ChatMessage[] = await conversationStore.getHistory(userId, conversationId);
    
    const currentContents: ChatMessage[] = [
      ...priorHistory,
      { role: 'user' as const, parts: [{ text: message }] }
    ];

    await conversationStore.addMessage(userId, conversationId, 'user', message);

    // Call model without streaming for Phase 1
    const result = await model.generateContent({
      contents: currentContents,
    });

    const responseText = result.response.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (responseText) {
      await conversationStore.addMessage(userId, conversationId, 'model', responseText);
    }

    // Return standard JSON as requested
    return res.status(200).json({ reply: responseText });
  } catch (error: any) {
    console.error('Vertex AI Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
