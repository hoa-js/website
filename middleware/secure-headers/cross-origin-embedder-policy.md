---
url: /middleware/secure-headers/cross-origin-embedder-policy.md
---
# Cross-Origin-Embedder-Policy

The Cross-Origin-Embedder-Policy (COEP) middleware sets the `Cross-Origin-Embedder-Policy` header to control how the document can load cross-origin resources.

## Quick Start

```js
import { Hoa } from 'hoa'
import { crossOriginEmbedderPolicy } from '@hoajs/secure-headers'

const app = new Hoa()

// Use default policy (require-corp)
app.use(crossOriginEmbedderPolicy())

app.use(async (ctx) => {
  ctx.res.body = 'Hello, Hoa!'
})

export default app
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `policy` | `'require-corp' \| 'credentialless' \| 'unsafe-none'` | `'require-corp'` | The COEP policy to enforce. |

## Policy Values

| Value | Description |
| --- | --- |
| `'require-corp'` | Requires cross-origin resources to explicitly opt-in to being loaded via CORS or CORP headers. |
| `'credentialless'` | Allows loading cross-origin resources without CORS, but strips credentials from requests. |
| `'unsafe-none'` | No restrictions on loading cross-origin resources (disables COEP). |

## Examples

### Require CORP (Default)

```js
// Requires cross-origin resources to have proper CORS/CORP headers
app.use(crossOriginEmbedderPolicy({
  policy: 'require-corp'
}))
```

### Credentialless

```js
// Allows cross-origin resources but without credentials
app.use(crossOriginEmbedderPolicy({
  policy: 'credentialless'
}))
```

### Unsafe None

```js
// Disables COEP protection
app.use(crossOriginEmbedderPolicy({
  policy: 'unsafe-none'
}))
```

## Behavior Details

* **Cross-Origin Isolation**: COEP is required (along with COOP) to enable cross-origin isolation, which allows access to powerful features like `SharedArrayBuffer` and high-resolution timers.

* **Resource Loading**: With `require-corp`, all cross-origin resources (images, scripts, etc.) must either:
  * Be served with a `Cross-Origin-Resource-Policy` header
  * Be loaded with CORS (and include the `crossorigin` attribute)
  * Come from the same origin

* **Breaking Changes**: Enabling `require-corp` can break existing functionality if your site loads resources from third-party domains that don't set proper CORS/CORP headers.

* **Credentialless Mode**: The `credentialless` policy is a newer, less strict alternative that allows cross-origin resources but removes credentials (cookies, auth headers) from requests.

## Common Use Cases

### Enable Cross-Origin Isolation

```js
import { 
  crossOriginEmbedderPolicy, 
  crossOriginOpenerPolicy 
} from '@hoajs/secure-headers'

// Both headers are required for cross-origin isolation
app.use(crossOriginEmbedderPolicy({ policy: 'require-corp' }))
app.use(crossOriginOpenerPolicy({ policy: 'same-origin' }))
```

### Gradual Migration

```js
// Start with credentialless for easier migration
app.use(crossOriginEmbedderPolicy({
  policy: 'credentialless'
}))
```

### Disable COEP

```js
// Explicitly disable if not needed
app.use(crossOriginEmbedderPolicy({
  policy: 'unsafe-none'
}))
```

## Important Notes

* **Default Disabled**: In the main `secureHeaders()` middleware, COEP is disabled by default because it can break functionality if not properly configured.

* **Testing Required**: Always test thoroughly when enabling COEP, as it can prevent loading of third-party resources.

* **Browser Support**: Check browser compatibility before relying on COEP for security features.

## Related Headers

COEP works together with other cross-origin headers:

```js
import { 
  crossOriginEmbedderPolicy,
  crossOriginOpenerPolicy,
  crossOriginResourcePolicy
} from '@hoajs/secure-headers'

app.use(crossOriginEmbedderPolicy({ policy: 'require-corp' }))
app.use(crossOriginOpenerPolicy({ policy: 'same-origin' }))
app.use(crossOriginResourcePolicy({ policy: 'same-origin' }))
```
