---
url: /middleware/secure-headers/secure-headers.md
---
# @hoajs/secure-headers

`@hoajs/secure-headers` is a comprehensive security headers middleware for Hoa. It sets various HTTP security headers to help protect your application from common web vulnerabilities.

## Quick Start

```js
import { Hoa } from 'hoa'
import { secureHeaders } from '@hoajs/secure-headers'

const app = new Hoa()

// Enable all security headers with defaults
app.use(secureHeaders())

app.use(async (ctx) => {
  ctx.res.body = 'Hello, Hoa!'
})

export default app
```

Route-scoped security headers (with `@hoajs/router`):

```js
import { Hoa } from 'hoa'
import { router } from '@hoajs/router'
import { secureHeaders } from '@hoajs/secure-headers'

const app = new Hoa()
app.extend(router())

app.get('/public', async (ctx) => {
  ctx.res.body = 'Public resource (no security headers)'
})

app.get('/secure', secureHeaders(), async (ctx) => {
  ctx.res.body = 'Secure resource with all security headers'
})

app.get('/custom', secureHeaders({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"]
    }
  },
  strictTransportSecurity: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}), async (ctx) => {
  ctx.res.body = 'Custom security headers'
})

export default app
```

## Options

The `secureHeaders` middleware accepts an options object to configure individual security headers. Each header can be:

* `undefined` or `true` - Use default settings (enabled by default for most headers)
* `false` - Disable the header
* An options object - Configure the header with specific options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `contentSecurityPolicy` | `ContentSecurityPolicyOptions \| boolean` | `true` | Sets Content-Security-Policy header. See [Content Security Policy](./content-security-policy.md) for details. |
| `crossOriginEmbedderPolicy` | `CrossOriginEmbedderPolicyOptions \| boolean` | `false` | Sets Cross-Origin-Embedder-Policy header. See [Cross-Origin Embedder Policy](./cross-origin-embedder-policy.md) for details. |
| `crossOriginOpenerPolicy` | `CrossOriginOpenerPolicyOptions \| boolean` | `true` | Sets Cross-Origin-Opener-Policy header. See [Cross-Origin Opener Policy](./cross-origin-opener-policy.md) for details. |
| `crossOriginResourcePolicy` | `CrossOriginResourcePolicyOptions \| boolean` | `true` | Sets Cross-Origin-Resource-Policy header. See [Cross-Origin Resource Policy](./cross-origin-resource-policy.md) for details. |
| `originAgentCluster` | `boolean` | `true` | Sets Origin-Agent-Cluster header. See [Origin Agent Cluster](./origin-agent-cluster.md) for details. |
| `referrerPolicy` | `ReferrerPolicyOptions \| boolean` | `true` | Sets Referrer-Policy header. See [Referrer Policy](./referrer-policy.md) for details. |
| `strictTransportSecurity` | `StrictTransportSecurityOptions \| boolean` | `true` | Sets Strict-Transport-Security header. See [Strict Transport Security](./strict-transport-security.md) for details. |
| `xContentTypeOptions` | `boolean` | `true` | Sets X-Content-Type-Options header. See [X-Content-Type-Options](./x-content-type-options.md) for details. |
| `xDnsPrefetchControl` | `XDnsPrefetchControlOptions \| boolean` | `true` | Sets X-DNS-Prefetch-Control header. See [X-DNS-Prefetch-Control](./x-dns-prefetch-control.md) for details. |
| `xDownloadOptions` | `boolean` | `true` | Sets X-Download-Options header. See [X-Download-Options](./x-download-options.md) for details. |
| `xFrameOptions` | `XFrameOptionsOptions \| boolean` | `true` | Sets X-Frame-Options header. See [X-Frame-Options](./x-frame-options.md) for details. |
| `xPermittedCrossDomainPolicies` | `XPermittedCrossDomainPoliciesOptions \| boolean` | `true` | Sets X-Permitted-Cross-Domain-Policies header. |
| `xPoweredBy` | `boolean` | `true` | Removes X-Powered-By header. |
| `xXssProtection` | `boolean` | `true` | Sets X-XSS-Protection header. See [X-XSS-Protection](./x-xss-protection.md) for details. |
| `permissionPolicy` | `PermissionPolicyOptions` | `undefined` | Sets Permissions-Policy header. See [Permission Policy](./permission-policy.md) for details. |

