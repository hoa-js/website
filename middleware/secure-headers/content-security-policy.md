---
url: /middleware/secure-headers/content-security-policy.md
---
# Content-Security-Policy

The Content-Security-Policy (CSP) middleware helps prevent cross-site scripting (XSS) attacks and other code injection attacks by specifying which sources of content are allowed to be loaded.

## Quick Start

```js
import { Hoa } from 'hoa'
import { contentSecurityPolicy } from '@hoajs/secure-headers'

const app = new Hoa()

// Use default CSP directives
app.use(contentSecurityPolicy())

app.use(async (ctx) => {
  ctx.res.body = 'Hello, Hoa!'
})

export default app
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `useDefaults` | `boolean` | `true` | Whether to use default directives. When `false`, only your custom directives are used. |
| `directives` | `Record<string, string[] \| null \| dangerouslyDisableDefaultSrc>` | See below | CSP directives to set. Keys are directive names (camelCase or kebab-case), values are arrays of sources. |
| `reportOnly` | `boolean` | `false` | If `true`, sets Content-Security-Policy-Report-Only header instead of Content-Security-Policy. |

### Default Directives

When `useDefaults: true` (default), the following directives are set:

```js
{
  'default-src': ["'self'"],
  'base-uri': ["'self'"],
  'font-src': ["'self'", 'https:', 'data:'],
  'form-action': ["'self'"],
  'frame-ancestors': ["'self'"],
  'img-src': ["'self'", 'data:'],
  'object-src': ["'none'"],
  'script-src': ["'self'"],
  'script-src-attr': ["'none'"],
  'style-src': ["'self'", 'https:', "'unsafe-inline'"],
  'upgrade-insecure-requests': []
}
```

## Directive Values

Directive values must be properly quoted when necessary:

* Keywords like `'self'`, `'none'`, `'unsafe-inline'`, `'unsafe-eval'` must be quoted
* Nonces like `'nonce-abc123'` must be quoted
* Hashes like `'sha256-...'` must be quoted
* URLs and wildcards like `https:`, `*.example.com` should NOT be quoted

## Examples

### Custom Directives

```js
app.use(contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", 'https://trusted.cdn.com'],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", 'data:', 'https:'],
    connectSrc: ["'self'", 'https://api.example.com'],
    fontSrc: ["'self'", 'https://fonts.gstatic.com'],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'"],
    frameSrc: ["'none'"]
  }
}))
```

### Using Nonces

```js
app.use(contentSecurityPolicy({
  directives: {
    scriptSrc: [
      "'self'",
      (ctx) => `'nonce-${ctx.state.nonce}'`
    ]
  }
}))

app.use(async (ctx, next) => {
  // Generate a nonce for each request
  ctx.state.nonce = crypto.randomBytes(16).toString('base64')
  await next()
})
```

### Report-Only Mode

```js
app.use(contentSecurityPolicy({
  reportOnly: true,
  directives: {
    defaultSrc: ["'self'"],
    reportUri: ['/csp-violation-report']
  }
}))
```

### Disable Default Directives

```js
app.use(contentSecurityPolicy({
  useDefaults: false,
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"]
  }
}))
```

### Disable Specific Default Directive

```js
app.use(contentSecurityPolicy({
  directives: {
    // Override default
    'upgrade-insecure-requests': null,
    // Add custom directive
    scriptSrc: ["'self'", 'https://cdn.example.com']
  }
}))
```

### Dangerously Disable default-src

The `default-src` directive is required by default. To disable it (not recommended):

```js
import { contentSecurityPolicy } from '@hoajs/secure-headers'

app.use(contentSecurityPolicy({
  directives: {
    defaultSrc: contentSecurityPolicy.dangerouslyDisableDefaultSrc,
    scriptSrc: ["'self'"],
    styleSrc: ["'self'"]
  }
}))
```

### Strict CSP with Nonces

```js
app.use(async (ctx, next) => {
  ctx.state.nonce = crypto.randomBytes(16).toString('base64')
  await next()
})

app.use(contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'strict-dynamic'",
      (ctx) => `'nonce-${ctx.state.nonce}'`
    ],
    styleSrc: ["'self'"],
    objectSrc: ["'none'"],
    baseUri: ["'self'"]
  }
}))
```

## Common Directives

* **default-src**: Fallback for other directives
* **script-src**: Valid sources for JavaScript
* **style-src**: Valid sources for stylesheets
* **img-src**: Valid sources for images
* **connect-src**: Valid sources for fetch, XMLHttpRequest, WebSocket
* **font-src**: Valid sources for fonts
* **object-src**: Valid sources for `<object>`, `<embed>`, `<applet>`
* **media-src**: Valid sources for `<audio>` and `<video>`
* **frame-src**: Valid sources for frames
* **frame-ancestors**: Valid parents that may embed a page
* **form-action**: Valid endpoints for form submissions
* **base-uri**: Valid URLs for the `<base>` element
* **upgrade-insecure-requests**: Instructs browsers to upgrade HTTP requests to HTTPS

## Getting Default Directives

```js
import { contentSecurityPolicy } from '@hoajs/secure-headers'

const defaults = contentSecurityPolicy.getDefaultDirectives()
console.log(defaults)
```
