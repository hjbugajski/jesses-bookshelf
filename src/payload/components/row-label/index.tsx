'use client';

import React from 'react';

import { useRowLabel } from '@payloadcms/ui/forms/RowLabel/Context';
import { Data } from 'payload';

export function RowLabel({ path, fallback }: { path: string; fallback: string }) {
  const { data, rowNumber } = useRowLabel<Data>();
  const fieldValue: any = path.split('.').reduce((value, part) => value?.[part], data);

  return <span>{fieldValue || `${fallback} ${rowNumber}`}</span>;
}
