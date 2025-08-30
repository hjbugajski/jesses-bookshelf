import * as migration_20241110_183932 from './20241110_183932';
import * as migration_20241227_173326 from './20241227_173326';
import * as migration_20250830_181756 from './20250830_181756';

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
    name: '20250830_181756'
  },
];
