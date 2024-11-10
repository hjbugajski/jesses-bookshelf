import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical';
import { revalidateTag } from 'next/cache';
import type { CollectionAfterChangeHook, CollectionConfig, FieldHook } from 'payload';

import { slugify } from '@/lib/utils/slugify';
import { Role, hasRole, hasRoleOrPublished } from '@/payload/access';
import { Header } from '@/payload/blocks/header';
import { Links } from '@/payload/blocks/links';
import type { PayloadPagesCollection } from '@/payload/payload-types';

export const useSlug: FieldHook<
  PayloadPagesCollection,
  string | undefined,
  PayloadPagesCollection
> = ({ operation, siblingData }) => {
  if (operation === 'create' || operation === 'update') {
    return slugify(siblingData?.title);
  }
};

export const useRevalidateTag: CollectionAfterChangeHook<PayloadPagesCollection> = ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  payload.logger.info('revalidating pages');
  revalidateTag('pages');

  if (doc._status === 'published') {
    payload.logger.info(`revalidating page_${doc.slug}`);
    revalidateTag(`page_${doc.slug}`);
  }

  if (previousDoc?._status === 'published' && doc._status !== 'published') {
    payload.logger.info(`revalidating page_${previousDoc.slug}`);
    revalidateTag(`page_${previousDoc.slug}`);
  }

  return doc;
};

export const Pages: CollectionConfig = {
  slug: 'pages',
  typescript: {
    interface: 'PayloadPagesCollection',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
  },
  versions: {
    drafts: true,
  },
  access: {
    read: hasRoleOrPublished(Role.Admin),
    create: hasRole(Role.Admin),
    update: hasRole(Role.Admin),
    delete: hasRole(Role.Admin),
  },
  hooks: {
    afterChange: [useRevalidateTag],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: () => [
          BlocksFeature({
            blocks: [Header, Links],
          }),
        ],
      }),
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      hooks: {
        beforeValidate: [useSlug],
      },
    },
  ],
};
