import { spawn } from 'node:child_process';
import path from 'node:path';
import { compareFixture } from './fixtures.js';
import { readPack } from './jsonl.js';
import { explainMatcher } from './matchers.js';
import type { VerifyReport } from './types.js';

export type VerifyOptions = {
  pack: string;
  cwd?: string;
  rerun?: boolean;
};

export async function verifyPack(options: VerifyOptions): Promise<VerifyReport> {
  const cwd = path.resolve(options.cwd ?? process.cwd());
  const packPath = path.resolve(cwd, options.pack);
  const loaded = await readPack(packPath);
  const failures: string[] = [];

  for (const fixture of loaded.header.fixtures) {
    const failure = await compareFixture(fixture, cwd);
    if (failure) failures.push(failure);
  }

  let stdout = loaded.result.stdout;
  let stderr = loaded.result.stderr;
  let exitCode = loaded.result.exitCode;

  if (options.rerun) {
    const rerun = await runCommand(loaded.header.command, cwd);
    stdout = rerun.stdout;
    stderr = rerun.stderr;
    exitCode = rerun.exitCode;
  }

  const stdoutFailure = explainMatcher('stdout', stdout, loaded.result.matchers.stdout);
  const stderrFailure = explainMatcher('stderr', stderr, loaded.result.matchers.stderr);
  const exitCodeMatched = exitCode === loaded.result.matchers.exitCode;
  if (stdoutFailure) failures.push(stdoutFailure);
  if (stderrFailure) failures.push(stderrFailure);
  if (!exitCodeMatched) failures.push(`exit code changed: expected ${loaded.result.matchers.exitCode}, got ${exitCode}`);

  return {
    ok: failures.length === 0,
    pack: options.pack,
    name: loaded.header.name,
    failures,
    fixtureCount: loaded.header.fixtures.length,
    stdoutMatched: !stdoutFailure,
    stderrMatched: !stderrFailure,
    exitCodeMatched
  };
}

async function runCommand(command: string[], cwd: string): Promise<{ stdout: string; stderr: string; exitCode: number | null }> {
  const child = spawn(command[0]!, command.slice(1), { cwd, shell: false, stdio: ['ignore', 'pipe', 'pipe'] });
  let stdout = '';
  let stderr = '';
  child.stdout.on('data', (chunk: Buffer) => { stdout += chunk.toString('utf8'); });
  child.stderr.on('data', (chunk: Buffer) => { stderr += chunk.toString('utf8'); });
  const exitCode = await new Promise<number | null>((resolve, reject) => {
    child.once('error', reject);
    child.once('exit', (code) => resolve(code));
  });
  return { stdout, stderr, exitCode };
}
