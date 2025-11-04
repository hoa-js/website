# @hoajs/vary

`@hoajs/vary` adds `ctx.res.vary(field)` to Hoa responses to maintain the HTTP `Vary` header. It tells caches (CDN/browser/proxy) that this response varies based on certain request headers.

## Quick Start

```js
import { Hoa } from 'hoa'
import { vary } from '@hoajs/vary'

const app = new Hoa()
app.extend(vary())

app.use(async (ctx) => {
  // Different output per Origin
  ctx.res.vary('Origin')
  ctx.res.body = 'Hello, Hoa!'
})

export default app
```

## Examples

```js
// Append without duplication (case-insensitive comparison)
ctx.res.set('Vary', 'Accept')
ctx.res.vary('accEPT')
// -> Vary: Accept

// Preserve casing when appending
ctx.res.set('Vary', 'AccepT')
ctx.res.vary(['accEPT', 'ORIGIN'])
// -> Vary: AccepT, ORIGIN

// Special value *
ctx.res.vary('*')
// -> Vary: *

ctx.res.set('Vary', '*')
ctx.res.vary(['Origin', 'User-Agent'])
// -> Vary: *
```
