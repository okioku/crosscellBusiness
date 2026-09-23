# Development Setup

## Prerequisites

- Git
- Node.js 22 LTS or the version later pinned in `.nvmrc`
- AWS CLI v2
- An AWS account with permission to deploy the prototype
- Access to `https://github.com/okioku/crosscellBusiness`
- Docker Desktop only if local PostgreSQL is introduced

Use short-lived AWS credentials. Prefer IAM Identity Center for local work and GitHub OIDC for CI/CD. Do not create long-lived access keys for GitHub Actions.

## Clone and select the AWS branch

```powershell
git clone https://github.com/okioku/crosscellBusiness.git
Set-Location crosscellBusiness
git switch codex/aws-prototype
```

## Run the current static mock

```powershell
node tools/serve.mjs
```

Open `http://127.0.0.1:4173`.

## Configure the local AWS profile

Recommended profile name:

```text
ring-dev
```

For IAM Identity Center:

```powershell
aws configure sso --profile ring-dev
aws sso login --profile ring-dev
$env:AWS_PROFILE = "ring-dev"
$env:AWS_REGION = "ap-northeast-1"
aws sts get-caller-identity
```

Record the AWS account ID in a private team channel or password manager, not in this repository.

## AWS prerequisites

Before the first deployment:

- Enable Amazon Bedrock model access required for Nova 2 Lite.
- Verify the Japan inference profile `jp.amazon.nova-2-lite-v1:0`.
- Install the AWS Amplify GitHub App for only this repository.
- Create the GitHub OIDC provider and a branch-scoped deployment role.
- Set an AWS Budget alert.
- Obtain a Hot Pepper API key if live restaurant search is required.
- Use `MockJalanProvider` unless an approved Jalan credential is available.

## Environment variables

Copy `.env.example` to a local `.env` only after the application scaffold exists. Never commit `.env`.

Frontend values prefixed with `VITE_` are visible to browsers and must not contain secrets. Provider API keys belong in AWS Secrets Manager or SSM Parameter Store for deployed environments.

## Expected commands after scaffolding

The implementation should expose these stable commands from the repository root:

```powershell
npm install
npm run dev
npm run test
npm run lint
npm run db:migrate
npm run db:seed
npm run cdk:diff
npm run deploy:dev
```

Do not document commands as complete until they actually exist and pass on a clean clone.