### Legacy Aliases

For compatibility, the following aliases are supported:

* `hsts` - Alias for `strictTransportSecurity`
* `noSniff` - Alias for `xContentTypeOptions`
* `dnsPrefetchControl` - Alias for `xDnsPrefetchControl`
* `ieNoOpen` - Alias for `xDownloadOptions`
* `frameguard` - Alias for `xFrameOptions`
* `permittedCrossDomainPolicies` - Alias for `xPermittedCrossDomainPolicies`
* `hidePoweredBy` - Alias for `xPoweredBy`
* `xssFilter` - Alias for `xXssProtection`

## Using Individual Middleware

Each security header can be used independently:

```js
import { Hoa } from 'hoa'
import { 
  contentSecurityPolicy,
  strictTransportSecurity,
  xFrameOptions 
} from '@hoajs/secure-headers'

const app = new Hoa()

// Use only specific security headers
app.use(contentSecurityPolicy())
app.use(strictTransportSecurity({ maxAge: 31536000 }))
app.use(xFrameOptions({ action: 'deny' }))

app.use(async (ctx) => {
  ctx.res.body = 'Hello, Hoa!'
})

export default app
```

Or access them through the main function:

```js
import { Hoa } from 'hoa'
import { secureHeaders } from '@hoajs/secure-headers'

const app = new Hoa()

// Access individual middleware through secureHeaders
app.use(secureHeaders.contentSecurityPolicy())
app.use(secureHeaders.strictTransportSecurity({ maxAge: 31536000 }))
app.use(secureHeaders.xFrameOptions({ action: 'deny' }))

export default app
```

## Examples

### Minimal Security Headers

```js
app.use(secureHeaders({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: false,
  crossOriginResourcePolicy: false
}))
```

### Strict Security Configuration

```js
app.use(secureHeaders({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  strictTransportSecurity: {
    maxAge: 63072000,
    includeSubDomains: true,
    preload: true
  },
  xFrameOptions: {
    action: 'deny'
  },
  referrerPolicy: {
    policy: 'no-referrer'
  }
}))
```

### API Server Configuration

```js
app.use(secureHeaders({
  contentSecurityPolicy: false,
  xDownloadOptions: false,
  crossOriginResourcePolicy: {
    policy: 'cross-origin'
  }
}))
```

## Default Headers Set

By default, `secureHeaders()` sets the following headers:

* **Content-Security-Policy**: `default-src 'self'; base-uri 'self'; font-src 'self' https: data:; form-action 'self'; frame-ancestors 'self'; img-src 'self' data:; object-src 'none'; script-src 'self'; script-src-attr 'none'; style-src 'self' https: 'unsafe-inline'; upgrade-insecure-requests`
* **Cross-Origin-Opener-Policy**: `same-origin`
* **Cross-Origin-Resource-Policy**: `same-origin`
* **Origin-Agent-Cluster**: `?1`
* **Referrer-Policy**: `no-referrer`
* **Strict-Transport-Security**: `max-age=31536000; includeSubDomains`
* **X-Content-Type-Options**: `nosniff`
* **X-DNS-Prefetch-Control**: `off`
* **X-Download-Options**: `noopen`
* **X-Frame-Options**: `SAMEORIGIN`
* **X-Permitted-Cross-Domain-Policies**: `none`
* **X-XSS-Protection**: `0`
* Removes **X-Powered-By** header

Note: **Cross-Origin-Embedder-Policy** is disabled by default as it can break functionality if not properly configured.

## Related Headers

when you use `@hoajs/powered-by` middleware

```js
import { Hoa } from 'hoa'
import { poweredBy } from '@hoajs/powered-by'
app.use(poweredBy('MyApp'))
```

then you should disable x-powered-by header

```js
app.use(secureHeaders({
  xPoweredBy: false
}))
```

Another way to ensure `@hoajs/powered-by` middleware will set `X-Powered-By` headers correctly is to use `@hoajs/secure-headers` middleware first and then use `@hoajs/powered-by` middleware. Because `@hoajs/secure-headers` middleware default behavior is to remove `X-Powered-By` headers.

```js
app.use(secureHeaders())
app.use(poweredBy('MyApp'))
```
