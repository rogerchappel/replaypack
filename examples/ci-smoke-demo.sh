#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="${TMPDIR:-/tmp}/replaypack-ci-smoke-demo"
PACK="$OUT_DIR/ci-smoke.replaypack.jsonl"
MARKDOWN="$OUT_DIR/ci-smoke.md"

rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"
cd "$ROOT_DIR"

npm run build
node dist/cli.js record \
  --name ci-smoke \
  --output "$PACK" \
  --fixture tests/fixtures/input.txt \
  -- node tests/fixtures/hello.js

node dist/cli.js verify "$PACK" > "$OUT_DIR/verify.json"
node dist/cli.js verify "$PACK" --rerun > "$OUT_DIR/verify-rerun.json"
node dist/cli.js render "$PACK" --format markdown > "$MARKDOWN"

test -s "$PACK"
test -s "$MARKDOWN"
grep -q '"ok": true' "$OUT_DIR/verify.json"
grep -q '"ok": true' "$OUT_DIR/verify-rerun.json"
grep -qi "hello" "$MARKDOWN"

echo "Pack: $PACK"
echo "Verification: $OUT_DIR/verify.json"
echo "Rerun verification: $OUT_DIR/verify-rerun.json"
echo "Markdown: $MARKDOWN"
