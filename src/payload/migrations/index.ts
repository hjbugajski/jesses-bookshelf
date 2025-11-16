import * as migration_20241110_183932 from './20241110_183932';
import * as migration_20241227_173326 from './20241227_173326';
import * as migration_20250830_181756 from './20250830_181756';
import * as migration_20251101_180520 from './20251101_180520';
import * as migration_20251116_213518 from './20251116_213518';

export const migrations = [
  {
    up: migration_20241110_183932.up,
    down: migration_20241110_183932.down,
    name: '20241110_183932',
  },
  {
    up: migration_20241227_173326.up,
    down: migration_20241227_173326.down,
    name: '20241227_173326',
  },
  {
    up: migration_20250830_181756.up,
    down: migration_20250830_181756.down,
    name: '20250830_181756',
  },
  {
    up: migration_20251101_180520.up,
    down: migration_20251101_180520.down,
    name: '20251101_180520',
  },
  {
    up: migration_20251116_213518.up,
    down: migration_20251116_213518.down,
    name: '20251116_213518'
  },
];
