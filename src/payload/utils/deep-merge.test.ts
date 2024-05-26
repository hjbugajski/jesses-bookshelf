import { describe, expect, it } from 'bun:test';

import { deepMerge } from './deep-merge';

describe('deepMerge', () => {
  it('should merge two simple objects', () => {
    const target = { a: 1, b: 2 };
    const source = { b: 3, c: 4 };
    const result = deepMerge(target as any, source as any);

    expect(result).toEqual({ a: 1, b: 3, c: 4 });
  });

  it('should handle nested objects', () => {
    const target = { a: { b: 2 } };
    const source = { a: { c: 3 } };
    const result = deepMerge(target as any, source as any);

    expect(result).toEqual({ a: { b: 2, c: 3 } });
  });

  it('should concatenate arrays by default', () => {
    const target = { array: [{ id: 1, name: 'A' }] };
    const source = { array: [{ id: 2, name: 'B' }] };
    const result = deepMerge(target, source);

    expect(result).toEqual({
      array: [
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
      ],
    });
  });

  it('should filter arrays based on provided key', () => {
    const target = {
      array: [
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
      ],
    };
    const source = {
      array: [
        { id: 2, name: 'B' },
        { id: 3, name: 'C' },
      ],
    };
    const result = deepMerge(target, source, { array: 'id' });

    expect(result).toEqual({
      array: [
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
        { id: 3, name: 'C' },
      ],
    });
  });

  it('should handle circular references', () => {
    const target: any = { a: 1 };
    const source: any = { b: 2 };

    target.self = target;
    source.self = source;

    const result = deepMerge(target, source);

    expect(result.a).toBe(1);
    expect(result.b).toBe(2);
    expect(result.self).toBe(result);
  });
});
