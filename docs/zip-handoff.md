# ZIP Handoff

## What the ZIP contains

The handoff ZIP is created from the tracked contents of the `codex/aws-prototype` branch using `git archive`.

It includes:

- the working static mock;
- official project assets tracked in Git;
- AWS architecture and data-model documentation;
- API contract, setup, deployment, and AI-agent instructions;
- `.env.example` with empty placeholders.

It excludes:

- `.git` history and GitHub credentials;
- `.env` and local secrets;
- untracked files;
- build output, logs, and dependency folders;
- AWS or provider credentials.

## Verify the received file

The sender should provide a SHA-256 hash alongside the ZIP. On Windows, run:

```powershell
Get-FileHash -Algorithm SHA256 .\ring-crosscell-aws-prototype-*.zip
```

Compare the result with the sender's value before extraction.

## Extract and run

```powershell
Expand-Archive .\ring-crosscell-aws-prototype-*.zip -DestinationPath C:\dev\ring-crosscell
Set-Location C:\dev\ring-crosscell
node tools/serve.mjs
```

Open `http://127.0.0.1:4173`, confirm the current mock, then give `docs/agent-start-prompt.md` to the new AI agent.

## Continuing with Git later

The safest approach is to clone the GitHub repository and transfer only reviewed changes from the ZIP workspace into that clone.

If Git must be initialized directly in the extracted folder, confirm the repository and target branch first. Do not push directly to `main`; use an approved development branch and review the diff before the first push.

## Recreate the ZIP from Git

From a clean checkout of the handoff branch:

```powershell
git archive --format=zip --output ring-crosscell-aws-prototype.zip codex/aws-prototype
Get-FileHash -Algorithm SHA256 .\ring-crosscell-aws-prototype.zip
```
