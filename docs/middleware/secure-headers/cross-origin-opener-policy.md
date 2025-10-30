## Cross-Origin-Opener-Policy

The Cross-Origin-Opener-Policy (COOP) middleware sets the `Cross-Origin-Opener-Policy` header to control how the document can be opened by cross-origin documents.

## Quick Start

```js
import { Hoa } from 'hoa'
import { crossOriginOpenerPolicy } from '@hoajs/secure-headers'

const app = new Hoa()

// Use default policy (same-origin)
app.use(crossOriginOpenerPolicy())

app.use(async (ctx) => {
  ctx.res.body = 'Hello, Hoa!'
})

export default app
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `policy` | `'same-origin' \| 'same-origin-allow-popups' \| 'unsafe-none'` | `'same-origin'` | The COOP policy to enforce. |

## Policy Values

| Value | Description |
| --- | --- |
| `'same-origin'` | Isolates the browsing context to same-origin documents only. Cross-origin documents cannot access this document. |
| `'same-origin-allow-popups'` | Allows the document to retain references to popups that don't set COOP or set it to `unsafe-none`. |
| `'unsafe-none'` | No restrictions on cross-origin access (disables COOP). |

## Examples

### Same Origin (Default)

```js
// Strict isolation - only same-origin documents can access
app.use(crossOriginOpenerPolicy({
  policy: 'same-origin'
}))
```

### Same Origin Allow Popups

```js
// Allows popups to be opened without COOP
app.use(crossOriginOpenerPolicy({
  policy: 'same-origin-allow-popups'
}))
```

### Unsafe None

```js
// Disables COOP protection
app.use(crossOriginOpenerPolicy({
  policy: 'unsafe-none'
}))
```

## Behavior Details

- **Cross-Origin Isolation**: COOP is required (along with COEP) to enable cross-origin isolation, which allows access to powerful features like `SharedArrayBuffer` and high-resolution timers.

- **Window References**: With `same-origin`, cross-origin documents opened via `window.open()` or links with `target="_blank"` will not be able to access the opener window, and vice versa.

- **Popup Handling**: The `same-origin-allow-popups` policy allows your page to open popups that don't have COOP set, while still maintaining isolation from other cross-origin documents.

- **Breaking Changes**: Setting COOP to `same-origin` can break functionality that relies on cross-origin window communication.

## Common Use Cases

### Strict Isolation

```js
// Maximum security - complete isolation
app.use(crossOriginOpenerPolicy({
  policy: 'same-origin'
}))
```

### OAuth/Payment Flows

```js
// Allow popups for OAuth or payment providers
app.use(crossOriginOpenerPolicy({
  policy: 'same-origin-allow-popups'
}))
```

### Enable Cross-Origin Isolation

```js
import { 
  crossOriginOpenerPolicy,
  crossOriginEmbedderPolicy 
} from '@hoajs/secure-headers'

// Both headers required for cross-origin isolation
app.use(crossOriginOpenerPolicy({ policy: 'same-origin' }))
app.use(crossOriginEmbedderPolicy({ policy: 'require-corp' }))
```

### Disable COOP

```js
// Explicitly disable if not needed
app.use(crossOriginOpenerPolicy({
  policy: 'unsafe-none'
}))
```

## Important Notes

- **Window Communication**: `same-origin` policy breaks `window.opener` and `window.open()` references between cross-origin documents.

- **Third-Party Integrations**: If your application opens third-party windows (OAuth, payment gateways), consider using `same-origin-allow-popups`.

- **Testing Required**: Always test cross-origin interactions when enabling COOP.

## Related Headers

COOP works together with other cross-origin headers:

```js
import { 
  crossOriginOpenerPolicy,
  crossOriginEmbedderPolicy,
  crossOriginResourcePolicy
} from '@hoajs/secure-headers'

app.use(crossOriginOpenerPolicy({ policy: 'same-origin' }))
app.use(crossOriginEmbedderPolicy({ policy: 'require-corp' }))
app.use(crossOriginResourcePolicy({ policy: 'same-origin' }))
```

## Checking Cross-Origin Isolation

You can check if cross-origin isolation is enabled in the browser:

```js
// In browser JavaScript
if (window.crossOriginIsolated) {
  console.log('Cross-origin isolation is enabled')
  // Can now use SharedArrayBuffer, etc.
}
```
