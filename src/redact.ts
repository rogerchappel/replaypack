import type { RedactionRule } from './types.js';

const DEFAULT_SECRET_PATTERN = '(token|secret|password|passwd|api[_-]?key)=([^\\s]+)';

export function defaultRedactions(): RedactionRule[] {
  return [
    { name: 'common-secret-assignments', pattern: DEFAULT_SECRET_PATTERN, replacement: '$1=[REDACTED]' }
  ];
}

export function envRedactions(envNames: string[], env: NodeJS.ProcessEnv = process.env): RedactionRule[] {
  return envNames
    .filter((name) => typeof env[name] === 'string' && env[name] !== '')
    .map((name) => ({ name: `env:${name}`, env: name, replacement: `[REDACTED:${name}]` }));
}

export function redactText(input: string, rules: RedactionRule[], env: NodeJS.ProcessEnv = process.env): string {
  let output = input;
  for (const rule of rules) {
    if (rule.pattern) {
      output = output.replaceAll(new RegExp(rule.pattern, 'gi'), rule.replacement);
    }
    if (rule.env && env[rule.env]) {
      output = output.split(String(env[rule.env])).join(rule.replacement);
    }
  }
  return output;
}
