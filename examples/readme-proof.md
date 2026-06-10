# README Proof Example

Use this example when you need a compact demonstration that ReplayPack can produce a reusable evidence snippet from a local command.

## Command

```sh
npm run build
mkdir -p .tmp-readme-proof
node dist/cli.js record --name readme-proof --output .tmp-readme-proof/readme-proof.replaypack.jsonl --fixture tests/fixtures/input.txt -- node tests/fixtures/hello.js
node dist/cli.js verify .tmp-readme-proof/readme-proof.replaypack.jsonl --rerun
node dist/cli.js render .tmp-readme-proof/readme-proof.replaypack.jsonl --format markdown
```

## Expected evidence shape

The rendered Markdown includes:

- `ReplayPack: readme-proof`
- the recorded command, `node tests/fixtures/hello.js`
- a passed result line
- stdout containing `hello replaypack`
- stderr containing `fixture stderr line`
- a sha256 hash for `tests/fixtures/input.txt`

## Why this is useful

This gives maintainers a small proof artifact for README examples, release notes, and local smoke-test handoffs without publishing terminal recordings or sending data to a hosted service.
