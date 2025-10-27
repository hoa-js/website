## @hoajs/sentry

Sentry middleware for Hoa. It integrates Sentry error tracking and monitoring using [toucan-js](https://github.com/robertcepa/toucan-js), designed for Cloudflare Workers and edge runtimes.

Features:
- Automatic exception capture and reporting to Sentry
- Enriched error context with HTTP metadata (method, URL, status, route, host, referer)
- Request ID tracking from headers or context state
- Exposes Sentry client on `ctx.state.sentry` for manual logging
- Supports Cloudflare Workers execution context

## Quick Start

```js
import { Hoa } from 'hoa'
import { sentry } from '@hoajs/sentry'

const app = new Hoa()

// Enable Sentry for all routes
app.use(sentry())

app.use(async (ctx) => {
  ctx.res.body = 'Hello, Hoa!'
})

export default app
```

## Options

The middleware accepts all [toucan-js options](https://github.com/robertcepa/toucan-js#options), with the following defaults:

| Option | Type | Description |
| --- | --- | --- |
| `dsn` | `string` | Sentry DSN. If omitted, reads from `ctx.env.SENTRY_DSN` or `ctx.env.NEXT_PUBLIC_SENTRY_DSN`. |
| `request` | `Request` | Automatically set to `ctx.request`. |
| `context` | `ExecutionContext` | Automatically set to `ctx.executionCtx` (or a mock if unavailable). |

## Behavior Details

### Exception Capture

When an error is thrown in downstream middleware:
1. The middleware captures the exception via `toucan.captureException(err)`
2. Enriches the error with HTTP metadata tags:
   - `http.status_code`: HTTP status (from `err.status`, `err.statusCode`, or defaults to 500)
   - `http.method`: Request method (GET, POST, etc.)
   - `http.url`: Full path including query string
   - `http.route`: Route pattern (if `ctx.req.routePath` is set)
   - `http.host`: Request host
   - `http.referer`: Referer header (if present)
   - `request_id`: Request ID from `ctx.state.requestId` or `x-request-id` header (if present)
3. Rethrows the error to preserve default error handling

### Sentry Client Access

The Toucan instance is exposed on `ctx.state.sentry`, allowing manual logging and tracking:

```js
app.use(async (ctx) => {
  // Manual logging
  ctx.state.sentry.setUser({ id: ctx.state.user?.id })
  ctx.state.sentry.setTag('feature', 'checkout')
  ctx.state.sentry.addBreadcrumb({
    message: 'User initiated checkout',
    level: 'info'
  })
  
  ctx.res.body = 'OK'
})
```

## Examples

### Custom DSN

```js
app.use(sentry({ dsn: 'https://your-dsn@sentry.io/project-id' }))
```

### Environment and Release Tracking

```js
app.use(sentry({
  environment: 'production',
  release: 'v1.2.3'
}))
```

### Manual Error Capture

```js
app.use(async (ctx) => {
  try {
    await riskyOperation()
  } catch (err) {
    // Manually capture with custom context
    ctx.state.sentry.setContext('operation', {
      type: 'risky',
      attempt: 1
    })
    ctx.state.sentry.captureException(err)
    
    // Handle gracefully
    ctx.res.body = { error: 'Operation failed' }
    ctx.res.status = 500
  }
})
```

### Performance Monitoring

```js
app.use(sentry({
  tracesSampleRate: 0.1, // Sample 10% of transactions
  beforeSend: (event) => {
    // Filter out certain errors
    if (event.exception?.values?.[0]?.type === 'NotFoundError') {
      return null
    }
    return event
  }
}))
```

### Integration with Request ID Middleware

```js
import { requestId } from '@hoajs/request-id'
import { sentry } from '@hoajs/sentry'

app.use(requestId())
app.use(sentry())

// Request ID is automatically tagged in Sentry errors
app.use(async (ctx) => {
  throw new Error('Something went wrong')
  // Error will include request_id tag from ctx.state.requestId
})
```

### User Context Tracking

```js
app.use(async (ctx) => {
  if (ctx.state.user) {
    ctx.state.sentry.setUser({
      id: ctx.state.user.id,
      email: ctx.state.user.email,
      username: ctx.state.user.username
    })
  }
  
  await next()
})
```

### Custom Tags and Breadcrumbs

```js
app.use(async (ctx) => {
  // Add custom tags
  ctx.state.sentry.setTag('tenant_id', ctx.state.tenantId)
  ctx.state.sentry.setTag('api_version', 'v2')
  
  // Add breadcrumbs for debugging
  ctx.state.sentry.addBreadcrumb({
    category: 'auth',
    message: 'User authenticated',
    level: 'info'
  })
  
  await next()
})
```
