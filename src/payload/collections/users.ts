import type { CollectionConfig } from 'payload';

import { Role, hasRoleField, hasRoleOrSelfField } from '@/payload/access';

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'Admin',
  },
  auth: true,
  fields: [
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: [Role.Public],
      required: true,
      access: {
        read: hasRoleOrSelfField(Role.Admin),
        create: hasRoleField(Role.Admin),
        update: hasRoleField(Role.Admin),
      },
      options: [Role.Admin, Role.Public],
    },
  ],
};
