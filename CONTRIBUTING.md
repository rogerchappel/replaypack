# Contributing to ReplayPack

Thanks for helping make CLI evidence less hand-wavy.

## Local setup

```bash
npm install
npm run build
npm test
npm run smoke
```

## Development rules

- Keep the pack format deterministic and diffable.
- Prefer small, boring JSONL events over clever binary formats.
- Add fixture-backed tests for parser, verifier, renderer, and redaction changes.
- Do not add network calls to record/verify/render paths.
- Do not broaden environment capture; explicit allowlists only.

## Before sending changes

Run:

```bash
npm test
npm run check
npm run build
npm run smoke
bash scripts/validate.sh
```

If examples change intentionally, refresh `examples/basic.replaypack.jsonl` and `examples/basic.md` in the same commit.

## Commit style

Use short conventional-ish subjects such as:

- `feat: add fixture globbing`
- `test: cover regex matchers`
- `docs: explain pack format`

## Security-sensitive changes

Anything that affects redaction, env capture, command execution, or pack rendering should be reviewed with extra care. See `SECURITY.md`.
