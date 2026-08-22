import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical';
import { revalidatePath, revalidateTag } from 'next/cache';
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionConfig,
  FieldHook,
} from 'payload';

import { Role, hasRole, hasRoleOrPublished } from '@/payload/access';
import { Header } from '@/payload/blocks/header';
import { Links } from '@/payload/blocks/links';
import type { PayloadPagesCollection } from '@/payload/payload-types';
import { pageTag, pagesTag } from '@/payload/utils/cache-tags';
import { generatePreviewPath } from '@/payload/utils/generate-preview-path';
import { slugify } from '@/utils/slugify';

export const useSlug: FieldHook<
  PayloadPagesCollection,
  string | undefined,
  PayloadPagesCollection
> = ({ operation, siblingData }) => {
  if (operation === 'create' || operation === 'update') {
    return slugify(siblingData?.title);
  }
};

const pathFromSlug = (slug: string | null | undefined) => (slug === 'home' ? '/' : `/${slug}`);

const expirePage = (slug: string | null | undefined) => {
  revalidatePath(pathFromSlug(slug));
  revalidateTag(pageTag(slug ?? ''), { expire: 0 });
};

const revalidatePageAfterChange: CollectionAfterChangeHook<PayloadPagesCollection> = ({
  doc,
  previousDoc,
  req: { context, payload },
}) => {
  if (context.disableRevalidate) {
    return doc;
  }

  const published = doc._status === 'published';
  // Payload also reports this transition on the first autosaved draft of a published document, so
  // the branch can fire without the document actually leaving the site.
  const unpublished = previousDoc?._status === 'published' && !published;
  // A rename orphans the previous path and tag whatever the status transition is.
  const renamed = Boolean(previousDoc?.slug && previousDoc.slug !== doc.slug);

  if (published) {
    payload.logger.info(`Revalidating path: ${pathFromSlug(doc.slug)}`);
    expirePage(doc.slug);
  }

  if (unpublished || renamed) {
    payload.logger.info(`Revalidating previous path: ${pathFromSlug(previousDoc?.slug)}`);
    expirePage(previousDoc?.slug);
  }

  // Other pages inline this one's title and slug through link fields, so their cached output goes
  // stale too. Autosaved drafts change nothing that is published, so they are left alone.
  if (published || unpublished || renamed) {
    revalidateTag(pagesTag, { expire: 0 });
  }

  return doc;
};

export const revalidatePageAfterDelete: CollectionAfterDeleteHook<PayloadPagesCollection> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    expirePage(doc?.slug);
    revalidateTag(pagesTag, { expire: 0 });
  }

  return doc;
};

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  typescript: {
    interface: 'PayloadPagesCollection',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    livePreview: {
      url: ({ data }) =>
        generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'pages',
        }),
    },
    preview: (data) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'pages',
      }),
  },
  versions: {
    drafts: {
      autosave: {
        interval: 500,
      },
    },
  },
  access: {
    read: hasRoleOrPublished(Role.Admin),
    create: hasRole(Role.Admin),
    update: hasRole(Role.Admin),
    delete: hasRole(Role.Admin),
  },
  hooks: {
    afterChange: [revalidatePageAfterChange],
    afterDelete: [revalidatePageAfterDelete],
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
