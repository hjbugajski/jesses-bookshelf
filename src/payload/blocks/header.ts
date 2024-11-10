import { Block } from 'payload';

export const Header: Block = {
  slug: 'header',
  interfaceName: 'PayloadHeaderBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'image',
      type: 'relationship',
      relationTo: 'media',
      required: true,
    },
  ],
};
