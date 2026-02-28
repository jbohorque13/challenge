import { Redis } from '@upstash/redis'
import dotenv from 'dotenv'

dotenv.config()

/**
 * Upstash Redis Client Initialization
 * 
 * Vercel Configuration:
 * 1. UPSTASH_REDIS_REST_URL: Your Upstash Redis REST URL
 * 2. UPSTASH_REDIS_REST_TOKEN: Your Upstash Redis REST Token
 */
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
})
