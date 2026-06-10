# Launch Note Draft

`replaypack` records small CLI transcript packs for proof-oriented local smokes, README examples, release notes, and agent handoffs.

The current demo records a release-note preview command, hashes the source fixture, verifies the generated pack, and renders Markdown evidence.

## What to Show

- `npm run build`
- `bash examples/release-note-demo.sh`
- The generated JSONL pack path.
- The verification result and Markdown render.

## Limits

- ReplayPack is not terminal cinema or broad session recording.
- Public packs should not capture secrets.
- Environment capture is explicit through allowlisted env names.

