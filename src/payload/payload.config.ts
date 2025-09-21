import path from 'path';
import { fileURLToPath } from 'url';

import { postgresAdapter } from '@payloadcms/db-postgres';
import { resendAdapter } from '@payloadcms/email-resend';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { s3Storage } from '@payloadcms/storage-s3';
import { buildConfig } from 'payload';
import sharp from 'sharp';

import { env } from '@/env/server';
import { Role } from '@/payload/access';
import { Media } from '@/payload/collections/media';
import { Pages } from '@/payload/collections/pages';
import { Users } from '@/payload/collections/users';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const whitelist = [env.SERVER_URL, ...env.DOMAINS.split(' ')];

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [Pages, Media, Users],
  endpoints: [
    {
      path: '/health',
      method: 'get',
      handler: async (req) => {
        try {
          const startTime = Date.now();

          await req.payload.find({
            collection: 'users',
            limit: 1,
            pagination: false,
          });

          const responseTime = Date.now() - startTime;

          return Response.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            checks: {
              database: {
                status: 'healthy',
                responseTime,
              },
            },
          });
        } catch {
          return Response.json(
            {
              status: 'unhealthy',
              timestamp: new Date().toISOString(),
              checks: {
                database: {
                  status: 'unhealthy',
                  error: 'Database connection failed',
                },
              },
            },
            { status: 503 },
          );
        }
      },
    },
  ],
  db: postgresAdapter({
    pool: {
      connectionString: env.POSTGRES_CONNECTION_STRING,
    },
    migrationDir: path.join(dirname, 'migrations'),
    idType: 'uuid',
  }),
  editor: lexicalEditor({}),
  email: resendAdapter({
    defaultFromAddress: env.DEFAULT_FROM_ADDRESS,
    defaultFromName: env.DEFAULT_FROM_NAME,
    apiKey: env.RESEND_API_KEY,
  }),
  plugins: [
    s3Storage({
      collections: {
        [Media.slug]: true,
      },
      bucket: env.R2_BUCKET,
      config: {
        endpoint: env.R2_ENDPOINT,
        credentials: {
          accessKeyId: env.R2_ACCESS_KEY_ID,
          secretAccessKey: env.R2_SECRET_ACCESS_KEY,
        },
        region: 'auto',
      },
    }),
  ],
  onInit: async (payload) => {
    const users = await payload.find({
      collection: 'users',
      limit: 1,
    });

    if (users.docs.length === 0) {
      await payload.create({
        collection: 'users',
        data: {
          email: env.PAYLOAD_ADMIN_USER,
          password: env.PAYLOAD_ADMIN_PASSWORD,
          roles: [Role.Admin],
        },
      });
    }
  },
  cors: whitelist,
  csrf: whitelist,
  serverURL: env.SERVER_URL,
  secret: env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
});
