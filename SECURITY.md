# Security Policy

ReplayPack is local-first tooling for command transcript evidence. Its main risks are accidental secret capture and misleading verification artifacts.

## Supported versions

Security fixes target the latest `main` branch until formal releases begin.

## Reporting a vulnerability

Please open a private report with the maintainer or contact Roger Chappel before publishing details. Include:

- affected command or pack behavior
- minimal reproduction steps
- whether secret exposure is involved
- suggested fix if known

## Privacy and secret handling

ReplayPack does **not** send packs anywhere. Still, packs can contain stdout/stderr from your commands, so treat them as sensitive until reviewed.

Use:

```bash
replaypack record --name safe --redact-env API_TOKEN -- your-command
```

Guidelines:

- Avoid recording commands that print credentials, cookies, tokens, or customer data.
- Use `--env` only for values that are safe to disclose in local evidence.
- Use `--redact-env` for any secret-like value that could appear in output.
- Review generated `.replaypack.jsonl` files before committing them.

## Non-goals

ReplayPack is not a sandbox. It records commands you choose to run; it does not make unsafe commands safe.
