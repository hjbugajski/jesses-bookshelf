import path from 'path';
import { fileURLToPath } from 'url';

import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { s3Storage } from '@payloadcms/storage-s3';
import { buildConfig } from 'payload/config';
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
  collections: [Media, Pages, Users],
  db: mongooseAdapter({
    url: env.MONGODB_URL,
    connectOptions: {
      dbName: env.MONGODB_DATABASE,
    },
  }),
  editor: lexicalEditor({}),
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
