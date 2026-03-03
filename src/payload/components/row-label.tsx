'use client';

import { useRowLabel } from '@payloadcms/ui';
import type { Data } from 'payload';

export function RowLabel({ path, fallback }: { path: string; fallback: string }) {
  const { data, rowNumber } = useRowLabel<Data>();
  const fieldValue: unknown = path
    .split('.')
    .reduce<unknown>((value, part) => (value as Record<string, unknown>)?.[part], data);

  return (fieldValue as string) || `${fallback} ${rowNumber}`;
}
