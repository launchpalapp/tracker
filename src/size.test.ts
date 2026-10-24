import { readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';

const SCRIPT_TAG_LIMIT_BYTES = 1024;

describe('the script tag file', () => {
  it('stays under 1 KB gzipped', () => {
    const file = readFileSync(new URL('../dist/pal.js', import.meta.url));

    expect(gzipSync(file, { level: 9 }).length).toBeLessThan(SCRIPT_TAG_LIMIT_BYTES);
  });
});
