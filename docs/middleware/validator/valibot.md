## @hoajs/valibot

Valibot validator middleware for Hoa.

valibotValidator reads values from `ctx.req` using the keys you define in the schema:

- `{ query: v.object({...}) }` → `ctx.req.query`.
- `{ headers: v.object({...}) }` → `ctx.req.headers`.
- `{ params: v.object({...}) }` → `ctx.req.params` (requires `@hoajs/router` to populate `params`).
- `{ body: v.object({...}) }` → `ctx.req.body` (requires `@hoajs/bodyparser` to populate `body`).
- URL parts (`href`, `origin`, `protocol`, `host`, `hostname`, `port`, `pathname`, `search`, `hash`, `method`) → corresponding fields on `ctx.req`.

On success, the validated value is written back to `ctx.req[key]`. On failure, it throws `400` with a merged error message (deduplicated and joined by `; ` by default).

## Quick Start

```js
import { Hoa } from 'hoa'
import { router } from '@hoajs/router'
import { v, valibotValidator } from '@hoajs/valibot'

const app = new Hoa()
app.extend(router())

app.get(
  '/users/:name',
  valibotValidator({
    params: v.object({
      name: v.string()
    }),
    // query: v.object({...}),
    // headers: v.object({...}),
    // body: v.object({...}),
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
  valibotValidator({ query: v.object({ key1: v.string(), key2: v.string() }) }),
  (ctx) => { ctx.res.body = { valid: ctx.req.query } }
)
```

- Validate headers (preserve undeclared headers)

```js
app.use(valibotValidator({
  headers: v.looseObject({ 'x-foo': v.literal('bar') })
}))
// ctx.req.headers will keep extra headers, e.g. x-extra
```

- Validate URL parts

```js
app.use(valibotValidator({
  url: v.instance(URL),
  href: v.pipe(v.string(), v.url()),
  origin: v.string(),
  protocol: v.literal('http:'),
  host: v.literal('example.com:8080'),
  hostname: v.literal('example.com'),
  port: v.literal('8080'),
  pathname: v.literal('/users'),
  search: v.literal('?id=1'),
  hash: v.literal('#frag'),
  method: v.literal('GET')
}))
```

## Abort options

valibotValidator supports two options to control how validation errors are collected:

- `abortEarly` (boolean):
  - `true` → stop collecting after the first issue (per key) and return a single error.
  - `false` → collect all issues (per key) and return merged errors.
- `abortPipeEarly` (boolean):
  - When using `v.pipe(...)`, `true` → stop pipe at the first failing check.
  - `false` → collect all failing checks in the pipe.

```js
// Example: abortEarly
app.use(valibotValidator({
  body: v.object({ a: v.number(), b: v.number() })
}, { abortEarly: true }))

// Example: abortPipeEarly
const pipeSchema = v.pipe(
  v.string(),
  v.check(() => false, 'M1'),
  v.check(() => false, 'M2')
)
app.use(valibotValidator({ body: v.object({ p: pipeSchema }) }, { abortPipeEarly: true }))
```

## Custom error formatting

By default, error messages are de-duplicated and joined by a semicolon. You can customize them:

```js
app.use(valibotValidator({
  query: v.object({ id: v.number() })
}, {
  formatError: (issues, ctx, key, value) => `Wrong ${key}, got ${String(value?.id)}`
}))
```

or use `ctx.throw`:

```js
app.use(valibotValidator({
  query: v.object({ id: v.number() })
}, {
  formatError: (issues, ctx, key, value) => ctx.throw(412, `Wrong ${key}, got ${String(value?.id)}`)
}))
```