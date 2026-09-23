# AGENTS.md

## Project mission

Build a realistic, low-cost AWS prototype for a one-stop travel concierge that combines Jalan accommodation data and Hot Pepper Gourmet restaurant data.

The representative scenario is:

- A couple and their 3-year-old child travel to Hakone for one night on a December weekend.
- The total budget is JPY 50,000.
- The service proposes an available accommodation, lunch, and dinner arrangement.
- The user confirms the proposal and receives a mock reservation confirmation.

## Read first

Before changing code, read these documents in order:

1. `docs/handoff.md`
2. `docs/architecture.md`
3. `docs/data-model.md`
4. `docs/api-contract.md`
5. `docs/setup.md`
6. `docs/deployment.md`
7. `docs/references.md`

## Current state

- The repository contains a working static HTML/CSS/JavaScript mock.
- The static mock is deployed to Azure Static Web Apps from `main`.
- The AWS implementation has not been scaffolded yet.
- Work on the AWS version belongs on `codex/aws-prototype` until cutover.
- Do not delete the Azure workflow or Azure resources before the AWS version is verified.

## Architecture decisions

- Region: `ap-northeast-1` (Tokyo).
- Frontend hosting: AWS Amplify Hosting connected to GitHub.
- Backend: API Gateway HTTP API and Lambda using TypeScript.
- Database: Aurora PostgreSQL Serverless v2, minimum 0 ACU, Data API enabled.
- Generative AI: Amazon Bedrock Converse API with `jp.amazon.nova-2-lite-v1:0`.
- Authentication: Amazon Cognito.
- Infrastructure as code: AWS CDK with TypeScript.
- CI/CD: Amplify GitHub App for frontend; GitHub Actions with AWS OIDC for infrastructure and backend.

## Non-negotiable behavioral rules

- PostgreSQL is the source of truth for facilities, inventory, prices, proposals, and reservations.
- The model must not invent facilities, prices, inventory, or reservation numbers.
- The model extracts structured travel constraints and explains verified results.
- Lambda executes parameterized, allow-listed queries. Do not allow arbitrary model-generated SQL.
- Search results must include source identifiers and a price breakdown.
- Reservation commands must be idempotent.
- Until an approved booking API exists, reservations must be clearly marked `MOCK_CONFIRMED`.
- Never commit API keys, AWS credentials, database passwords, or customer information.

## Data-provider boundary

Implement providers behind interfaces:

- `HotPepperProvider`: public Hot Pepper Gourmet API.
- `JalanProvider`: approved Jalan API or internal interface when credentials are available.
- `MockJalanProvider`: deterministic seed data used by default.
- `MockBookingProvider`: mock reservation completion used by default.

The public Jalan service stopped accepting new account registrations in 2020. Do not block the prototype on obtaining a new public Jalan API account.

## Cost guardrails

- Do not add a NAT Gateway for the prototype.
- Do not add ECS, EKS, OpenSearch, Bedrock Knowledge Bases, or provisioned database instances without an explicit requirement.
- Keep Aurora maximum capacity at 2 ACUs initially and enable auto-pause.
- Use HTTP API rather than API Gateway REST API unless a missing feature requires REST API.
- Set CloudWatch log retention explicitly; do not keep verbose logs indefinitely.
- Add an AWS Budget before enabling shared access.

## Definition of done for the AWS prototype

- A user can submit the representative Hakone request.
- The backend queries accommodation and restaurant tables and returns a plan under budget.
- The response displays the selected records and price calculation.
- A second message confirms a mock reservation using an idempotency key.
- The application is deployed through GitHub to AWS.
- A clean clone on another computer can run tests and deploy by following the documentation.
