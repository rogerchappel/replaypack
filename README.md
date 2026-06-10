# ReplayPack

Deterministic CLI transcript packs for proof-oriented local smokes.

ReplayPack is a tiny local-first CLI for people who need README examples, release notes, and agent handoffs to stay honest. It records a command transcript, fixture hashes, exit status, and matchers into a diffable JSONL pack, then verifies or renders that evidence later.

No terminal cinema. No SaaS. No telemetry. Just reproducible receipts.

## Install

```bash
npm install
npm run build
```

For local development you can run the CLI with `node dist/cli.js`. Once published, the binary is `replaypack`.

## Quick start

```bash
npm run build
node dist/cli.js record --name basic --output examples/basic.replaypack.jsonl --fixture tests/fixtures/input.txt -- node tests/fixtures/hello.js
node dist/cli.js verify examples/basic.replaypack.jsonl
node dist/cli.js render examples/basic.replaypack.jsonl --format markdown
```

The pack is JSONL:

- `header` records pack metadata, command, env allowlist, redaction names, and fixture hashes.
- `stream` records ordered stdout/stderr chunks.
- `result` records exit code, signal, duration, final stdout/stderr, and matchers.

## CLI

### Record

```bash
replaypack record --name basic -- npm test
```

Useful flags:

- `--output <path>`: write somewhere other than `examples/<name>.replaypack.jsonl`.
- `--fixture <path>`: hash a fixture file; repeatable.
- `--env <name>`: allowlist one env var into the pack header; repeatable.
- `--redact-env <name>`: redact that environment variable's value from captured streams.

### Verify

```bash
replaypack verify examples/basic.replaypack.jsonl
replaypack verify examples/basic.replaypack.jsonl --rerun
```

Default verification checks pack structure, fixture hashes, and stored matchers. `--rerun` executes the recorded command again and compares fresh output/exit status with the stored matchers.

### Render

```bash
replaypack render examples/basic.replaypack.jsonl --format markdown
```

Markdown output is designed for READMEs, release notes, and agent handoffs.

## Example evidence

See [`examples/basic.replaypack.jsonl`](examples/basic.replaypack.jsonl) and [`examples/basic.md`](examples/basic.md).

For a step-by-step walkthrough, see [`docs/tutorials/verify-readme-example.md`](docs/tutorials/verify-readme-example.md). For a shorter demo script outline, see [`examples/readme-proof.md`](examples/readme-proof.md).

## Runnable demo

Build the CLI and run the release-note evidence demo:

```bash
npm run build
bash examples/release-note-demo.sh
```

The script records a small command, hashes `examples/release-note-demo/release-note.md`, verifies the generated pack, and renders Markdown for review.

## Safety model

ReplayPack is local-first by default:

- no hidden network calls
- no telemetry
- no broad environment capture
- explicit env allowlists only
- redaction support for common secrets and named env values
- deterministic fixture hashes for CI-friendly diffs

Do not record commands that print secrets unless you have added suitable redaction rules first.

## Development

```bash
npm test
npm run check
npm run build
npm run smoke
bash scripts/validate.sh
```

## Status

MVP: usable and intentionally small. Next up: glob fixtures, CLI-configurable non-exact matchers, and CI reporter formats.
