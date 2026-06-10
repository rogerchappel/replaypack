# Video Brief: README Evidence Pack

## Hook

Show how ReplayPack records a local CLI command once, verifies the evidence, and renders a Markdown receipt that can be pasted into docs or release notes.

## Demo Flow

1. Start with the existing fixture-backed command:

   ```sh
   node tests/fixtures/hello.js
   ```

2. Build the CLI and record a pack:

   ```sh
   npm run build
   node dist/cli.js record --name demo --output .tmp-demo/demo.replaypack.jsonl --fixture tests/fixtures/input.txt -- node tests/fixtures/hello.js
   ```

3. Verify the saved pack:

   ```sh
   node dist/cli.js verify .tmp-demo/demo.replaypack.jsonl
   node dist/cli.js verify .tmp-demo/demo.replaypack.jsonl --rerun
   ```

4. Render Markdown:

   ```sh
   node dist/cli.js render .tmp-demo/demo.replaypack.jsonl --format markdown
   ```

5. Point out stdout, stderr, result status, and the fixture hash.

## Release-Note Demo Beat Sheet

1. Build with `npm run build`.
2. Run `bash examples/release-note-demo.sh`.
3. Show that the pack records the command, fixture hash, stream chunks, exit status, and matchers.
4. Verify the generated pack.
5. Render Markdown and point out that the source fixture is hashed.

## What to say

- "ReplayPack is for deterministic CLI transcript packs, not polished terminal video."
- "The JSONL pack is diffable and can be checked into examples or attached to an agent handoff."
- "Fixture hashing helps catch the hidden file changes behind a passing-looking demo."

## Claims to Keep Grounded

- ReplayPack records deterministic JSONL transcript packs.
- It supports fixture hashing and later verification.
- The Markdown render path is designed for README, release note, and handoff evidence.
- Environment capture is explicit through allowlisted env names.

## Avoid Saying

- Do not claim it is a full terminal recorder.
- Do not record or display real secrets in a public demo.

## Verification to show

```sh
npm test
npm run smoke
```
