# Verify a README Example

This tutorial shows how to turn one command into a ReplayPack evidence file, verify it, and render a Markdown snippet for README or release-note reuse.

## Starting point

ReplayPack records:

- the command that ran
- ordered stdout and stderr chunks
- exit status and duration
- fixture hashes for files you choose to track
- matchers used for later verification

The repository already includes a tiny fixture-backed command:

```sh
node tests/fixtures/hello.js
```

It prints `hello replaypack` on stdout and `fixture stderr line` on stderr.

## Record the command

```sh
npm run build
mkdir -p .tmp-readme-demo
node dist/cli.js record \
  --name readme-demo \
  --output .tmp-readme-demo/readme-demo.replaypack.jsonl \
  --fixture tests/fixtures/input.txt \
  -- node tests/fixtures/hello.js
```

The `--fixture` flag stores a deterministic hash for `tests/fixtures/input.txt`, so later verification can detect fixture drift.

## Verify the pack

```sh
node dist/cli.js verify .tmp-readme-demo/readme-demo.replaypack.jsonl
```

To rerun the recorded command and compare the fresh result with the stored matchers:

```sh
node dist/cli.js verify .tmp-readme-demo/readme-demo.replaypack.jsonl --rerun
```

## Render Markdown evidence

```sh
node dist/cli.js render .tmp-readme-demo/readme-demo.replaypack.jsonl --format markdown
```

The rendered snippet includes the command, pass/fail result, stdout, stderr, and tracked fixture hash. That makes it useful in README demos, changelog notes, and agent handoffs where the reader needs a compact local receipt.

## Clean up

```sh
rm -rf .tmp-readme-demo
```

## Smallest verification

The repository smoke script runs the same record, verify, rerun, and render loop against a temporary pack:

```sh
npm run smoke
```
