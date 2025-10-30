## Cross-Origin-Resource-Policy

The Cross-Origin-Resource-Policy (CORP) middleware sets the `Cross-Origin-Resource-Policy` header to control which origins can load the resource.

## Quick Start

```js
import { Hoa } from 'hoa'
import { crossOriginResourcePolicy } from '@hoajs/secure-headers'

const app = new Hoa()

// Use default policy (same-origin)
app.use(crossOriginResourcePolicy())

app.use(async (ctx) => {
  ctx.res.body = 'Hello, Hoa!'
})

export default app
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `policy` | `'same-origin' \| 'same-site' \| 'cross-origin'` | `'same-origin'` | The CORP policy to enforce. |

## Policy Values

| Value | Description |
| --- | --- |
| `'same-origin'` | Only same-origin requests can load the resource. |
| `'same-site'` | Same-site requests (including subdomains) can load the resource. |
| `'cross-origin'` | Any origin can load the resource. |

## Examples

### Same Origin (Default)

```js
// Only same origin can load resources
app.use(crossOriginResourcePolicy({
  policy: 'same-origin'
}))
```

### Same Site

```js
// Same site (including subdomains) can load resources
app.use(crossOriginResourcePolicy({
  policy: 'same-site'
}))
```

### Cross Origin

```js
// Any origin can load resources
app.use(crossOriginResourcePolicy({
  policy: 'cross-origin'
}))
```

## Behavior Details

- **Resource Protection**: CORP protects your resources from being loaded by cross-origin pages, helping prevent certain types of attacks like Spectre.

- **Same-Origin**: With `same-origin`, only pages from the exact same origin (same protocol, domain, and port) can load the resource.

- **Same-Site**: With `same-site`, pages from the same site (including subdomains) can load the resource. For example, `api.example.com` and `www.example.com` are same-site.

- **Cross-Origin**: With `cross-origin`, any origin can load the resource. This is useful for public APIs or CDN resources.

## Common Use Cases

### Web Application (Default)

```js
// Protect application resources
app.use(crossOriginResourcePolicy({
  policy: 'same-origin'
}))
```

### API with Subdomains

```js
// Allow subdomains to access API
app.use(crossOriginResourcePolicy({
  policy: 'same-site'
}))
```

### Public API or CDN

```js
// Allow any origin to access resources
app.use(crossOriginResourcePolicy({
  policy: 'cross-origin'
}))
```

### Mixed Configuration

```js
import { router } from '@hoajs/router'
import { crossOriginResourcePolicy } from '@hoajs/secure-headers'

const app = new Hoa()
app.extend(router())

// Protect private resources
app.get('/private/*', crossOriginResourcePolicy({ policy: 'same-origin' }))

// Allow public resources
app.get('/public/*', crossOriginResourcePolicy({ policy: 'cross-origin' }))
```

## Important Notes

- **COEP Compatibility**: When using `Cross-Origin-Embedder-Policy: require-corp`, all cross-origin resources must have a CORP header or be loaded with CORS.

- **Default Behavior**: Without CORP, browsers may allow cross-origin loading of resources, which could be exploited.

- **API Servers**: For public APIs meant to be consumed by any origin, use `cross-origin`.

## Related Headers

CORP works together with other cross-origin headers:

```js
import { 
  crossOriginResourcePolicy,
  crossOriginEmbedderPolicy,
  crossOriginOpenerPolicy
} from '@hoajs/secure-headers'

app.use(crossOriginResourcePolicy({ policy: 'same-origin' }))
app.use(crossOriginEmbedderPolicy({ policy: 'require-corp' }))
app.use(crossOriginOpenerPolicy({ policy: 'same-origin' }))
```

## Difference from CORS

- **CORS**: Controls whether a cross-origin request can read the response (opt-in by the server).
- **CORP**: Controls whether a resource can be loaded at all by cross-origin pages (opt-out by the server).

CORP is simpler and more restrictive than CORS. Use CORP to protect resources from being loaded, and CORS to control access to API responses.
