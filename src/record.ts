import { spawn } from 'node:child_process';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { hashFixtures } from './fixtures.js';
import { writePack } from './jsonl.js';
import { exactMatcher } from './matchers.js';
import { defaultRedactions, envRedactions, redactText } from './redact.js';
import type { EnvCapture, PackEvent, RedactionRule, StreamEvent } from './types.js';

export type RecordOptions = {
  name: string;
  command: string[];
  output?: string;
  fixtures?: string[];
  envAllow?: string[];
  redactEnv?: string[];
  cwd?: string;
};

export type RecordResult = {
  output: string;
  exitCode: number | null;
  eventCount: number;
};

export async function recordPack(options: RecordOptions): Promise<RecordResult> {
  if (options.command.length === 0) {
    throw new Error('record requires a command after --');
  }

  const cwd = path.resolve(options.cwd ?? process.cwd());
  const redactions = [...defaultRedactions(), ...envRedactions(options.redactEnv ?? [], process.env)];
  const env = captureEnv(options.envAllow ?? [], redactions);
  const fixtures = await hashFixtures(options.fixtures ?? [], cwd);
  const output = path.resolve(cwd, options.output ?? `examples/${options.name}.replaypack.jsonl`);
  const started = performance.now();
  const streamEvents: StreamEvent[] = [];
  let stdout = '';
  let stderr = '';
  let index = 0;

  const child = spawn(options.command[0]!, options.command.slice(1), {
    cwd,
    env: process.env,
    shell: false,
    stdio: ['inherit', 'pipe', 'pipe']
  });

  child.stdout.on('data', (chunk: Buffer) => {
    const text = redactText(chunk.toString('utf8'), redactions);
    stdout += text;
    process.stdout.write(text);
    streamEvents.push({ type: 'stream', stream: 'stdout', chunk: text, index: index++ });
  });

  child.stderr.on('data', (chunk: Buffer) => {
    const text = redactText(chunk.toString('utf8'), redactions);
    stderr += text;
    process.stderr.write(text);
    streamEvents.push({ type: 'stream', stream: 'stderr', chunk: text, index: index++ });
  });

  const { exitCode, signal } = await new Promise<{ exitCode: number | null; signal: NodeJS.Signals | null }>((resolve, reject) => {
    child.once('error', reject);
    child.once('exit', (exitCode, signal) => resolve({ exitCode, signal }));
  });

  const durationMs = Math.round(performance.now() - started);
  const events: PackEvent[] = [
    {
      type: 'header',
      version: 1,
      name: options.name,
      createdAt: '1970-01-01T00:00:00.000Z',
      cwd: '.',
      command: options.command,
      env,
      fixtures,
      redactions: redactions.map((rule) => rule.name),
      schema: 'https://replaypack.dev/schemas/replaypack-v1.json'
    },
    ...streamEvents,
    {
      type: 'result',
      exitCode,
      signal,
      durationMs,
      stdout,
      stderr,
      matchers: { stdout: exactMatcher(stdout), stderr: exactMatcher(stderr), exitCode }
    }
  ];

  await writePack(output, events);
  return { output, exitCode, eventCount: events.length };
}

function captureEnv(names: string[], redactions: RedactionRule[]): EnvCapture {
  const captured: EnvCapture = {};
  for (const name of [...new Set(names)].sort()) {
    const value = process.env[name];
    if (value !== undefined) captured[name] = redactText(value, redactions);
  }
  return captured;
}
