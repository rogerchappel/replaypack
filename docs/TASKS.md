# ReplayPack TASKS

## MVP build checklist

- [x] Scaffold an OSS TypeScript CLI with StackForge.
- [x] Define the JSONL pack event model: header, stream events, result.
- [x] Record local command stdout/stderr, exit code, timing, env allowlist, redaction names, and fixture hashes.
- [x] Verify fixture hashes and exact output/exit-code matchers.
- [x] Render README-friendly Markdown snippets.
- [x] Add fixture-backed unit and workflow tests.
- [x] Add a real CLI smoke script.
- [x] Add examples and generated evidence.
- [x] Document safety, privacy, contribution, and release paths.

## Near-term follow-ups

- [ ] Add glob support for fixture discovery.
- [ ] Add richer matcher editing (`contains`/`regex`) from CLI flags.
- [ ] Add SARIF/JUnit output for CI integrations.
- [ ] Publish package once the public repo has normal release cadence.
