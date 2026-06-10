# Video Brief: Proof-Oriented README Examples

## Angle

Show how ReplayPack records a local CLI command once, verifies the evidence, and renders a Markdown receipt that can be pasted into docs or release notes.

## Demo flow

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

## What to say

- "ReplayPack is for deterministic CLI transcript packs, not polished terminal video."
- "The JSONL pack is diffable and can be checked into examples or attached to an agent handoff."
- "Fixture hashing helps catch the hidden file changes behind a passing-looking demo."

## Verification to show

```sh
npm test
npm run smoke
```
