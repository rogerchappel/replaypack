# ReplayPack orchestration notes

ReplayPack is intentionally small enough for one agent or maintainer to run locally.

## Normal local loop

1. Change source/tests/docs.
2. Run `npm run check`.
3. Run `npm test`.
4. Run `npm run smoke`.
5. Refresh example packs only when the user-facing transcript changes.
6. Run `bash scripts/validate.sh` before publishing.

## Agent safety rules

- Do not record commands that print secrets unless matching `--redact-env` rules are supplied first.
- Keep packs diffable: JSONL only, deterministic header timestamp, sorted fixture hashes.
- Treat fixture mismatches as release blockers unless the fixture was intentionally updated.
- Do not post or upload packs automatically; this tool is local-first.

## Publishing sequence

- Push meaningful commits to `main` after local verification.
- Create the GitHub repository explicitly; StackForge does not do this implicitly.
- Apply branch protection when repository permissions allow it.
