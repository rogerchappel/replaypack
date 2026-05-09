export class ReplaypackError extends Error {
  constructor(message: string, readonly code = 'REPLAYPACK_ERROR') {
    super(message);
    this.name = 'ReplaypackError';
  }
}

export function assert(condition: unknown, message: string, code?: string): asserts condition {
  if (!condition) {
    throw new ReplaypackError(message, code);
  }
}
