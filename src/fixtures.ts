import { createHash } from 'node:crypto';
import { stat, readFile } from 'node:fs/promises';
import path from 'node:path';
import type { FixtureHash } from './types.js';

export async function hashFixture(inputPath: string, cwd = process.cwd()): Promise<FixtureHash> {
  const absolute = path.resolve(cwd, inputPath);
  const data = await readFile(absolute);
  const info = await stat(absolute);
  return {
    path: normalizeRelative(path.relative(cwd, absolute)),
    algorithm: 'sha256',
    hash: createHash('sha256').update(data).digest('hex'),
    bytes: info.size
  };
}

export async function hashFixtures(paths: string[], cwd = process.cwd()): Promise<FixtureHash[]> {
  const unique = [...new Set(paths)].sort();
  return Promise.all(unique.map((fixturePath) => hashFixture(fixturePath, cwd)));
}

export async function compareFixture(fixture: FixtureHash, cwd = process.cwd()): Promise<string | null> {
  try {
    const current = await hashFixture(fixture.path, cwd);
    if (current.hash !== fixture.hash || current.bytes !== fixture.bytes) {
      return `${fixture.path} changed: expected ${fixture.hash}/${fixture.bytes} bytes, got ${current.hash}/${current.bytes} bytes`;
    }
    return null;
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'unknown read error';
    return `${fixture.path} unavailable: ${detail}`;
  }
}

function normalizeRelative(value: string): string {
  return value.split(path.sep).join('/');
}
