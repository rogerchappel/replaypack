import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { compareFixture, hashFixture } from '../fixtures.js';

test('hashes and compares fixture files', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'replaypack-fixture-'));
  await writeFile(path.join(dir, 'input.txt'), 'alpha\n');
  const fixture = await hashFixture('input.txt', dir);
  assert.equal(fixture.bytes, 6);
  assert.equal(await compareFixture(fixture, dir), null);
  await writeFile(path.join(dir, 'input.txt'), 'beta\n');
  assert.match(String(await compareFixture(fixture, dir)), /changed/);
});
