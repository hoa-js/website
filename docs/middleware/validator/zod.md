## @hoajs/zod

Zod validator middleware for Hoa.

zodValidator reads values from `ctx.req` using the keys you define in the schema:

- `{ query: z.object({...}) }` → `ctx.req.query`.
- `{ headers: z.object({...}) }` → `ctx.req.headers`.
- `{ params: z.object({...}) }` → `ctx.req.params` (requires `@hoajs/router` to populate `params`).
- `{ body: z.object({...}) }` → `ctx.req.body` (requires `@hoajs/bodyparser` to populate `body`).
- URL parts (`href`, `origin`, `protocol`, `host`, `hostname`, `port`, `pathname`, `search`, `hash`, `method`) → corresponding fields on `ctx.req`.

On success, the validated value is written back to `ctx.req[key]`. On failure, it throws `400` with a merged error message (deduplicated and joined by `; ` by default).

## Quick Start

```js
import { Hoa } from 'hoa'
import { router } from '@hoajs/router'
import { z, zodValidator } from '@hoajs/zod'

const app = new Hoa()
app.extend(router())

app.get(
  '/users/:name',
  zodValidator({
    params: z.object({
      name: z.string()
    }),
    // query: z.object({...}),
    // headers: z.object({...}),
    // body: z.object({...}),
    // ...
  }),
  async (ctx) => {
    const name = ctx.req.params.name
    ctx.res.body = `Hello, ${name}!`
  }
)

export default app
```

## Examples

- Validate query parameters

```js
app.get(
  '/search',
  zodValidator({ query: z.object({ key1: z.string(), key2: z.string() }) }),
  (ctx) => { ctx.res.body = { valid: ctx.req.query } }
)
```

- Validate headers (preserve undeclared headers)

```js
app.use(zodValidator({
  headers: z.object({ 'x-foo': z.literal('bar') }).passthrough()
}))
// ctx.req.headers will keep extra headers, e.g. x-extra
```

- Validate URL parts

```js
app.use(zodValidator({
  url: z.instanceof(URL),
  href: z.string().url(),
  origin: z.string(),
  protocol: z.literal('http:'),
  host: z.literal('example.com:8080'),
  hostname: z.literal('example.com'),
  port: z.literal('8080'),
  pathname: z.literal('/users'),
  search: z.literal('?id=1'),
  hash: z.literal('#frag'),
  method: z.literal('GET')
}))
```

## Custom error formatting

By default, error messages are de-duplicated and joined by a semicolon. You can customize them:

```js
app.use(zodValidator({
  query: z.object({ id: z.number() })
}, {
  formatError: (err, ctx, key, value) => `Wrong ${key}, got ${value}`
}))
```

or use `ctx.throw`:

```js
app.use(zodValidator({
  query: z.object({ id: z.number() })
}, {
  formatError: (err, ctx, key, value) => ctx.throw(412, `Wrong ${key}, got ${value}`)
}))
```
