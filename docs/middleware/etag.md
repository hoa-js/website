## @hoajs/etag

Generate and validate HTTP ETags for Hoa responses. This middleware computes (or respects existing) entity tags and handles conditional requests using the `If-None-Match` header to reduce bandwidth and improve cache efficiency.

## Quick Start

```ts
import { Hoa } from 'hoa'
import { etag } from '@hoajs/etag'

const app = new Hoa()
app.use(etag())

app.use(async (ctx) => {
  ctx.res.body = 'Hello, Hoa!'
})

export default app
```

## Options

```ts
export interface ETagOptions {
  // Headers to keep on 304 responses. Compared case-insensitively.
  retainedHeaders?: string[]
  // Use weak validation (prefix ETag with W/)
  weak?: boolean
  // Custom digest generator: receives the full response bytes and returns a raw digest
  generateDigest?: (body: Uint8Array) => ArrayBuffer | Promise<ArrayBuffer>
}
```

- `weak` (default `false`)
  - When `true`, ETag is emitted as `W/"<hash>"`.
- `generateDigest` (optional)
  - A function that receives all response bytes (`Uint8Array`) and returns an `ArrayBuffer` of the digest. If omitted, the middleware uses `crypto.subtle.digest('SHA-1', bytes)` when available.
- `retainedHeaders` (default `[ 'cache-control', 'content-location', 'date', 'etag', 'expires', 'vary' ]`)
  - Which headers are kept on 304 responses. Names are matched case-insensitively.

## Examples

### Strong vs Weak ETags

```ts
app.use(etag())              // strong (default): "<hash>"
app.use(etag({ weak: true })) // weak: W/"<hash>"
```

### Custom Digest (SHA-256 via Web Crypto)

```ts
app.use(etag({
  generateDigest: (bytes) => crypto.subtle.digest('SHA-256', bytes)
}))
```

### Respect Pre-set ETag

```ts
app.use(etag())

app.use(async (ctx) => {
  // Set ETag before response body; etag() will respect it and skip recomputation
  ctx.res.set('ETag', '"manual-tag"')
  ctx.res.body = 'some content'
})
```

### Conditional Requests with If-None-Match

```ts
// Register etag() before routes so it runs after downstream handlers
app.use(etag())

// GET/HEAD + If-None-Match: * -> 304 when a representation exists
app.use(async (ctx, next) => {
  if (ctx.path === '/avatar' && (ctx.req.method === 'GET' || ctx.req.method === 'HEAD')) {
    ctx.res.body = 'image-content'
    return
  }
  await next()
})

// Non-GET/HEAD + * -> not treated as a match by this middleware
// App-level policy can reject modification with 412 when resource exists
app.use(async (ctx, next) => {
  if (ctx.path === '/avatar' && ctx.req.method === 'POST') {
    if (ctx.req.get('If-None-Match') === '*') {
      ctx.res.status = 412
      ctx.res.body = 'Precondition Failed'
      return
    }
    ctx.res.body = 'uploaded'
    return
  }
  await next()
})

// Specific ETags are matched ignoring W/ and quotes
app.use(async (ctx, next) => {
  if (ctx.path === '/manual') {
    ctx.res.set('ETag', 'W/"abc"') // If-None-Match: "abc" will be considered a match
    ctx.res.body = { ok: true }
    return
  }
  await next()
})
```
