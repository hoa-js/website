## @hoajs/tiny-router

`@hoajs/tiny-router` is a lightweight router extension for `Hoa`. It does not rely on `path-to-regexp`; instead, it uses a minimal in-house compiler to perform path matching and parameter parsing. It augments a `Hoa` instance with HTTP method helpers and automatically decodes route parameters into `ctx.req.params`.

```js
import { Hoa } from 'hoa'
import { tinyRouter } from '@hoajs/tiny-router'

const app = new Hoa()
app.extend(tinyRouter())

app.get('/users/:name', async (ctx) => {
  ctx.res.body = `Hello, ${ctx.req.params.name}!`
})

export default app
```

## Adding Routes

Once extended, the `app` instance exposes helpers for all common HTTP verbs:

- `app.get(path, ...handlers)`
- `app.post(path, ...handlers)`
- `app.put(path, ...handlers)`
- `app.patch(path, ...handlers)`
- `app.delete(path, ...handlers)`
- `app.head(path, ...handlers)`
- `app.options(path, ...handlers)`
- `app.all(path, ...handlers)`

Routes accept one or more async handlers. When multiple handlers are supplied, they are composed with Hoa's `compose()` utility and executed in order, receiving the usual `(ctx, next)` signature.

Note: `HEAD` requests will fall back to `GET` handlers when no explicit `HEAD` handler is defined.

## Options

Pass options to `tinyRouter()` to control matching behavior:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `sensitive` | `boolean` | `false` | Case sensitivity; when `false`, adds the `i` flag. |
| `trailing` | `boolean` | `true` | Allow an optional trailing slash (e.g., `/users/`). |

```js
app.extend(tinyRouter())
// Equivalent to
app.extend(tinyRouter({
  sensitive: false,
  trailing: true
}))
```

## Examples

- Named parameter decoding:

```js
app.get('/hello/:name', (ctx) => {
  // /hello/Alice%20Lee -> ctx.req.params.name === 'Alice Lee'
  ctx.res.body = ctx.req.params.name
})
```

- Greedy parameter across segments and trailing slash:

```js
app.get('/a/:path+', (ctx) => {
  // /a/x/y/z -> ctx.req.params.path === 'x/y/z'
  // /a/      (trailing=true) -> ctx.req.params.path === undefined
})
```

- Wildcard matching and original pattern recording:

```js
app.get('/assets/*', (ctx) => {
  // /assets/css/app.css -> matched
  // ctx.req.routePath === '/assets/*'
})
```

- Case sensitivity and trailing slash control:

```js
app.extend(tinyRouter({ sensitive: true, trailing: false }))
app.get('/Users/:id', (ctx) => { /* only matches /Users/123 */ })
```

## tinyRouter vs router

- Implementation: `router` is based on `path-to-regexp`, while `tinyRouter` uses a minimal built-in compiler (lighter, no extra dependency).
- Options: `router` supports `sensitive`, `end`, `delimiter`, and `trailing`; `tinyRouter` supports only `sensitive` and `trailing`.
- Matching capability: Both support common patterns and parameter parsing; `tinyRouter`’s patterns are more streamlined, ideal for small to medium projects or when bundle size matters.
- API consistency: Both expose the same extension helpers, parameter decoding, and `HEAD` fallback behavior, making switching between them straightforward.
