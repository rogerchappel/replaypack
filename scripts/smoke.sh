#!/usr/bin/env bash
set -euo pipefail

rm -rf .tmp-smoke
mkdir -p .tmp-smoke

node dist/cli.js record --name smoke --output .tmp-smoke/smoke.replaypack.jsonl --fixture tests/fixtures/input.txt -- node tests/fixtures/hello.js
node dist/cli.js verify .tmp-smoke/smoke.replaypack.jsonl
node dist/cli.js verify .tmp-smoke/smoke.replaypack.jsonl --rerun
node dist/cli.js render .tmp-smoke/smoke.replaypack.jsonl --format markdown > .tmp-smoke/smoke.md

grep -q 'ReplayPack: smoke' .tmp-smoke/smoke.md
grep -q 'hello replaypack' .tmp-smoke/smoke.md
