# Prompt for the next AI agent

Paste the following into the AI agent on the new computer after cloning the repository.

```text
You are taking over the Ring Cross-sell Travel Concierge project.

Repository: https://github.com/okioku/crosscellBusiness
Working branch: codex/aws-prototype

First, read AGENTS.md and every document linked from its "Read first" section. Then inspect the repository and git status before changing anything.

The current application is a static mock. The target is a low-cost AWS prototype using Amplify Hosting, API Gateway HTTP API, Lambda/TypeScript, Amazon Bedrock Nova 2 Lite, Aurora PostgreSQL Serverless v2 with Data API, Cognito, CDK/TypeScript, and GitHub Actions OIDC.

Important constraints:
- Preserve the existing visible mock behavior.
- Do not delete or disable the Azure workflow or Azure resources.
- PostgreSQL is the source of truth.
- Do not allow arbitrary LLM-generated SQL.
- Do not invent facilities, inventory, prices, or reservation references.
- Use MockJalanProvider and MockBookingProvider unless approved credentials are supplied.
- Do not commit any credentials or API keys.
- Keep the AWS design serverless and avoid a NAT Gateway.

Start with the first implementation milestone from docs/handoff.md: create the TypeScript workspace structure and database migration/seed foundation while keeping the existing UI working. Implement, test, update the documentation with actual commands, and report any blocker that requires AWS account access or private credentials.
```
