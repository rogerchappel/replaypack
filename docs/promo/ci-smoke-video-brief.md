# ReplayPack CI Smoke Video Brief

## Promise

Show how ReplayPack turns a tiny command smoke into reviewable evidence: JSONL pack, fixture hash, verification result, rerun check, and Markdown snippet.

## Demo source

- Script: `examples/ci-smoke-demo.sh`
- Fixture: `tests/fixtures/input.txt`
- Command: `node tests/fixtures/hello.js`
- Outputs: temporary JSONL pack, verification JSON, rerun verification JSON, and rendered Markdown

## Shot list

1. Run `bash examples/ci-smoke-demo.sh`.
2. Open the generated pack and point at the `header`, `stream`, and `result` event types.
3. Open `verify.json` and show `"ok": true`.
4. Open `verify-rerun.json` to show that the recorded command can be checked again.
5. Open the rendered Markdown and explain how it can be pasted into a release note or PR summary.

## Constraints

Do not claim ReplayPack replaces a test runner. The grounded claim is narrower: it captures reproducible command evidence with explicit fixtures and review-friendly rendering.
