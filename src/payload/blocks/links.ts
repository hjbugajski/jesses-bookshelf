import type { Block, Field } from 'payload';

import { linkArray } from '@/payload/fields/link';
import { deepMerge } from '@/payload/utils/deep-merge';

export const Links: Block = {
  slug: 'links',
  interfaceName: 'PayloadLinksBlock',
  labels: {
    singular: 'Links',
    plural: 'Links',
  },
  fields: [
    deepMerge<Field>(
      {
        fields: [
          {
            name: 'text',
            type: 'text',
            required: true,
            label: 'Title',
          },
          {
            name: 'subtext',
            type: 'text',
            required: true,
            label: 'Subtitle',
          },
          {
            name: 'icon',
            type: 'select',
            required: true,
            options: [
              {
                label: 'Gift',
                value: 'gift',
              },
              {
                label: 'Instagram',
                value: 'instagram',
              },
              {
                label: 'Link',
                value: 'link',
              },
              {
                label: 'Mail',
                value: 'mail',
              },
              {
                label: 'Open Book',
                value: 'open-book',
              },
              {
                label: 'Shop',
                value: 'shop',
              },
              {
                label: 'TikTok',
                value: 'tiktok',
              },
            ],
          },
        ],
      },
      linkArray,
      { fields: 'name' },
    ),
  ],
};
