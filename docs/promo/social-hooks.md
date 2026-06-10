# Social Hooks

Short, grounded post drafts for ReplayPack.

## Hook pack

1. README examples drift. ReplayPack records a local command transcript, fixture hashes, exit status, and matchers into a diffable JSONL pack so examples can carry their own receipt.

2. No terminal cinema, no SaaS, no telemetry. ReplayPack is a local-first CLI for proof-oriented smoke commands.

3. A tiny release-note workflow: record a command, verify the JSONL pack, then render Markdown evidence with stdout, stderr, exit result, and fixture hashes.

4. Agent handoffs get more useful when they include a reproducible receipt. ReplayPack turns "I ran this" into a JSONL artifact that can be verified later.

5. Demo idea: run `node tests/fixtures/hello.js`, track `tests/fixtures/input.txt`, and render the result into a README-ready Markdown snippet.

## Suggested CTA

Try the local quickstart:

```sh
npm install
npm run build
node dist/cli.js verify examples/basic.replaypack.jsonl
node dist/cli.js render examples/basic.replaypack.jsonl --format markdown
```
