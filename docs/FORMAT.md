# ReplayPack JSONL format v1

A `.replaypack.jsonl` file is newline-delimited JSON. Each line is one event.

## Event order

1. `header` — exactly one, first line.
2. `stream` — zero or more ordered stdout/stderr chunks.
3. `result` — exactly one, last line.

## Header

The header stores deterministic metadata:

- `version`: currently `1`.
- `name`: human-friendly pack name.
- `createdAt`: fixed to Unix epoch for MVP deterministic diffs.
- `cwd`: currently `.` to avoid leaking local absolute paths.
- `command`: argv array.
- `env`: explicit allowlist only.
- `fixtures`: sorted sha256 file hashes.
- `redactions`: names of rules applied during recording.

## Result

The result stores exit status and final output. V1 records exact stdout/stderr matchers. Future versions may let the CLI write `contains` or `regex` matchers directly.
