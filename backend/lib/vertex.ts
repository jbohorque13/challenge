import { VertexAI, GoogleAuthOptions } from '@google-cloud/vertexai';
import dotenv from 'dotenv';

dotenv.config();

const project = process.env.VERTEX_PROJECT_ID;
const clientEmail = process.env.VERTEX_CLIENT_EMAIL;
const privateKey = process.env.VERTEX_PRIVATE_KEY?.replace(/\\n/g, '\n');
const location = 'us-central1'; // Recommended for Gemini

if (!project || !clientEmail || !privateKey) {
  throw new Error('Missing Vertex AI environment variables: VERTEX_PROJECT_ID, VERTEX_CLIENT_EMAIL, or VERTEX_PRIVATE_KEY');
}

// Configuration for using Service Account credentials from environment variables
const googleAuthOptions: GoogleAuthOptions = {
  credentials: {
    client_email: clientEmail,
    private_key: privateKey,
  },
  projectId: project,
};

/**
 * Initialize Vertex AI with Service Account credentials
 * 
 * Vercel Configuration:
 * 1. Go to project -> Settings -> Environment Variables
 * 2. Add:
 *    - VERTEX_PROJECT_ID: Your GCP project id
 *    - VERTEX_CLIENT_EMAIL: service-account@your-project.iam.gserviceaccount.com
 *    - VERTEX_PRIVATE_KEY: -----BEGIN PRIVATE KEY-----\n... (paste directly)
 *    - APP_SECRET: A random secure string for client-side auth
 */
export const vertexAI = new VertexAI({ 
  project, 
  location,
  googleAuthOptions 
});

export const model = vertexAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  generationConfig: {
    maxOutputTokens: 2048,
    temperature: 0.7,
    topP: 0.8,
  },
});
