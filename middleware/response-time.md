---
url: /middleware/response-time.md
---
# @hoajs/response-time

Response time middleware for Hoa. It measures the elapsed time using `performance.now()` across your downstream middleware and handlers, and writes the duration to a response header (default `X-Response-Time`).

## Quick Start

```js
import { Hoa } from 'hoa'
import { responseTime } from '@hoajs/response-time'

const app = new Hoa()

app.use(responseTime())

app.use(async (ctx) => {
  ctx.res.body = 'Hello, Hoa!'
})

export default app
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `digits` | `number` | `0` | Number of fractional digits to keep when formatting milliseconds. If non-finite (e.g., `NaN`, `Infinity`), the raw string value `String(deltaMs)` is used. |
| `header` | `string` | `'X-Response-Time'` | Response header name to set. |
| `suffix` | `boolean` | `true` | Whether to append the `ms` suffix to the header value. |

## Examples

* Specify fractional digits:

```js
app.use(responseTime({ digits: 3 }))
// e.g. X-Response-Time: '12.345ms'
```

* Disable `ms` suffix:

```js
app.use(responseTime({ digits: 2, suffix: false }))
// e.g. X-Response-Time: '12.34'
```

* Custom header name:

```js
app.use(responseTime({ header: 'Response-Time' }))
// e.g. Response-Time: '15ms'
```
