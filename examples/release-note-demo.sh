#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="${TMPDIR:-/tmp}/replaypack-release-note-demo"
PACK_FILE="$OUT_DIR/release-note.replaypack.jsonl"

rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"

node "$ROOT_DIR/dist/cli.js" record \
  --name release-note \
  --output "$PACK_FILE" \
  --fixture "$ROOT_DIR/examples/release-note-demo/release-note.md" \
  -- node "$ROOT_DIR/examples/release-note-demo/print-note.js"

node "$ROOT_DIR/dist/cli.js" verify "$PACK_FILE"
node "$ROOT_DIR/dist/cli.js" render "$PACK_FILE" --format markdown

