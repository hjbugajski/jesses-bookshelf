import { Field } from 'payload';

export const linkFields: Field[] = [
  {
    name: 'text',
    type: 'text',
    required: true,
  },
  {
    name: 'type',
    type: 'radio',
    admin: {
      layout: 'horizontal',
    },
    required: true,
    defaultValue: 'internal',
    options: [
      {
        label: 'Internal',
        value: 'internal',
      },
      {
        label: 'External',
        value: 'external',
      },
    ],
  },
  {
    name: 'relationship',
    label: 'Page',
    type: 'relationship',
    relationTo: 'pages',
    required: true,
    maxDepth: 1,
    admin: {
      condition: (_, siblingData) => siblingData?.type === 'internal',
    },
  },
  {
    name: 'anchor',
    type: 'text',
    admin: {
      condition: (_, siblingData) => siblingData?.type === 'internal',
    },
  },
  {
    name: 'url',
    label: 'External URL',
    type: 'text',
    required: true,
    admin: {
      condition: (_, siblingData) => siblingData?.type === 'external',
    },
  },
  {
    name: 'rel',
    label: 'Rel Attribute',
    type: 'select',
    hasMany: true,
    required: true,
    defaultValue: ['noreferrer', 'nofollow'],
    options: ['noreferrer', 'nofollow'],
    admin: {
      condition: (_, siblingData) => siblingData?.type === 'external',
    },
  },
  {
    name: 'newTab',
    label: 'Open in new tab',
    type: 'checkbox',
  },
  {
    type: 'row',
    fields: [
      {
        name: 'umamiEvent',
        type: 'text',
        admin: {
          width: '50%',
        },
      },
      {
        name: 'umamiEventId',
        label: 'Umami Event ID',
        type: 'text',
        admin: {
          width: '50%',
        },
      },
    ],
  },
];

export const linkArray: Field = {
  name: 'links',
  type: 'array',
  required: true,
  admin: {
    components: {
      RowLabel: {
        path: '@/payload/components/row-label.tsx',
        exportName: 'RowLabel',
        clientProps: {
          path: 'text',
          fallback: 'Link',
        },
      },
    },
  },
  interfaceName: 'FieldLinkArray',
  fields: linkFields,
};
