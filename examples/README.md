# ReplayPack examples

- `basic.replaypack.jsonl` records `node tests/fixtures/hello.js` with a fixture hash.
- `basic.md` is the rendered Markdown snippet for README/release-note reuse.

Refresh with:

```bash
npm run build
node dist/cli.js record --name basic --output examples/basic.replaypack.jsonl --fixture tests/fixtures/input.txt -- node tests/fixtures/hello.js
node dist/cli.js render examples/basic.replaypack.jsonl --format markdown > examples/basic.md
```

## CI smoke evidence demo

Run a temporary proof-style smoke without modifying checked-in examples:

```bash
npm run build
bash examples/ci-smoke-demo.sh
```

The script records `node tests/fixtures/hello.js`, hashes `tests/fixtures/input.txt`, verifies the pack, verifies it again with `--rerun`, and renders Markdown for review.
