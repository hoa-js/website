## X-DNS-Prefetch-Control

The X-DNS-Prefetch-Control middleware sets the `X-DNS-Prefetch-Control` header to control DNS prefetching, which can improve performance but may have privacy implications.

## Quick Start

```js
import { Hoa } from 'hoa'
import { xDnsPrefetchControl } from '@hoajs/secure-headers'

const app = new Hoa()

// Disable DNS prefetching (default)
app.use(xDnsPrefetchControl())

app.use(async (ctx) => {
  ctx.res.body = 'Hello, Hoa!'
})

export default app
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `allow` | `boolean` | `false` | If `true`, enables DNS prefetching. If `false`, disables it. |

## Examples

### Disable DNS Prefetching (Default)

```js
// Sets: X-DNS-Prefetch-Control: off
app.use(xDnsPrefetchControl())

// Or explicitly
app.use(xDnsPrefetchControl({ allow: false }))
```

### Enable DNS Prefetching

```js
// Sets: X-DNS-Prefetch-Control: on
app.use(xDnsPrefetchControl({ allow: true }))
```

## Behavior Details

- **DNS Prefetching**: Browsers can prefetch DNS lookups for links on the page to reduce latency when users click on them.

- **Performance**: Enabling DNS prefetching can improve perceived performance by reducing the time it takes to navigate to linked pages.

- **Privacy**: DNS prefetching can leak information about which links are on a page, even if the user doesn't click them. This can be a privacy concern.

- **Default Off**: By default, this middleware disables DNS prefetching for better privacy.

## What is DNS Prefetching?

DNS prefetching is when browsers proactively perform DNS lookups for links on the page before the user clicks them. This can:
- **Improve performance**: Reduce latency when navigating to linked pages
- **Privacy concerns**: Leak information about page content to DNS servers
- **Increase traffic**: Generate additional DNS queries

## Common Use Cases

### Privacy-Focused Applications (Default)

```js
// Disable DNS prefetching for better privacy
app.use(xDnsPrefetchControl({ allow: false }))
```

### Performance-Focused Public Websites

```js
// Enable DNS prefetching for better performance
app.use(xDnsPrefetchControl({ allow: true }))
```

### Conditional Configuration

```js
const isPublicSite = process.env.SITE_TYPE === 'public'

app.use(xDnsPrefetchControl({ 
  allow: isPublicSite 
}))
```

## Important Notes

- **Privacy vs Performance**: Disabling DNS prefetching improves privacy but may slightly reduce performance.

- **HTTPS**: DNS prefetching is automatically disabled for HTTPS pages in some browsers for security reasons.

- **User Control**: Users can also control DNS prefetching through browser settings.

- **Default Disabled**: This header is set to `off` by default in the main `secureHeaders()` middleware.

## Legacy Alias

This middleware can also be accessed as `dnsPrefetchControl`:

```js
import { dnsPrefetchControl } from '@hoajs/secure-headers'

app.use(dnsPrefetchControl({ allow: false }))
```

## Manual Control in HTML

You can also control DNS prefetching per-link in HTML:

```html
<!-- Force DNS prefetch for a specific link -->
<link rel="dns-prefetch" href="https://example.com">

<!-- Disable DNS prefetch for a specific link -->
<a href="https://example.com" rel="noreferrer">Link</a>
```
