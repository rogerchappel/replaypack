# ReplayPack safety guide

ReplayPack records what your command prints. That is useful, but it also means bad commands produce bad evidence.

## Before recording

Ask:

- Could this command print tokens, cookies, API keys, or private data?
- Are all fixture files safe to hash and commit by path?
- Should any environment value be redacted?

## Safer recording pattern

```bash
replaypack record \
  --name safe-smoke \
  --fixture tests/fixtures/input.txt \
  --redact-env API_TOKEN \
  -- node scripts/smoke.js
```

## Review checklist

- Open the JSONL file and search for `token`, `secret`, `password`, `key`.
- Confirm `env` contains only explicit safe allowlist values.
- Confirm fixture paths are relative and expected.
- Run `replaypack verify <pack>` before committing.

## Important limitation

ReplayPack is not a sandbox or policy engine. It does not stop a command from mutating your machine; it only records the command you chose to run.
