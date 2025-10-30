## X-Frame-Options

The X-Frame-Options middleware sets the `X-Frame-Options` header to protect against clickjacking attacks by controlling whether the page can be embedded in frames.

## Quick Start

```js
import { Hoa } from 'hoa'
import { xFrameOptions } from '@hoajs/secure-headers'

const app = new Hoa()

// Use default (SAMEORIGIN)
app.use(xFrameOptions())

app.use(async (ctx) => {
  ctx.res.body = 'Hello, Hoa!'
})

export default app
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `action` | `'deny' \| 'sameorigin'` | `'sameorigin'` | Controls frame embedding behavior. |

## Action Values

| Value | Description |
| --- | --- |
| `'deny'` | The page cannot be displayed in a frame, regardless of the site attempting to do so. |
| `'sameorigin'` | The page can only be displayed in a frame on the same origin as the page itself. |

## Examples

### Same Origin (Default)

```js
// Allows framing by same origin only
// Sets: X-Frame-Options: SAMEORIGIN
app.use(xFrameOptions())
```

### Deny All Framing

```js
// Completely prevents the page from being framed
// Sets: X-Frame-Options: DENY
app.use(xFrameOptions({
  action: 'deny'
}))
```

### Case Insensitive

```js
// These are all equivalent
app.use(xFrameOptions({ action: 'deny' }))
app.use(xFrameOptions({ action: 'DENY' }))
app.use(xFrameOptions({ action: 'Deny' }))
```

## Behavior Details

- **Clickjacking Protection**: This header helps prevent clickjacking attacks where an attacker embeds your site in an invisible iframe and tricks users into clicking on it.

- **Browser Support**: Widely supported by all modern browsers. For newer applications, consider using the `frame-ancestors` directive in Content-Security-Policy as well.

- **Same Origin**: When set to `SAMEORIGIN`, pages can be framed by other pages on the same domain, which is useful for legitimate use cases like admin panels or dashboards.

- **Deny**: When set to `DENY`, the page cannot be framed at all, providing maximum protection but preventing legitimate iframe usage.

## Common Use Cases

### Public Website (Allow Same Origin)

```js
app.use(xFrameOptions({
  action: 'sameorigin'
}))
```

### Login/Payment Pages (Deny All)

```js
app.use(xFrameOptions({
  action: 'deny'
}))
```

### Admin Panel (Same Origin)

```js
app.use(xFrameOptions({
  action: 'sameorigin'
}))
```

## Modern Alternative

For modern browsers, consider using Content-Security-Policy's `frame-ancestors` directive instead or in addition to X-Frame-Options:

```js
import { contentSecurityPolicy, xFrameOptions } from '@hoajs/secure-headers'

// Use both for maximum compatibility
app.use(xFrameOptions({ action: 'deny' }))
app.use(contentSecurityPolicy({
  directives: {
    frameAncestors: ["'none'"]
  }
}))
```

## Legacy Alias

This middleware can also be accessed as `frameguard`:

```js
import { frameguard } from '@hoajs/secure-headers'

app.use(frameguard({
  action: 'deny'
}))
```
