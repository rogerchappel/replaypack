import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { assert } from './errors.js';
import type { PackEvent, LoadedPack, PackHeader, ResultEvent, StreamEvent } from './types.js';

export function encodeJsonl(events: PackEvent[]): string {
  return `${events.map((event) => JSON.stringify(event)).join('\n')}\n`;
}

export function parseJsonl(text: string): PackEvent[] {
  const events: PackEvent[] = [];
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  for (const [index, line] of lines.entries()) {
    try {
      events.push(JSON.parse(line) as PackEvent);
    } catch (error) {
      const detail = error instanceof Error ? error.message : 'unknown parse error';
      throw new Error(`Invalid JSONL at line ${index + 1}: ${detail}`);
    }
  }
  return events;
}

export function loadEvents(events: PackEvent[]): LoadedPack {
  const header = events.find((event): event is PackHeader => event.type === 'header');
  const result = events.find((event): event is ResultEvent => event.type === 'result');
  const streams = events.filter((event): event is StreamEvent => event.type === 'stream');
  assert(header, 'Pack is missing a header event.', 'PACK_HEADER_MISSING');
  assert(result, 'Pack is missing a result event.', 'PACK_RESULT_MISSING');
  assert(events[0]?.type === 'header', 'Pack header must be the first event.', 'PACK_HEADER_ORDER');
  assert(events.at(-1)?.type === 'result', 'Pack result must be the last event.', 'PACK_RESULT_ORDER');
  assert(header.version === 1, `Unsupported replaypack version: ${header.version}`, 'PACK_VERSION_UNSUPPORTED');
  return { header, result, streams, events };
}

export async function readPack(filePath: string): Promise<LoadedPack> {
  const text = await readFile(filePath, 'utf8');
  return loadEvents(parseJsonl(text));
}

export async function writePack(filePath: string, events: PackEvent[]): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, encodeJsonl(events), 'utf8');
}
