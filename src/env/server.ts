import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DEFAULT_FROM_ADDRESS: z.string().min(1),
    DEFAULT_FROM_NAME: z.string().min(1),
    DOMAIN: z.string().min(1),
    DOMAINS: z.string().min(1),
    MONGODB_DATABASE: z.string().min(1),
    MONGODB_URL: z.string().min(1),
    PAYLOAD_ADMIN_PASSWORD: z.string().min(1),
    PAYLOAD_ADMIN_USER: z.string().min(1),
    PAYLOAD_SECRET: z.string().min(1),
    R2_ACCESS_KEY_ID: z.string().min(1),
    R2_BUCKET: z.string().min(1),
    R2_ENDPOINT: z.string().min(1),
    R2_SECRET_ACCESS_KEY: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    SERVER_URL: z.string().min(1),
  },
  runtimeEnv: {
    DEFAULT_FROM_ADDRESS: process.env.DEFAULT_FROM_ADDRESS,
    DEFAULT_FROM_NAME: process.env.DEFAULT_FROM_NAME,
    DOMAIN: process.env.DOMAIN,
    DOMAINS: process.env.DOMAINS,
    MONGODB_DATABASE: process.env.MONGODB_DATABASE,
    MONGODB_URL: process.env.MONGODB_URL,
    PAYLOAD_ADMIN_PASSWORD: process.env.PAYLOAD_ADMIN_PASSWORD,
    PAYLOAD_ADMIN_USER: process.env.PAYLOAD_ADMIN_USER,
    PAYLOAD_SECRET: process.env.PAYLOAD_SECRET,
    R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
    R2_BUCKET: process.env.R2_BUCKET,
    R2_ENDPOINT: process.env.R2_ENDPOINT,
    R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    SERVER_URL: process.env.SERVER_URL,
  },
});
