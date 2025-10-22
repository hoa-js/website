## @hoajs/csrf

`@hoajs/csrf` is a CSRF (Cross-Site Request Forgery) protection middleware for Hoa. It validates requests based on Origin, Referer, and Sec-Fetch-Site headers to prevent CSRF attacks.

## Quick Start

```js
import { Hoa } from 'hoa'
import { csrf } from '@hoajs/csrf'

const app = new Hoa()

// Enable CSRF protection for all routes with defaults
app.use(csrf())

app.use(async (ctx) => {
  ctx.res.body = 'Hello, Hoa!'
})

export default app
```

Route-scoped CSRF (with `@hoajs/router`):

```js
import { Hoa } from 'hoa'
import { router } from '@hoajs/router'
import { csrf } from '@hoajs/csrf'

const app = new Hoa()
app.extend(router())

app.get('/public', async (ctx) => {
  ctx.res.body = 'Public resource (no CSRF protection)'
})

app.post('/form', csrf(), async (ctx) => {
  ctx.res.body = 'Form submitted'
})

app.post('/api', csrf({
  origin: ['https://example.com', 'https://app.example.com'],
  checkReferer: false
}), async (ctx) => {
  ctx.res.body = 'API request processed'
})

export default app
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `origin` | `string \| string[] \| (origin, ctx) => boolean` | Same as request origin | Allowed origin(s). Function should return `true` to allow or `false` to disallow. By default, only requests from the same origin are allowed. |
| `secFetchSite` | `'same-origin' \| 'same-site' \| 'cross-site' \| 'none' \| SecFetchSite[] \| (secFetchSite, ctx) => boolean` | `'same-origin'` | Allowed Sec-Fetch-Site header value(s). Function should return `true` to allow or `false` to disallow. |
| `checkReferer` | `boolean` | `true` | Whether to validate the Referer header. When `true`, validates that Referer origin matches request origin. |
| `allowedContentTypes` | `string[]` | `['application/x-www-form-urlencoded', 'multipart/form-data', 'text/plain', 'application/json', 'application/xml', 'text/xml']` | Content-Types that require CSRF protection. Requests with other Content-Types skip validation. |

## Behavior Details

- Safe Methods
  - GET, HEAD, and OPTIONS requests are always allowed and skip CSRF validation.
  - Only unsafe methods (POST, PUT, DELETE, PATCH, etc.) are validated.

- Content-Type Filtering
  - By default, only requests with common form/API Content-Types are validated.
  - you can custom `allowedContentTypes` to allow other Content-Types.

- Sec-Fetch-Site Header
  - Modern browsers send this header automatically.
  - Values: `'same-origin'`, `'same-site'`, `'cross-site'`, `'none'`.
  - By default, only `'same-origin'` is allowed.

- Origin Header
  - Sent by browsers for cross-origin requests and some same-origin requests.
  - By default, only the same origin as the request URL (`ctx.req.origin`) is allowed.

- Referer Header
  - When `checkReferer: true` (default), validates that Referer origin matches request origin.
  - If Referer is present but invalid, the request is immediately rejected.
  - Set `checkReferer: false` to skip Referer validation (e.g., for API endpoints where Referer may not be sent).

- Validation Logic
  - The middleware validates requests in the following order:
    1. If Referer header is present and `checkReferer: true`, validates that Referer origin matches request origin.
    2. If Referer validation fails, the request is rejected with 403 Forbidden.
    3. Otherwise, validates either Sec-Fetch-Site header OR Origin header (at least one must pass).
    4. If both Sec-Fetch-Site and Origin validations fail, the request is rejected with 403 Forbidden.

## Examples

Allow a single origin:

```js
app.use(csrf({ origin: 'https://example.com' }))
```

Allow multiple origins:

```js
app.use(csrf({ origin: ['https://a.example.com', 'https://b.example.com'] }))
```

Dynamic origin validation:

```js
app.use(csrf({
  origin: (origin, ctx) => {
    // Custom validation logic
    return origin === 'https://allowed.example.com'
  }
}))
```

Allow same-site requests:

```js
app.use(csrf({ secFetchSite: ['same-origin', 'same-site'] }))
```

Dynamic Sec-Fetch-Site validation:

```js
app.use(csrf({
  secFetchSite: (secFetchSite, ctx) => {
    // Allow same-origin and same-site
    return secFetchSite === 'same-origin' || secFetchSite === 'same-site'
  }
}))
```

Disable Referer validation:

```js
app.use(csrf({ checkReferer: false }))
```

Protect only specific Content-Types:

```js
app.use(csrf({ 
  allowedContentTypes: ['application/json', 'application/xml'] 
}))
```

Combined configuration for API endpoints:

```js
app.use(csrf({
  origin: ['https://app.example.com', 'https://admin.example.com'],
  secFetchSite: ['same-origin', 'same-site'],
  checkReferer: false,
  allowedContentTypes: ['application/json']
}))
```