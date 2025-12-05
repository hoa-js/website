---
url: /middleware/validator/nana.md
---
# @hoajs/nana

Nana validator middleware for Hoa.

`nanaValidator` reads values from `ctx.req` using the keys you define in the schema:

* `{ query: object({...}) }` → `ctx.req.query`.
* `{ headers: object({...}) }` → `ctx.req.headers`.
* `{ params: object({...}) }` → `ctx.req.params` (requires `@hoajs/router` to populate `params`).
* `{ body: object({...}) }` → `ctx.req.body` (requires `@hoajs/bodyparser` to populate `body`).

On success, the validated value is written back to `ctx.req[key]`.
On failure, the underlying `nana.validate` call returns an error and `nanaValidator` calls `ctx.throw(error.status || 400, error.message)`.

## Quick Start

```js
import { Hoa } from 'hoa'
import { router } from '@hoajs/router'
import { nanaValidator } from '@hoajs/nana'
import { object, string, number } from 'nana'

const app = new Hoa()
app.extend(router())

app.get(
  '/users/:name',
  nanaValidator({
    params: object({
      name: string(),
      age: number()
    })
    // query: object({...}),
    // headers: object({...}),
    // body: object({...}),
    // ...
  }),
  async (ctx) => {
    const { name, age } = ctx.req.params
    ctx.res.body = `Hello, ${name}! You are ${age}.`
  }
)

export default app
```

## Examples

* Validate query parameters

```js
import { object, string } from 'nana'

app.get(
  '/search',
  nanaValidator({ query: object({ key1: string(), key2: string() }) }),
  (ctx) => { ctx.res.body = { valid: ctx.req.query } }
)
```

* Validate JSON body (with `@hoajs/bodyparser`)

```js
import { object, string, number } from 'nana'

app.post(
  '/orders',
  nanaValidator({
    body: object({
      id: string(),
      amount: number()
    })
  }),
  (ctx) => {
    // ctx.req.body is now validated and typed
    ctx.res.body = { ok: true, order: ctx.req.body }
  }
)
```

* Validate headers

```js
import { object, string } from 'nana'

app.use(nanaValidator({
  headers: object({
    'x-api-key': string()
  })
}))
```

* Use `pipe` for composed validation

```js
import { object, string, number, pipe, check } from 'nana'

app.post(
  '/products',
  nanaValidator({
    body: object({
      name: string(),
      price: pipe(
        number(),
        check((value) => value >= 0, 'price must be >= 0')
      )
    })
  }),
  (ctx) => {
    ctx.res.body = ctx.req.body
  }
)
```

* Use `check` for custom rules on query

```js
import { object, number, check } from 'nana'

app.get(
  '/posts',
  nanaValidator({
    query: object({
      page: check((value) => value > 0, 'must be positive')
    })
  }),
  (ctx) => {
    ctx.res.body = { page: ctx.req.query.page }
  }
)
```

* Use `transform` to normalize input

```js
import { object, string, transform } from 'nana'

app.post(
  '/comments',
  nanaValidator({
    body: object({
      content: pipe(
        string(),
        transform((value) => value.trim())
      )
    })
  }),
  (ctx) => {
    // content has been trimmed already
    ctx.res.body = { content: ctx.req.body.content }
  }
)
```

## Error handling

`nana` validators throw `Error` instances with useful properties like `expected`, `actual`, and `path`.
`nanaValidator` converts them into HTTP errors via `ctx.throw`:

* Status code: `error.status` if present, otherwise `400`.
* Body: `error.message`.

You can customize the error behaviour in your own validators, for example by throwing an `HttpError` with a custom status code:

```js
import { HttpError } from 'hoa'
import { createValidator } from 'nana'

const positiveNumber = createValidator('positiveNumber', (value, ctx) => {
  if (typeof value !== 'number' || value <= 0) {
    throw new HttpError(422, `(${ctx.path}: ${value}) ✖ positiveNumber`)
  }
})

app.use(nanaValidator({ query: object({ page: positiveNumber() }) }))
```
