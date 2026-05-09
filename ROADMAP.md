# Roadmap

## v0.1 MVP

- Deterministic JSONL transcript packs.
- Command recording with stdout/stderr chunks.
- Fixture sha256 hashing.
- Exact output and exit-code verification.
- Markdown rendering for docs and release notes.
- Local smoke script and fixture-backed tests.

## v0.2 Candidate

- Glob support for fixture sets.
- CLI flags for `contains` and `regex` matchers.
- Human-readable diff output for verification failures.
- More renderer templates.

## Later

- CI reporter outputs such as JUnit or SARIF.
- Pack schema export with JSON Schema.
- Optional stdin capture from files.
- Signed packs if maintainers need provenance guarantees.
