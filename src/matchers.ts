import type { Matcher } from './types.js';

export function exactMatcher(value: string): Matcher {
  return { kind: 'exact', value };
}

export function matchText(actual: string, matcher: Matcher): boolean {
  if (matcher.kind === 'exact') return actual === matcher.value;
  if (matcher.kind === 'contains') return actual.includes(matcher.value);
  return new RegExp(matcher.value, 'm').test(actual);
}

export function explainMatcher(label: string, actual: string, matcher: Matcher): string | null {
  if (matchText(actual, matcher)) return null;
  if (matcher.kind === 'exact') {
    return `${label} did not match exact transcript (${actual.length} chars now, ${matcher.value.length} chars recorded)`;
  }
  return `${label} did not satisfy ${matcher.kind} matcher: ${matcher.value}`;
}
