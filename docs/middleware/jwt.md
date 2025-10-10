## @hoajs/jwt

JSON Web Token (JWT) middleware for Hoa.

Supported scenarios:
- HS* verification with a shared secret (e.g., HS256)
- RS* verification and signing using local PEM/KeyLike (e.g., RS256)
- Asymmetric verification via remote JWKS (typically RS256)
- Dynamic secret resolution (function-based, returning key material based on the token)

## Quick Start

```js
import { Hoa } from 'hoa'
import { jwt } from '@hoajs/jwt'

const app = new Hoa()
app.use(jwt({ secret: 'shhhh', algorithms: ['HS256'] }))

app.use(async (ctx) => {
  // After verification, the payload is stored on ctx.state.user (configurable via `key`)
  ctx.res.body = `Hello, ${ctx.state.user.name}!`
})

export default app
```

## Options
- secret: Secret or key material for verification (string/Uint8Array/CryptoKey/KeyLike), or a function (token) => key; can be omitted when using jwksUri only
- algorithms: Allowed algorithms, default ['HS256']
- getToken: Custom method to extract the token from the request (default reads from Authorization: Bearer)
- cookie: When Authorization is empty, read the token from this cookie name
- key: The key on ctx.state to store the verified payload, default 'user'
- credentialsRequired: When true, missing token results in 401; when false, calls next() directly. default true
- passthrough: When true, do not throw on verification failure; just next(). default false
- isRevoked: Optional revocation check; returning true treats the token as revoked
- issuer/audience/subject/clockTolerance: Corresponding claim checks and clock skew tolerance
- jwksUri: Remote JWKS endpoint (typically used with RS256)

## Examples

### Remote JWKS verification

```js
app.use(jwt({ jwksUri: 'https://example.com/.well-known/jwks.json', algorithms: ['RS256'] }))
```

> Note: When `jwksUri` is provided, verification uses the remote key set (JWKS). If neither `jwksUri` nor `secret` is configured, verification will throw "Verification secret is not configured".

### Custom token extraction

```js
app.use(jwt({
  secret: 'shhhh',
  algorithms: ['HS256'],
  getToken: (ctx) => ctx.req.get('X-Auth') || null
}))
```

### Use Cookie as a fallback

```js
app.use(jwt({ secret: 'shhhh', algorithms: ['HS256'], cookie: 'auth' }))
```

### Customize ctx.state key

```js
app.use(jwt({ secret: 'shhhh', algorithms: ['HS256'], key: 'auth' }))
app.use(async (ctx) => {
  ctx.res.body = `Welcome, ${ctx.state.auth.name}!`
})
```

### Passthrough and revocation check

```js
app.use(jwt({ secret: 'shhhh', algorithms: ['HS256'], passthrough: true }))
app.use(async (ctx) => {
  // Even if the token is invalid, control continues here (passthrough=true)
  ctx.res.body = 'OK'
})

app.use(jwt({
  secret: 'shhhh',
  algorithms: ['HS256'],
  isRevoked: async (ctx, payload) => {
    // token revocation logic here
  }
}))
```

## Utilities

### signJWT

signJWT(payload, secret, options): Generate a signed token; for RS* pass a private key PEM/KeyLike, for HS* pass a shared secret string
  - payload: Object/JWTPayload, the claims to include in the token (custom fields allowed). Issued-at (iat) is set automatically.
  - secret: string | Uint8Array | CryptoKey | KeyLike. For HS* pass a shared secret string; for RS* pass a private key (PEM or KeyLike).
  - options:
    - algorithm: string. Default 'HS256'. Example: 'HS256', 'RS256'.
    - issuer: string. Sets the `iss` claim.
    - audience: string. Sets the `aud` claim.
    - subject: string. Sets the `sub` claim.
    - expiresIn: string | number. Expiration, e.g. '1h', '30m', or seconds.
    - header: JWS header parameters. Merged into protected header (e.g., `{ kid: 'key-id' }`).
  - returns: Promise\<string\> – the compact JWT string.

HS256 signing:

```js
import { signJWT } from '@hoajs/jwt'

const secret = 'shhhh'
const token = await signJWT(
  { name: 'Alice' },
  secret,
  { algorithm: 'HS256', expiresIn: '1h', header: { kid: 'hs1' } }
)
```

RS256 signing with PEM:

```js
import { signJWT } from '@hoajs/jwt'

const privatePem = `-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----`
const token = await signJWT(
  { uid: 1 },
  privatePem,
  { algorithm: 'RS256', expiresIn: '1h' }
)
```

### verifyJWT

verifyJWT(token, options): Verify a token; supports secret/jwksUri/function-based secret
  - token: string. The JWT compact string to verify.
  - options:
    - secret: string | Uint8Array | CryptoKey | KeyLike | (token) => Promise\<secret\>. Verification key/secret. For RS* typically a public key (PEM/KeyLike). When using `jwksUri`, `secret` can be omitted.
    - algorithms: string[]. Allowed algorithms. Default ['HS256']; set to ['RS256'] for RS256/JWKS.
    - issuer: string | string[]. Expected issuer(s) to validate the `iss` claim.
    - audience: string | string[]. Expected audience(s) to validate the `aud` claim.
    - subject: string. Expected subject to validate the `sub` claim.
    - clockTolerance: string | number. Allowed clock skew (e.g., '5s' or 5).
    - jwksUri: string. Remote JWKS endpoint for asymmetric verification (uses a remote key set).
  - returns: Promise\<{ payload: JWTPayload; protectedHeader: JWSHeaderParameters }\>

Verify HS256 token with a shared secret:

```js
import { verifyJWT } from '@hoajs/jwt'

const secret = 'shhhh'
const { payload, protectedHeader } = await verifyJWT(token, {
  secret,
  algorithms: ['HS256'],
  issuer: 'example-issuer',
  audience: 'example-audience',
  clockTolerance: '5s'
})
```

Verify RS256 token with public PEM:

```js
import { verifyJWT } from '@hoajs/jwt'

const publicPem = `-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----`
const { payload } = await verifyJWT(token, {
  secret: publicPem,
  algorithms: ['RS256']
})
```

Verify via remote JWKS:

```js
import { verifyJWT } from '@hoajs/jwt'

const { payload } = await verifyJWT(tokenFromClient, {
  jwksUri: 'https://example.com/.well-known/jwks.json',
  algorithms: ['RS256']
})
```

Verify with function-based secret (dynamic):

```js
import { verifyJWT } from '@hoajs/jwt'

const { payload } = await verifyJWT(token, {
  secret: async (t) => process.env.JWT_SECRET,
  algorithms: ['HS256']
})
```
