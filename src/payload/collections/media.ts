import { revalidateTag } from 'next/cache';
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionConfig,
} from 'payload';

import { Role, hasRole } from '@/payload/access';
import { addDataUrl } from '@/payload/hooks/add-data-url';
import { pagesTag } from '@/payload/utils/cache-tags';

// Pages inline media documents into their cached output, so any media change expires all of them.
const revalidatePagesAfterChange: CollectionAfterChangeHook = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    revalidateTag(pagesTag, { expire: 0 });
  }

  return doc;
};

const revalidatePagesAfterDelete: CollectionAfterDeleteHook = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    revalidateTag(pagesTag, { expire: 0 });
  }

  return doc;
};

export const Media: CollectionConfig = {
  slug: 'media',
  typescript: {
    interface: 'PayloadMediaCollection',
  },
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'createdAt', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: hasRole(Role.Admin),
    update: hasRole(Role.Admin),
    delete: hasRole(Role.Admin),
  },
  hooks: {
    afterChange: [addDataUrl, revalidatePagesAfterChange],
    afterDelete: [revalidatePagesAfterDelete],
  },
  upload: {
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
      },
      {
        name: 'preview',
        height: 192,
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      label: 'Description',
      type: 'text',
      required: true,
    },
    {
      name: 'displayOriginal',
      type: 'checkbox',
      defaultValue: false,
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'dataUrl',
      label: 'Data URL',
      type: 'text',
      maxLength: 1_000_000,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
};
