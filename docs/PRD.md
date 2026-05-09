# ReplayPack PRD

Status: in-progress

## One-liner

Deterministic CLI transcript packs.

## Summary

A small CLI that records command, stdin/stdout/stderr, exit code, timing, and fixture hashes into a portable pack that can be replayed or verified later.

## Problem

README examples and agent handoffs rot because nobody can prove the command transcript still matches fixtures. Developers need a tiny local pack format for reproducible CLI evidence.

## Target users

CLI maintainers, docs authors, release engineers, agentic workflows that need proof of local smokes.

## V1 scope

- Record commands into JSONL transcript packs with redaction rules
- Verify a pack against current fixtures and expected output matchers
- Render Markdown snippets for READMEs and release notes
- Support deterministic fixture hashing and env allowlists
- Provide an example pack and smoke script

## CLI shape

```bash
replaypack record --name basic -- npm test
replaypack verify examples/basic.replaypack.jsonl
replaypack render examples/basic.replaypack.jsonl --format markdown
```

## Non-goals

- No SaaS backend.
- No hidden telemetry.
- No external posting or mutation by default.
- No secret collection beyond explicit, redacted local inputs.

## Differentiation

It is not a terminal movie recorder; it is proof-oriented, diffable, and designed for local CI/agent verification.

## Safety and privacy

- Local-first by default.
- Explicit opt-in for any external command preview/execution.
- Fixture-backed tests for parsing, reporting, and redaction behavior.
- Clear failure modes and deterministic output suitable for CI.

## Acceptance criteria

- TypeScript CLI scaffolded with StackForge under `/Users/roger/Developer/my-opensource/replaypack`.
- `docs/PRD.md`, `docs/TASKS.md`, `docs/ORCHESTRATION.md`, and `docs/orchestration.json` exist.
- Functional MVP with fixtures and tests.
- `npm test`, `npm run check`, `npm run build`, `npm run smoke`, and `bash scripts/validate.sh` pass where present.
- Public GitHub repository `rogerchappel/replaypack` exists with useful description and topics.
- Branch protection attempted for `main`.

## Source attribution

Original idea from OSS Factory verification needs and fixture-backed README smoke patterns. No external implementation copied.
