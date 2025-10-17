## @hoajs/cache

Provides simple and reliable response caching for Hoa. Built on the Web-standard `caches` API and works in Cloudflare Workers, Deno, Bun, Node.js, and other runtimes that support it.

If the runtime doesn't support `globalThis.caches`, the middleware becomes a no-op and won't affect request handling.

## Quick Start

```js
import { Hoa } from 'hoa'
import { cache } from '@hoajs/cache'

const app = new Hoa()
app.use(cache())

app.use(async (ctx) => {
  ctx.res.body = 'Hello, Hoa!'
})

export default app
```

## Options

```ts
interface CacheOptions {
  cacheName?: string | ((ctx: HoaContext) => Promise<string> | string)
  wait?: boolean
  cacheControl?: string
  vary?: string | string[]
  keyGenerator?: (ctx: HoaContext) => Promise<string> | string
  cacheableStatusCodes?: number[]
}
```

- `cacheName` (default `'cache'`)
  - Cache store name; supports string, function, or async function.
  - Useful for maintaining separate caches per route or context.

- `wait` (default `false`)
  - Whether to wait for `cache.put` to resolve before continuing.
  - In Deno or environments with an execution context, prefer `true` or provide `ctx.executionCtx` and use `waitUntil`.

- `cacheControl`
  - Directive string for the `Cache-Control` header; merged and de-duplicated when the response already has this header.

- `vary`
  - Sets the `Vary` header; merges with existing values, de-duplicates case-insensitively, and normalizes to lowercase.
  - If `*` is present, an error is thrown (forbids wildcard that prevents effective caching).

- `keyGenerator`
  - Generates a cache key for each request; defaults to the request URL (`ctx.req.href`).
  - May use route params, query params, or context; supports async.

- `cacheableStatusCodes` (default `[200]`)
  - Array of status codes that can be cached.

## Examples

### Basic caching (200 cached by default)

```js
app.use(cache())
```

### Set Cache-Control and Vary

```js
app.use(cache({
  cacheControl: 'public, max-age=60',
  vary: ['Accept', 'Accept-Language']
}))

app.use(async (ctx) => {
  // If your handler sets headers, the middleware will merge and de-duplicate
  ctx.res.set('Cache-Control', 'no-cache')
  ctx.res.set('Vary', 'Accept-Encoding')
  ctx.res.body = 'data'
})
```

Result:
- `Cache-Control`: `no-cache, public, max-age=60` (deduplicated by directive name and appends missing values).
- `Vary`: `accept, accept-encoding, accept-language` (case-insensitive dedupe, normalized to lowercase).

### Dynamic/async cacheName (per route/tenant isolation)

```js
app.use(cache({
  cacheName: async (ctx) => `tenant:${ctx.req.headers.get('x-tenant') ?? 'default'}`
}))
```

### Custom cache key (based on params/language)

```js
app.use(cache({
  keyGenerator: (ctx) => {
    const lang = ctx.req.headers.get('accept-language')?.split(',')[0] ?? 'en'
    return `${ctx.req.href}|lang:${lang}`
  }
}))
```

### Control write timing (wait / executionCtx)

```js
app.use(cache({ wait: true })) // explicitly wait for the write to finish

// If your runtime provides an execution context (e.g. Cloudflare Workers),
// ensure it's available on ctx.executionCtx.
// ctx.executionCtx?.waitUntil(...) schedules the write in the background.
```

### Cache only specific status codes

```js
app.use(cache({ cacheableStatusCodes: [200, 204] }))
```
