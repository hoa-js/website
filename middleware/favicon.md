---
url: /middleware/favicon.md
---
# @hoajs/favicon

Favicon middleware for Hoa. Serves a favicon.ico file from base64 data or returns an empty response.

## Quick Start

```js
import { Hoa } from 'hoa'
import { favicon } from '@hoajs/favicon'

const app = new Hoa()
app.use(favicon())

app.use(async (ctx) => {
  ctx.res.body = 'Hello, Hoa!'
})

export default app
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `base64` | `string` | `undefined` | Base64 encoded favicon data (without data URI prefix). |
| `mime` | `string` | `'image/x-icon'` | MIME type for Content-Type header. |
| `maxAge` | `number` | `86400` | Cache duration in seconds (default: 1 day). |

## Examples

### Empty Favicon

Returns an empty favicon with status 200:

```js
app.use(favicon())
```

### Base64 Favicon

Serve a favicon from base64 encoded data:

```js
app.use(favicon({
  base64: 'AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAA...'
}))
```

### Custom MIME Type

Serve a PNG favicon instead of ICO:

```js
app.use(favicon({
  base64: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  mime: 'image/png'
}))
```

### Custom Cache Duration

Set cache to 1 hour (3600 seconds):

```js
app.use(favicon({
  base64: 'xxx',
  maxAge: 3600
}))
```

### Disable Caching

```js
app.use(favicon({
  base64: 'xxx',
  maxAge: 0
}))
```

## Notes

* The middleware only responds to `/favicon.ico` requests.
* Only GET and HEAD methods are handled; other methods pass through to the next middleware.
* The base64 data is decoded once during initialization for better performance.
* Cache-Control header is set to `public, max-age=<maxAge>`.
* If no base64 data is provided, an empty response with status 200 is returned.
