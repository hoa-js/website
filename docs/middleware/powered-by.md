## @hoajs/powered-by

`@hoajs/powered-by` is a middleware for Hoa that adds a `X-Powered-By` header to responses.

## Quick Start

```js
import { Hoa } from 'hoa'
import { poweredBy } from '@hoajs/powered-by'

const app = new Hoa()

// Enable PoweredBy middleware for all routes with defaults
app.use(poweredBy('MyApp'))

app.use(async (ctx) => {
  ctx.res.body = 'Hello, Hoa!'
})

export default app
```

## Options

| Option                | Type | Default | Description                                |
|-----------------------| --- | --- |--------------------------------------------|
| `serverName`          | `string` | `'Hoa'` | Server name to set in `X-Powered-By` header. |

