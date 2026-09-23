# API Contract

This contract defines the first vertical slice. Keep response fields stable once the frontend depends on them.

## `GET /health`

Response:

```json
{
  "status": "ok",
  "version": "git-sha",
  "database": "reachable"
}
```

Do not expose credentials, resource ARNs, SQL, or exception stacks.

## `POST /v1/chat`

Request:

```json
{
  "conversationId": "optional-uuid",
  "message": "12月の土日に家族3人で箱根へ行きたい。予算は5万円です。",
  "clientRequestId": "uuid"
}
```

Response when information is missing:

```json
{
  "conversationId": "uuid",
  "assistantMessage": "宿泊日を教えてください。",
  "state": "NEEDS_INPUT",
  "missingFields": ["checkInDate"]
}
```

Response with a proposal:

```json
{
  "conversationId": "uuid",
  "assistantMessage": "予算内のプランをご提案します。",
  "state": "PROPOSAL_READY",
  "proposal": {
    "id": "uuid",
    "currency": "JPY",
    "totalPrice": 49200,
    "expiresAt": "2026-12-01T03:00:00Z",
    "items": [
      {
        "type": "ACCOMMODATION",
        "source": "mock_jalan",
        "sourceId": "hakone-hotel-001",
        "name": "箱根湯本 やすらぎテラス",
        "startsAt": "2026-12-05T15:00:00+09:00",
        "subtotal": 39600
      },
      {
        "type": "RESTAURANT",
        "source": "hotpepper",
        "sourceId": "restaurant-id",
        "name": "箱根イタリアン ルーチェ",
        "startsAt": "2026-12-05T12:30:00+09:00",
        "subtotal": 6600
      },
      {
        "type": "FEES",
        "source": "internal",
        "sourceId": "taxes-and-fees",
        "name": "入湯税等",
        "subtotal": 3000
      }
    ]
  }
}
```

All proposal values must be generated from persisted rows and server-side arithmetic.

## `GET /v1/proposals/{proposalId}`

Returns the persisted immutable proposal snapshot. Return `404` for unknown IDs and `403` when the proposal belongs to another user.

## `POST /v1/proposals/{proposalId}/confirm`

Headers:

```text
Idempotency-Key: client-generated-uuid
```

Request:

```json
{
  "email": "member@example.com"
}
```

Response:

```json
{
  "reservationId": "uuid",
  "status": "MOCK_CONFIRMED",
  "message": "予約内容をメールでお送りします。",
  "items": [
    {
      "type": "ACCOMMODATION",
      "status": "MOCK_CONFIRMED",
      "reference": "MOCK-HOTEL-000001"
    },
    {
      "type": "RESTAURANT",
      "status": "MOCK_CONFIRMED",
      "reference": "MOCK-FOOD-000001"
    }
  ]
}
```

Repeating the request with the same idempotency key must return the same reservation without decrementing inventory again.

## Structured AI contract

Bedrock constraint extraction must validate against a server-owned schema equivalent to:

```json
{
  "destination": "箱根",
  "checkInDate": "2026-12-05",
  "nights": 1,
  "adults": 2,
  "children": [{ "age": 3 }],
  "budgetJpy": 50000,
  "mealRequests": ["LUNCH", "DINNER"]
}
```

Reject or request clarification for invalid dates, negative counts, unsupported destinations, or a missing budget. The model output is input data, not authorization to query arbitrary resources.

## Error shape

```json
{
  "error": {
    "code": "PROPOSAL_EXPIRED",
    "message": "提案の有効期限が切れました。もう一度検索してください。",
    "requestId": "api-request-id"
  }
}
```

Use stable machine-readable codes and Japanese user-facing messages. Do not return raw upstream or database errors.
