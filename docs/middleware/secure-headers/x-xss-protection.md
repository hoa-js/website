## X-XSS-Protection

The X-XSS-Protection middleware sets the `X-XSS-Protection` header to control the browser's XSS filter. Modern best practice is to disable it.

## Quick Start

```js
import { Hoa } from 'hoa'
import { xXssProtection } from '@hoajs/secure-headers'

const app = new Hoa()

// Disable XSS filter (recommended)
app.use(xXssProtection())

app.use(async (ctx) => {
  ctx.res.body = 'Hello, Hoa!'
})

export default app
```

## Options

This middleware takes no options. It always sets the header to `0` (disabled).

## Examples

### Basic Usage

```js
// Sets: X-XSS-Protection: 0
app.use(xXssProtection())
```

## Behavior Details

- **Disabled by Default**: This middleware sets the header to `0`, which disables the browser's XSS filter.

- **Why Disable?**: The XSS filter has been found to introduce security vulnerabilities and can be exploited by attackers. Modern browsers like Chrome have removed it entirely.

- **Better Alternative**: Use Content-Security-Policy instead, which provides much better XSS protection without the vulnerabilities of the XSS filter.

- **Legacy Browsers**: Older browsers (IE, old Edge, old Safari) still have XSS filters, so this header tells them to disable it.

## Why Set to 0?

Historically, `X-XSS-Protection: 1` enabled the browser's XSS filter. However:
- The filter can be bypassed
- It can introduce new vulnerabilities
- It can break legitimate functionality
- Modern browsers have removed it
- Content-Security-Policy is a better solution

Setting it to `0` explicitly disables the filter to prevent potential issues.

## Common Use Cases

### All Applications (Recommended)

```js
// Disable the XSS filter
app.use(xXssProtection())
```

### With Content-Security-Policy

```js
import { xXssProtection, contentSecurityPolicy } from '@hoajs/secure-headers'

// Disable XSS filter and use CSP instead
app.use(xXssProtection())
app.use(contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"]
  }
}))
```

## Important Notes

- **No Configuration**: This middleware has no configuration options. It always sets `X-XSS-Protection: 0`.

- **Modern Best Practice**: Disabling the XSS filter is the modern best practice. Use Content-Security-Policy for XSS protection instead.

- **Browser Support**: 
  - Chrome: Removed XSS filter in Chrome 78
  - Firefox: Never had an XSS filter
  - Safari: Still has XSS filter (as of 2024)
  - Edge: Removed XSS filter (Chromium-based)

- **Default Enabled**: This header is set to `0` by default in the main `secureHeaders()` middleware.

## Legacy Alias

This middleware can also be accessed as `xssFilter`:

```js
import { xssFilter } from '@hoajs/secure-headers'

app.use(xssFilter())
```

## Better XSS Protection

Instead of relying on the browser's XSS filter, use Content-Security-Policy:

```js
import { contentSecurityPolicy } from '@hoajs/secure-headers'

app.use(contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    objectSrc: ["'none'"],
    baseUri: ["'self'"]
  }
}))
```

## Historical Context

The `X-XSS-Protection` header had these values:
- `0`: Disable XSS filter (recommended)
- `1`: Enable XSS filter (not recommended)
- `1; mode=block`: Enable and block page (not recommended)

This middleware always uses `0` because the XSS filter has been deprecated and removed from modern browsers.
