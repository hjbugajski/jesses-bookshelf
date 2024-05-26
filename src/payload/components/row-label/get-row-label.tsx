import React from 'react';

import { RowLabel } from '@/payload/components/row-label';

export const getRowLabel = (path: string, fallback: string) => (
  <RowLabel path={path} fallback={fallback} />
);
