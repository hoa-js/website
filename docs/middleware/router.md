## @hoajs/router

`@hoajs/router` is a router extension for `Hoa`. It augments a `Hoa` instance with HTTP method helpers, path matching powered by [path-to-regexp](https://github.com/pillarjs/path-to-regexp), and automatic extraction of route parameters into `ctx.req.params`.

```js
import { Hoa } from 'hoa'
import { router } from '@hoajs/router'

const app = new Hoa()
app.extend(router())

app.get('/users/:name', async (ctx, next) => {
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

Routes accept one or more async handlers. When multiple handlers are supplied they are composed with Hoa's `compose()` utility and executed in order, receiving the usual `(ctx, next)` signature.

## Route Matching

`@hoajs/router` uses `path-to-regexp` internally:

- Path parameters (e.g. `/users/:name`) are decoded and exposed on `ctx.req.params`.
- The original pattern is stored on `ctx.req.routePath`.
- `app.all()` matches every HTTP method.
- `HEAD` requests fall back to `GET` handlers when no explicit `HEAD` handler is defined.

## Router Options

Configure matching behavior by passing options to `router()`:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `sensitive` | `boolean` | `false` | Treat paths as case-sensitive when matching. |
| `end` | `boolean` | `true` | Require the entire URL to match the pattern. |
| `delimiter` | `string` | `'/'` | Segment delimiter used for named parameters. |
| `trailing` | `boolean` | `true` | Allow trailing delimiters (e.g. `/users/`). |

```js
app.extend(router())
// Equivalent to
app.extend(router({
  sensitive: false,
  end: true,
  delimiter: '/',
  trailing: true
}))
```

## tinyRouter

`tinyRouter` is a lightweight router extension provided by `@hoajs/router`. It does not rely on `path-to-regexp`; instead, it uses a minimal in-house compiler to perform path matching and parameter parsing. It augments a `Hoa` instance with HTTP method helpers and automatically decodes route parameters into `ctx.req.params`.

```js
import { Hoa } from 'hoa'
import { tinyRouter } from '@hoajs/router'

const app = new Hoa()
app.extend(tinyRouter())

app.get('/users/:name', async (ctx) => {
  ctx.res.body = `Hello, ${ctx.req.params.name}!`
})

export default app
```

### Tiny Router Options

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

### Tiny Router Examples

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
- Options: `router` supports `end`, `delimiter`, etc.; `tinyRouter` supports only `sensitive` and `trailing`.
- Matching capability: Both support common patterns and parameter parsing; `tinyRouter`’s patterns are more streamlined, ideal for small to medium projects or when bundle size matters.
- API consistency: Both expose the same extension helpers, parameter decoding, and `HEAD` fallback behavior, making switching between them straightforward.
