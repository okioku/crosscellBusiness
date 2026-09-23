# Deployment and GitHub Integration

## Deployment ownership

- GitHub is the source of truth.
- Amplify deploys the frontend through the Amplify GitHub App.
- GitHub Actions deploys CDK infrastructure and backend code using AWS OIDC.
- No long-lived AWS access key is stored in GitHub.

## Branch strategy

During migration:

- `main`: existing stable mock and Azure deployment.
- `codex/aws-prototype`: AWS implementation and initial Amplify connection.
- Pull requests: tests, lint, and `cdk diff` only.

After AWS acceptance, merge to `main`, point Amplify production at `main`, and then retire the Azure deployment.

## Amplify Hosting

1. Open AWS Amplify in `ap-northeast-1`.
2. Choose **New app** and **Host web app**.
3. Select GitHub.
4. Install the regional AWS Amplify GitHub App.
5. Grant it access only to `okioku/crosscellBusiness`.
6. Select `codex/aws-prototype` during migration.
7. Set the frontend root and build output after the frontend scaffold is created.
8. Do not place backend secrets in Amplify environment variables.

The current static site can initially deploy without a build step. If it is migrated to Vite, use the generated build command and `dist` output directory.

## GitHub Actions to AWS OIDC

Create an IAM OIDC provider with:

```text
Provider URL: https://token.actions.githubusercontent.com
Audience: sts.amazonaws.com
```

Create a deployment role whose trust policy is restricted to:

```text
repo:okioku/crosscellBusiness:ref:refs/heads/codex/aws-prototype
```

When production moves to `main`, add or replace the allowed subject deliberately. Do not use an unrestricted repository wildcard.

The workflow requires:

```yaml
permissions:
  id-token: write
  contents: read
```

Store only the deployment role ARN and non-secret configuration in GitHub variables. Use `aws-actions/configure-aws-credentials` to obtain temporary credentials.

## Proposed pipeline

### Pull request

1. Install dependencies with a locked dependency file.
2. Run formatting, lint, unit tests, and schema validation.
3. Synthesize CDK.
4. Run `cdk diff` without mutating shared resources.

### Push to the deployment branch

1. Run all pull-request checks.
2. Assume the AWS deployment role through OIDC.
3. Deploy CDK stacks.
4. Run database migrations as a controlled deployment step.
5. Run a smoke test against `/health` and the representative Hakone flow.
6. Amplify deploys the frontend from the same commit.

## Secrets

Expected secrets include provider API keys and the database credential managed for the Data API. Store deployed secrets in AWS Secrets Manager or SSM Parameter Store. Never expose them as `VITE_` variables.

## Cutover from Azure

Do not remove Azure first.

1. Deploy the AWS application.
2. Verify authentication, search, proposal, and confirmation.
3. Share the Amplify URL with test members.
4. Monitor errors and spend for several days.
5. Merge the AWS branch to `main`.
6. Disable the Azure GitHub Actions workflow.
7. Archive or remove Azure resources only after explicit approval.

Rollback is to re-enable or continue using the existing Azure Static Web Apps URL while the AWS stack is repaired.
