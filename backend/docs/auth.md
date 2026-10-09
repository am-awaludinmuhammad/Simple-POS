# Authentication

The API uses JSON Web Tokens (JWTs) for authentication.

## Tokens

After a successful sign-in, the API issues two tokens:

| Token | Lifetime | Purpose |
| --- | --- | --- |
| Access token | 15 minutes | Sent with protected API requests. |
| Refresh token | 30 days | Used to obtain a new access token after the access token expires. |

Use the access token as a Bearer token:

```http
Authorization: Bearer <access-token>
```

Refresh tokens are not used to access protected endpoints directly. A refresh request must validate the token and issue a new access token. Invalid, expired, or revoked refresh tokens must be rejected.

## Configuration

Token signing secrets and lifetimes are configured through `backend/.env`:

```dotenv
JWT_ACCESS_TOKEN_SECRET=replace-with-a-strong-access-token-secret
JWT_REFRESH_TOKEN_SECRET=replace-with-a-strong-refresh-token-secret
JWT_ACCESS_TOKEN_EXPIRES_IN=15m
JWT_REFRESH_TOKEN_EXPIRES_IN=30d
```

Use distinct, high-entropy secrets for access and refresh tokens. Do not commit real secrets to source control.

## Refresh-session

Each issued refresh token has a corresponding row in the `refresh_sessions` table. The token itself is not stored; `token_hash` stores a hash of it.

| Column | Meaning |
| --- | --- |
| `id` | Refresh-session identifier. |
| `user_id` | User who owns the session. |
| `token_hash` | Hash of the refresh token. |
| `expires_at` | Session expiration time. |
| `revoked_at` | Revocation time, or `NULL` while active. |
| `created_at`, `updated_at` | Audit timestamps. |

On refresh, the service verifies the JWT, looks up its session, compares the token to `token_hash`, and ensures `expires_at` has not passed and `revoked_at` is `NULL`. Sign-out should revoke the associated session; a password reset or security-sensitive account change should revoke all of the user's refresh sessions.
