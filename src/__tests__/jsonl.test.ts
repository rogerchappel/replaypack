import test from 'node:test';
import assert from 'node:assert/strict';
import { encodeJsonl, loadEvents, parseJsonl } from '../jsonl.js';
import type { PackEvent } from '../types.js';

test('encodes and loads a minimal pack', () => {
  const events: PackEvent[] = [
    { type: 'header', version: 1, name: 'unit', createdAt: '1970-01-01T00:00:00.000Z', cwd: '.', command: ['node', '-v'], env: {}, fixtures: [], redactions: [], schema: 'https://replaypack.dev/schemas/replaypack-v1.json' },
    { type: 'result', exitCode: 0, signal: null, durationMs: 1, stdout: 'ok\n', stderr: '', matchers: { stdout: { kind: 'exact', value: 'ok\n' }, stderr: { kind: 'exact', value: '' }, exitCode: 0 } }
  ];
  const loaded = loadEvents(parseJsonl(encodeJsonl(events)));
  assert.equal(loaded.header.name, 'unit');
  assert.equal(loaded.result.stdout, 'ok\n');
});

test('rejects missing result', () => {
  assert.throws(() => loadEvents([{ type: 'header', version: 1, name: 'bad', createdAt: '1970-01-01T00:00:00.000Z', cwd: '.', command: [], env: {}, fixtures: [], redactions: [], schema: 'https://replaypack.dev/schemas/replaypack-v1.json' }]), /result/);
});
