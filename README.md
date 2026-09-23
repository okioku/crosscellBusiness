# Ring Cross-sell Travel Concierge

じゃらんとホットペッパーグルメを横断し、宿泊・飲食・予算をまとめて提案する旅行体験 AI コンシェルジュです。

現在は静的モックを公開済みで、次フェーズでは AWS 上に検索・予約プロトタイプを構築します。

## できること

- 12月の土日、箱根、家族3名、5万円以内という相談を入力できます。
- AI が宿、ランチ、夕食付き宿泊プラン、合計金額を提案します。
- ユーザーが予約依頼を送ると、メール送付までの予約完了メッセージを返します。

## 現在のモック

- HTML / CSS / JavaScript の静的モック
- 外部 API、DB、ビルドツールなし
- ブラウザで `index.html` を開くだけで動作

ローカルサーバーで確認する場合:

```bash
node tools/serve.mjs
```

起動後、`http://127.0.0.1:4173` を開いてください。

## AWS版の目標構成

- AWS Amplify Hosting + GitHub App
- API Gateway HTTP API + Lambda / TypeScript
- Amazon Bedrock Nova 2 Lite
- Aurora PostgreSQL Serverless v2 + Data API
- Amazon Cognito
- AWS CDK / TypeScript
- GitHub Actions + AWS OIDC

## 引継ぎ資料

別端末または別の AI エージェントで作業を再開する場合は、最初に次を読んでください。

1. [AGENTS.md](AGENTS.md)
2. [docs/handoff.md](docs/handoff.md)
3. [docs/architecture.md](docs/architecture.md)
4. [docs/data-model.md](docs/data-model.md)
5. [docs/api-contract.md](docs/api-contract.md)
6. [docs/setup.md](docs/setup.md)
7. [docs/deployment.md](docs/deployment.md)
8. [docs/references.md](docs/references.md)
9. [docs/zip-handoff.md](docs/zip-handoff.md)

新しい AI エージェントへ渡すプロンプトは [docs/agent-start-prompt.md](docs/agent-start-prompt.md) にあります。
