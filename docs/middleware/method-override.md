# @hoajs/method-override

Middleware to override the HTTP method. Useful when clients are limited to sending `POST` or `GET`, but you need to perform actions like `DELETE`, `PUT`, or `PATCH` by declaring the target method in a conventional field.

Defaults:
- Applies only when the original method is included in `allowedMethods` (default `['POST']`).
- Reads the target method from three sources in order: `query -> form -> header`.
- `query` and `form` default to the key `_method`; `header` defaults to `x-http-method-override`.
- If the resolved method is not in the supported list, a 400 error is thrown.

## Quick Start

```js
import { Hoa } from 'hoa'
import { methodOverride } from '@hoajs/method-override'

const app = new Hoa()
app.use(methodOverride())

app.use(async (ctx) => {
  // POST http://localhost/?_method=DELETE -> ctx.req.method === 'DELETE'
  ctx.res.body = ctx.req.method
})

export default app
```

## Options

```ts
interface OverrideMiddlewareOptions {
  // Original methods that are allowed to be overridden; default ['POST']
  allowedMethods?: string[]

  // Key names for each source; pass false to disable a source
  sources?: {
    query?: string | false
    form?: string | false
    header?: string | false
  }
}
```

## Examples

Override via Query:

```bash
curl -X POST 'http://localhost:3000/?_method=DELETE'
# Response body will be 'DELETE'
```

Override via Header:

```bash
curl -X POST 'http://localhost:3000/' \
  -H 'x-http-method-override: PUT'
# Response body will be 'PUT'
```

Override via Form (urlencoded):

```bash
curl -X POST 'http://localhost:3000/' \
  -H 'content-type: application/x-www-form-urlencoded' \
  --data '_method=PATCH&name=alice'
# Response body will be 'PATCH'
```

Override via Form (multipart):  

```bash
curl -X POST 'http://localhost:3000/' \
  -F '_method=PROPFIND' -F 'file=@/path/to/file'
# Response body will be 'PROPFIND'
```

Enable overriding on `GET` requests as well:

```js
app.use(methodOverride({ allowedMethods: ['POST', 'GET'] }))
```

Disable the header source and allow only query/form:

```js
app.use(methodOverride({ sources: { header: false } }))
```

Change the query key to `__m` and the header key to `x-override`:

```js
app.use(methodOverride({
  sources: {
    query: '__m',
    header: 'x-override'
  }
}))
```
