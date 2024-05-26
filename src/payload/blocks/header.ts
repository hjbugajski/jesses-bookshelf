import { Block } from 'payload/types';

import { Media } from '@/payload/collections/media';

export const Header: Block = {
  slug: 'header',
  interfaceName: 'BlockHeader',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'image',
      type: 'relationship',
      relationTo: Media.slug,
      required: true,
    },
  ],
};
