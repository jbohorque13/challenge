import { VercelRequest, VercelResponse } from '@vercel/node';
import { model } from '../lib/vertex';

/**
 * /api/chat - Streaming Gemini Proxy
 * 
 * Testing locally (with Vercel CLI):
 * $ vercel dev
 * $ curl -X POST http://localhost:3000/api/chat \
 *   -H "Content-Type: application/json" \
 *   -H "Authorization: Bearer YOUR_APP_SECRET" \
 *   -d '{"message": "Hola, ¿cómo estás?"}'
 * 
 * Deployment:
 * $ vercel deploy --prod
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Validate Method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 2. Validate Authorization
  const authHeader = req.headers.authorization;
  const appSecret = process.env.APP_SECRET;

  if (!appSecret || authHeader !== `Bearer ${appSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // 3. Read Body
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    // 4. Set Headers for Streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // 5. Initialize Streaming from Vertex AI
    const result = await model.generateContentStream({
      contents: [{ role: 'user', parts: [{ text: message }] }],
    });

    // 6. Iterate through stream and write to response
    for await (const chunk of result.stream) {
      const chunkText = chunk.candidates?.[0]?.content?.parts?.[0]?.text;
      if (chunkText) {
        // We send raw text or structured SSE. 
        // For our mobile client, sending chunks directly is often easier to parse.
        res.write(chunkText);
      }
    }

    // 7. End response
    res.end();
  } catch (error: any) {
    console.error('Vertex AI Error:', error);
    if (!res.writableEnded) {
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  }
}
