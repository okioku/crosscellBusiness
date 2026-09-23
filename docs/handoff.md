# Project Handoff

Last updated: 2026-09-23

## Objective

Turn the existing visual mock into a realistic AWS prototype that queries normalized Jalan and Hot Pepper data, calculates a feasible itinerary, and confirms a mock reservation.

## Repository and deployments

- Repository: `https://github.com/okioku/crosscellBusiness`
- AWS development branch: `codex/aws-prototype`
- Existing Azure site: `https://orange-hill-077b6aa00.7.azurestaticapps.net`
- Existing Azure workflow: `.github/workflows/azure-static-web-apps-orange-hill-077b6aa00.yml`

The Azure site is the fallback during migration. Do not delete or disable it until the AWS deployment is accepted.

## Completed

- Static AI Concierge chat UI.
- Representative Hakone conversation flow.
- Hot Pepper and official Jalan logo presentation.
- GitHub repository and Azure Static Web Apps deployment.
- AWS target architecture decision.
- Relational data-model decision.
- GitHub-based deployment and handoff strategy.
- Architecture, data-model, API-contract, setup, and deployment documentation.

## Not implemented

- AWS Amplify app.
- CDK project and GitHub OIDC role.
- API Gateway and Lambda backend.
- Cognito authentication.
- Aurora PostgreSQL and migrations.
- Bedrock integration.
- Hot Pepper API synchronization.
- Jalan provider or mock normalized dataset.
- Transactional proposal and reservation flow.
- Automated tests and cost alarms.

## Confirmed decisions

- Use PostgreSQL rather than DynamoDB because cross-service joins, inventory, pricing, and reservation consistency are core to the prototype.
- Use Aurora Serverless v2 with auto-pause to limit idle cost.
- Use the Data API to avoid persistent database connections and a NAT Gateway.
- Use Bedrock Nova 2 Lite for structured extraction and response writing.
- Do not use arbitrary text-to-SQL.
- Use mock booking until approved booking interfaces exist.
- Use `MockJalanProvider` by default because new public Jalan API account registration is unavailable.

## Recommended implementation order

1. Restructure the repository into `frontend`, `backend`, `infra`, and `db` without changing visible behavior.
2. Add TypeScript workspace configuration, tests, lint, and stable root commands.
3. Implement PostgreSQL migrations and deterministic Hakone seed data.
4. Implement provider interfaces and mock providers.
5. Implement search and ranking with local/integration tests.
6. Implement proposal persistence and idempotent mock confirmation.
7. Add Bedrock structured extraction and verified response generation.
8. Add CDK for Aurora, API Gateway, Lambda, Cognito, and budgets.
9. Configure GitHub OIDC and Amplify GitHub App.
10. Deploy, smoke-test, document actual resource names, and cut over after approval.

## First vertical slice

The first deployed slice should support only this deterministic case:

```text
12月の土日に、僕・妻・息子（3歳）で、1泊2日の箱根旅行。
予算5万円で宿、ランチ、ディナーを提案してほしい。
```

Expected behavior:

- At least one available accommodation plan is read from PostgreSQL.
- At least one available restaurant slot is read from PostgreSQL.
- The plan is below JPY 50,000.
- The response displays an auditable price breakdown.
- Confirmation creates one reservation and is idempotent on retry.
- The reservation clearly says it is a mock.

## Open decisions

Resolve these during implementation and record the outcome:

- Whether the frontend remains vanilla JavaScript or moves to Vite/React.
- Whether the AWS account is personal prototype infrastructure or a company-managed account.
- Whether an approved existing Jalan API credential or internal interface is available.
- Whether Cognito should allow all invited emails or restrict a company domain.
- Whether email confirmation uses SES sandbox or remains UI-only.

None of these decisions should block the local database and search vertical slice.

## Required private inputs

These must be provided outside GitHub:

- AWS account access and deployment role approval.
- Hot Pepper API key, if live data is enabled.
- Approved Jalan credential, if available.
- Test-user email addresses.

## Acceptance checklist

- Fresh clone setup instructions are accurate.
- No credentials exist in Git history.
- `npm run test` and `npm run lint` pass.
- Database migrations and seeds run repeatedly without corruption.
- Search results come from table rows, not model-generated facts.
- Duplicate confirmations do not duplicate reservations.
- The AWS deployment is reproducible from GitHub.
- A budget alert and log-retention policy are enabled.
