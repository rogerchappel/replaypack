import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { recordPack } from '../record.js';
import { renderPack } from '../render.js';

const root = path.resolve(process.cwd());

test('renders a pack as markdown', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'replaypack-render-'));
  const output = path.join(dir, 'render.replaypack.jsonl');
  await recordPack({ name: 'render', output, cwd: root, command: [process.execPath, 'tests/fixtures/hello.js'] });
  const markdown = await renderPack({ pack: output, format: 'markdown' });
  assert.match(markdown, /ReplayPack: render/);
  assert.match(markdown, /hello replaypack/);
});
