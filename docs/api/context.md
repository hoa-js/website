## ctx.request

Read‑only property representing the original Web Standard `Request`, you typically don't need to access it directly; prefer using the convenience methods and properties on `ctx.req` to read request information.

```js
app.use(async (ctx) => {
  ctx.req.method === ctx.request.method
  ctx.req.href === ctx.request.url
  ctx.req.get('user-agent') === ctx.request.headers.get('user-agent')
})
```

## ctx.response

Read‑only property that returns a Web Standard `Response` built from the current context. You typically don't need to access it directly—use it when you want to construct and return a native `Response` yourself.

## ctx.env

Read‑only environment bindings provided by the hosting platform. In Cloudflare Workers this corresponds to the `Env` object passed to the handler (KV namespaces, Durable Objects, secrets, R2 buckets, etc.). It may be `undefined` outside such environments.

```js
app.use(async (ctx) => {
  // Access a bound KV namespace (Cloudflare Workers)
  const value = await ctx.env?.KV.get('key')

  // Access a secret
  const apiKey = ctx.env?.API_KEY
})
```
## ctx.executionCtx

Platform execution context for the current request. In Cloudflare Workers this is the `ExecutionContext`, which exposes `waitUntil()` and `passThroughOnException()`. It may be `undefined` outside such environments.

```js
app.use(async (ctx) => {
  // Schedule background work to complete after the response
  ctx.executionCtx?.waitUntil(logRequestAsync(ctx))

  // Optionally allow upstream to handle exceptions
  ctx.executionCtx?.passThroughOnException()
})
```
## ctx.state

Per‑request mutable state object. Starts as an empty plain object and is intended for middleware and handlers to share data.

```js
// Middleware A: attach data to ctx.state
app.use(async (ctx, next) => {
  ctx.state.startTime = Date.now()
  await next()
})

// Middleware B: read data from ctx.state
app.use(async (ctx) => {
  const ms = Date.now() - ctx.state.startTime
  ctx.res.body = { ok: true, elapsed: ms }
})
```

## ctx.throw(status, [message], [options])

Throw an HttpError.

```js
ctx.throw(400)
ctx.throw(400, 'Bad Request')
ctx.throw(400, 'Bad Request', {
  expose: true,
  cause: new Error('Another Error'),
  headers: { 'X-Foo': 'foo' }
})
ctx.throw(400, {
  message: 'Bad Request',
  expose: true,
  cause: new Error('Another Error'),
  headers: { 'X-Foo': 'foo' }
})
```

## ctx.assert(value, status, [message], [options])

Assert condition or throw an HttpError.

```js
ctx.assert(false, 400)
ctx.assert(false, 400, 'Bad Request')
ctx.assert(false, 400, 'Bad Request', {
  expose: true,
  cause: new Error('Another Error'),
  headers: { 'X-Foo': 'foo' }
})
ctx.assert(false, 400, {
  message: 'Bad Request',
  expose: true,
  cause: new Error('Another Error'),
  headers: { 'X-Foo': 'foo' }
})
```

## ctx.toJSON()

Return JSON representation of the context.

```js
ctx.toJSON() // { app, req, res }
```
