# Video Brief: README Evidence Pack

## Hook

Show how `replaypack` records a tiny command transcript, verifies fixture hashes, and renders Markdown that can be pasted into release notes or handoff docs.

## Demo Beat Sheet

1. Build with `npm run build`.
2. Run `bash examples/release-note-demo.sh`.
3. Show that the pack records the command, fixture hash, stream chunks, exit status, and matchers.
4. Verify the generated pack.
5. Render Markdown and point out that the source fixture is hashed.

## Claims to Keep Grounded

- ReplayPack records deterministic JSONL transcript packs.
- It supports fixture hashing and later verification.
- The Markdown render path is designed for README, release note, and handoff evidence.
- Environment capture is explicit through allowlisted env names.

## Avoid Saying

- Do not claim it is a full terminal recorder.
- Do not record or display real secrets in a public demo.

## Verification to Mention

```sh
npm run build
bash examples/release-note-demo.sh
```

