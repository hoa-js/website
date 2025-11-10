# @hoajs/combine

Utility functions for composing middlewares, including `some`, `every`, and `except`, enabling more flexible composition and control over middleware execution.

## Quick Start

```js
import { Hoa } from 'hoa'
import { every, some } from '@hoajs/combine'
import { RateLimiter } from '@hoajs/rate-limiter'
import { basicAuth } from '@hoajs/basic-auth'
import { ip } from '@hoajs/ip'

const app = new Hoa()

app.use(
  some(
    every(
      ip({ allowList: ['192.168.0.2'] }),
      basicAuth({ username: 'admin', password: '123456' })
    ),
    // If both conditions are met, RateLimiter will not execute.
    RateLimiter(...)
  )
)

export default app
```

## Methods

### some(...middlewares)

Create a combined middleware that runs the first middleware which returns `true`.

- Executes middlewares in order; if a middleware returns `true` or returns nothing, stop executing the subsequent ones
- If a middleware returns `false`, continue to the next middleware
- If all middlewares return `false` or throw, the last error is thrown

```js
app.use(some(
  (ctx) => ctx.req.method === 'GET',
  (ctx) => ctx.req.method === 'POST',
  (ctx) => {
    ctx.status = 405
    ctx.body = 'Method Not Allowed'
    return true
  }
))
```

### every(...middlewares)

Create a combined middleware that runs all middlewares. If any middleware returns `false` or throws, stop execution.

- Executes all middlewares in order
- If any middleware returns `false` or throws, stop and rethrow the error
- Only when all middlewares pass will the downstream middleware continue

```js
app.use(every(
  (ctx) => ctx.req.method === 'GET',
  (ctx) => ctx.req.headers['x-auth-token'] === 'secret',
  (ctx) => {
    // Only reached when both prior conditions pass
    ctx.state.user = { id: 1, name: 'admin' }
  }
))
```

### except(condition, ...middlewares)

Create a combined middleware that executes the specified middlewares when the condition is not satisfied.

- `condition`: a single condition function or an array of condition functions
- `middlewares`: middlewares to execute when the condition is not met
- If the condition function returns `true`, skip executing the middlewares
- If the condition function returns `false`, execute the middlewares

```js
// Execute middlewares when the request method is not GET
app.use(except(
  (ctx) => ctx.req.method === 'GET',
  (ctx, next) => {
    ctx.status = 405
    ctx.body = 'Only GET method is allowed'
  }
))

// Use multiple conditions
app.use(except(
  [
    (ctx) => ctx.req.method === 'GET',
    (ctx) => ctx.req.method === 'POST'
  ],
  (ctx) => {
    ctx.status = 405
    ctx.body = 'Only GET and POST methods are allowed'
  }
))
```

## Type Definitions

| Type/Function | Description | Parameters | Returns |
|---------------|-------------|------------|---------|
| `Condition` | Condition function type | `ctx: HoaContext` | `boolean` |
| `some` | Continue when any middleware passes | `...middlewares: (HoaMiddleware \| Condition)[]` | `HoaMiddleware` |
| `every` | Continue only when all middlewares pass | `...middlewares: (HoaMiddleware \| Condition)[]` | `HoaMiddleware` |
| `except` | Execute middlewares when condition fails | `condition: Condition \| Condition[], ...middlewares: HoaMiddleware[]` | `HoaMiddleware` |
