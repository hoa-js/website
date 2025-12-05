---
url: /middleware/ratelimit/cloudflare-rate-limit.md
---
# @hoajs/cloudflare-rate-limit

This package provides two middlewares to enforce rate limiting in Hoa apps on Cloudflare Workers:

* `KVRateLimiter`: uses Cloudflare KV as the backing store.
* `RateLimiter`: uses Cloudflare's native Rate Limiting API (no KV).

## KVRateLimiter (Cloudflare KV)

KV-based rate limiting stores counters in KV. It also sets common rate limit headers on responses.

### Quick Start

```js
import { Hoa } from 'hoa'
import { KVRateLimiter } from '@hoajs/cloudflare-rate-limit'

const app = new Hoa()

app.use(KVRateLimiter({
  binding: 'KV',
  prefix: 'ratelimit:',
  limit: 3,
  period: 60,
  interval: 10,
  keyGenerator: (ctx) => ctx.req.ip
}))

app.use(async (ctx) => {
  ctx.res.body = 'Hello, Hoa!'
})

export default app
```

### Options

| Option          | Type                 | Default        | Description                                                                                   | Required |
|-----------------|----------------------|----------------|-----------------------------------------------------------------------------------------------|----------|
| `binding`       | string               | -              | KV namespace binding name (resolves to `ctx.env[binding]`).                                   | Yes      |
| `prefix`        | string               | `"ratelimit:"` | KV key prefix.                                                                                | No       |
| `limit`         | number (>= 1)        | -              | Max requests per `period`.                                                                    | Yes      |
| `period`        | number (>= 60)       | -              | Window length in seconds (Cloudflare KV TTL minimum).                                         | Yes      |
| `interval`      | number (>= 0)        | `0`            | Optional sub-interval used for rounding the reset header; must be `<= period`.                | No       |
| `keyGenerator`  | function             | -              | `(ctx) => string \| null \| undefined \| false`. Falsy key skips rate limiting.               | Yes      |
| `successHandler`| function             | built-in       | `(ctx, limit, remaining, reset) => void`. Default sets `X-RateLimit-*` headers.               | No       |
| `errorHandler`  | function             | built-in       | `(ctx, limit, remaining, reset) => void`. Default throws `429` and sets headers + `Retry-After`.| No       |

### Response Headers

On success (after `next()`), the default success handler sets:

* `X-RateLimit-Limit`: the `limit` value.
* `X-RateLimit-Remaining`: remaining tokens for the current window.
* `X-RateLimit-Reset`: current epoch seconds plus `reset`, rounded with `interval`.

On error (rate limit exceeded), the default error handler throws `429` and sets:

* `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset` (same semantics as above).
* `Retry-After`: seconds until reset.

### Notes

* Passing non-numeric values (e.g. `'60s'`) is rejected. Values are coerced with `Number(...)` and validated.
* `period >= 60` is required due to Cloudflare KV TTL limits.
* `interval <= period` is enforced.

## RateLimiter (Cloudflare Native API)

This middleware calls Cloudflare's native Rate Limiting API binding and does not store anything in KV.

### Quick Start

```js
import { Hoa } from 'hoa'
import { RateLimiter } from '@hoajs/cloudflare-rate-limit'

const app = new Hoa()

app.use(RateLimiter({
  binding: 'RATE_LIMITER',
  keyGenerator: (ctx) => ctx.req.ip
}))

app.use(async (ctx) => {
  ctx.res.body = 'Hello, Hoa!'
})

export default app
```

### Options

| Option           | Type               | Default    | Description                                                                                 | Required |
|------------------|--------------------|------------|---------------------------------------------------------------------------------------------|----------|
| `binding`        | string             | -          | Rate Limiter binding name (resolves to `ctx.env[binding]`).                                   | Yes      |
| `keyGenerator`   | function           | -          | `(ctx) => string \| null \| undefined \| false`. Falsy key skips rate limiting.             | Yes      |
| `successHandler` | function           | no-op      | `(ctx) => void`. Runs after `next()`; default no-op.                                        | No       |
| `errorHandler`   | function           | throws 429 | `(ctx) => void`. Runs when limited; default throws `429`.                                   | No       |

### Behavior

* If `keyGenerator(ctx)` returns falsy, the middleware simply calls `next()`.
* On `{ success: false }` from the binding, the default error handler throws `429`.
* On `{ success: true }`, `next()` is executed; the success handler runs in `finally`.
* Configure rate limit rules (limits/periods) via Wrangler; this middleware does not accept `limit/period` options.

### wrangler.jsonc

```jsonc
{
  // Wrangler v4.36.0+ required for Rate Limiting bindings
  "ratelimits": [
    {
      "name": "RATE_LIMITER",          // binding name → available as env.RATE_LIMITER
      "namespace_id": 1001,             // positive integer, unique per configuration
      "simple": {
        "limit": 100,                   // number of allowed requests in the window
        "period": 60                    // window in seconds: must be 10 or 60
      }
    }
  ]
}
```
