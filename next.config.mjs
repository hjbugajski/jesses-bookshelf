import { fileURLToPath } from 'node:url';

import { withPayload } from '@payloadcms/next/withPayload';
import createJiti from 'jiti';

const jiti = createJiti(fileURLToPath(import.meta.url));

jiti('./src/env/server.ts');

const production = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: production ? 'https' : 'http',
        hostname: production ? 'jessesbookshelf.com' : 'localhost',
        pathname: '/api/media/**',
      },
    ],
  },
};

export default withPayload(nextConfig);
