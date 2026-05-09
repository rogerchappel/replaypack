import { readPack } from './jsonl.js';

export type RenderOptions = {
  pack: string;
  format: 'markdown' | 'json';
};

export async function renderPack(options: RenderOptions): Promise<string> {
  const loaded = await readPack(options.pack);
  if (options.format === 'json') {
    return `${JSON.stringify(loaded, null, 2)}\n`;
  }

  const command = shellQuote(loaded.header.command);
  const status = loaded.result.exitCode === 0 ? 'passed' : `exit ${loaded.result.exitCode}`;
  const fixtureLines = loaded.header.fixtures.length === 0
    ? '- No fixtures recorded.'
    : loaded.header.fixtures.map((fixture) => `- \`${fixture.path}\` ${fixture.algorithm}:${fixture.hash.slice(0, 16)}… (${fixture.bytes} bytes)`).join('\n');

  return `### ReplayPack: ${loaded.header.name}\n\n` +
    `\`\`\`bash\n${command}\n\`\`\`\n\n` +
    `Result: **${status}** in ${loaded.result.durationMs}ms.\n\n` +
    `#### stdout\n\n\`\`\`text\n${loaded.result.stdout}\`\`\`\n\n` +
    `#### stderr\n\n\`\`\`text\n${loaded.result.stderr}\`\`\`\n\n` +
    `#### fixtures\n\n${fixtureLines}\n`;
}

function shellQuote(parts: string[]): string {
  return parts.map((part) => /^[A-Za-z0-9_./:=@-]+$/.test(part) ? part : `'${part.replaceAll("'", "'\\''")}'`).join(' ');
}
