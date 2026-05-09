export type ReplaypackVersion = 1;

export type HashAlgorithm = 'sha256';

export type MatcherKind = 'exact' | 'contains' | 'regex';

export type RedactionRule = {
  name: string;
  pattern?: string;
  env?: string;
  replacement: string;
};

export type FixtureHash = {
  path: string;
  algorithm: HashAlgorithm;
  hash: string;
  bytes: number;
};

export type EnvCapture = Record<string, string>;

export type PackHeader = {
  type: 'header';
  version: ReplaypackVersion;
  name: string;
  createdAt: string;
  cwd: string;
  command: string[];
  env: EnvCapture;
  fixtures: FixtureHash[];
  redactions: string[];
  schema: 'https://replaypack.dev/schemas/replaypack-v1.json';
};

export type StreamName = 'stdout' | 'stderr';

export type StreamEvent = {
  type: 'stream';
  stream: StreamName;
  chunk: string;
  index: number;
};

export type ResultEvent = {
  type: 'result';
  exitCode: number | null;
  signal: NodeJS.Signals | null;
  durationMs: number;
  stdout: string;
  stderr: string;
  matchers: {
    stdout: Matcher;
    stderr: Matcher;
    exitCode: number | null;
  };
};

export type Matcher = {
  kind: MatcherKind;
  value: string;
};

export type PackEvent = PackHeader | StreamEvent | ResultEvent;

export type LoadedPack = {
  header: PackHeader;
  streams: StreamEvent[];
  result: ResultEvent;
  events: PackEvent[];
};

export type VerifyReport = {
  ok: boolean;
  pack: string;
  name: string;
  failures: string[];
  fixtureCount: number;
  stdoutMatched: boolean;
  stderrMatched: boolean;
  exitCodeMatched: boolean;
};
