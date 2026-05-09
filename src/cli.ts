#!/usr/bin/env node
import { Command, Option } from 'commander';
import { recordPack } from './record.js';
import { renderPack } from './render.js';
import { verifyPack } from './verify.js';
import { replaypackSchemaSummary } from './schema.js';

const program = new Command();

program
  .name('replaypack')
  .description('Deterministic CLI transcript packs for proof-oriented local smokes.')
  .version('0.1.0');

program.command('record')
  .description('Record a command into a deterministic JSONL replay pack.')
  .requiredOption('--name <name>', 'Pack name, used for the default output path')
  .option('-o, --output <path>', 'Output JSONL path')
  .option('--fixture <path>', 'Fixture file to hash; repeatable', collect, [])
  .option('--env <name>', 'Environment variable to allowlist into the header; repeatable', collect, [])
  .option('--redact-env <name>', 'Environment variable value to redact from output; repeatable', collect, [])
  .allowUnknownOption(true)
  .allowExcessArguments(true)
  .argument('[cmd...]', 'Command to record. Prefer: replaypack record --name demo -- node script.js')
  .action(async (cmd: string[], options: { name: string; output?: string; fixture: string[]; env: string[]; redactEnv: string[] }) => runCli(async () => {
    const command = stripCommandSeparator(cmd);
    const result = await recordPack({ name: options.name, output: options.output, fixtures: options.fixture, envAllow: options.env, redactEnv: options.redactEnv, command });
    console.error(`replaypack wrote ${result.output} (${result.eventCount} events, exit ${result.exitCode})`);
    process.exitCode = result.exitCode ?? 1;
  }));

program.command('verify')
  .description('Verify fixture hashes and stored transcript matchers.')
  .argument('<pack>', 'ReplayPack JSONL file')
  .option('--rerun', 'Re-run the recorded command before checking output matchers')
  .action(async (pack: string, options: { rerun?: boolean }) => runCli(async () => {
    const report = await verifyPack({ pack, rerun: Boolean(options.rerun) });
    console.log(JSON.stringify(report, null, 2));
    if (!report.ok) process.exitCode = 1;
  }));

program.command('render')
  .description('Render a replay pack into README-friendly evidence.')
  .argument('<pack>', 'ReplayPack JSONL file')
  .addOption(new Option('--format <format>', 'Output format').choices(['markdown', 'json']).default('markdown'))
  .action(async (pack: string, options: { format: 'markdown' | 'json' }) => runCli(async () => {
    process.stdout.write(await renderPack({ pack, format: options.format }));
  }));

program.command('schema')
  .description('Print a compact description of the v1 JSONL event schema.')
  .action(() => {
    console.log(JSON.stringify(replaypackSchemaSummary, null, 2));
  });

await program.parseAsync(process.argv);

function collect(value: string, previous: string[]): string[] {
  return [...previous, value];
}

function stripCommandSeparator(parts: string[]): string[] {
  return parts[0] === '--' ? parts.slice(1) : parts;
}

async function runCli(action: () => Promise<void>): Promise<void> {
  try {
    await action();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
