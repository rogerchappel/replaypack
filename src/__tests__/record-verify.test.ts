import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { recordPack } from '../record.js';
import { readPack } from '../jsonl.js';
import { verifyPack } from '../verify.js';

const root = path.resolve(process.cwd());

test('records and verifies a command with fixtures', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'replaypack-record-'));
  const output = path.join(dir, 'basic.replaypack.jsonl');
  const result = await recordPack({
    name: 'basic',
    output,
    cwd: root,
    command: [process.execPath, 'tests/fixtures/hello.js'],
    fixtures: ['tests/fixtures/input.txt']
  });
  assert.equal(result.exitCode, 0);
  const pack = await readPack(output);
  assert.equal(pack.header.fixtures.length, 1);
  assert.match(pack.result.stdout, /hello replaypack/);
  const report = await verifyPack({ pack: output, cwd: root });
  assert.equal(report.ok, true);
});
