## @hoajs/bodyparser

Body parser middleware for Hoa that parses request bodies based on Content-Type and assigns the parsed result to `ctx.req.body`.

## Quick Start

```js
import { Hoa } from 'hoa'
import { bodyParser } from '@hoajs/bodyparser'

const app = new Hoa()
app.use(bodyParser())

app.use(async (ctx) => {
  ctx.res.body = ctx.req.body
})

await app.listen(3000)
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `enableTypes` | `('json' \| 'form' \| 'text')[]` | `['json','form']` | Enabled parse targets. When a type is not enabled, bodies of that type are not parsed. |
| `parsedMethods` | `string[]` | `['POST','PUT','PATCH']` | HTTP methods whose bodies will be parsed (case-insensitive). Requests with other methods are skipped. |
| `formLimit` | `number \| string` | `'56kb'` | Size limit for `application/x-www-form-urlencoded`. Accepts numbers (bytes) or strings like `'56kb'`, `'1mb'`. |
| `jsonLimit` | `number \| string` | `'1mb'` | Size limit for JSON bodies. Same format as `formLimit`. |
| `textLimit` | `number \| string` | `'1mb'` | Size limit for `text/plain` bodies. Same format as `formLimit`. |
| `extendTypes` | `{ json?: string[]; form?: string[]; text?: string[] }` | `{}` | Extra MIME types merged into built-ins for type matching. Values are normalized to lowercase and deduplicated. |
| `useClone` | `boolean` | `true` | Read body via `Request.clone().blob()` when `true` (does not consume original stream); use `ctx.req.blob()` when `false` (consumes original stream). |
| `onError` | `(err: Error, ctx: HoaContext) => void` | `undefined` | Custom error handler. If provided, errors are not thrown; you are responsible for setting response status and body. |

### Limit format
- Supports number (bytes), or string units: `b` / `kb` / `mb` / `gb` (case-insensitive, decimals allowed)
  - Examples: `1024`, `'56kb'`, `'1mb'`, `'2.5mb'`, `'1gb'`
- Invalid format will throw (or be handled by `onError`).

## Examples

### Parse JSON
```js
app.use(bodyParser())
app.use(async (ctx) => {
  // Request: Content-Type: application/json, body: {"foo":1}
  ctx.res.body = ctx.req.body // => { foo: 1 }
})
```

### Parse form (x-www-form-urlencoded)
```js
app.use(bodyParser())
app.use(async (ctx) => {
  // Request: Content-Type: application/x-www-form-urlencoded, body: a=1&a=2&b=3
  ctx.res.body = ctx.req.body // => { a: ['1', '2'], b: '3' }
})
```

### Parse only specific methods
```js
app.use(bodyParser({ parsedMethods: ['POST'] }))
```

### Parse plain text
```js
app.use(bodyParser({ enableTypes: ['text'] }))
app.use(async (ctx) => {
  // Request: Content-Type: text/plain, body: "hello"
  ctx.res.body = ctx.req.body // => "hello"
})
```

### Extend MIME types
```js
app.use(bodyParser({
  extendTypes: { json: ['application/hal+json'] }
}))
```

### Control size limits
```js
app.use(bodyParser({
  jsonLimit: '2mb',
  formLimit: 100 * 1024, // 100KB
  textLimit: '100kb'
}))
```
