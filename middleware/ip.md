---
url: /middleware/ip.md
---
# @hoajs/ip

IP restriction middleware for Hoa. It allows or denies requests based on client IP using static addresses, CIDR notation, regular expressions, or custom functions.

## Quick Start

```js
import { Hoa } from 'hoa'
import { ip } from '@hoajs/ip'

const app = new Hoa()

app.use(ip({
  // By default, client IP is read from 'CF-Connecting-IP' header.
  // getIp: (ctx) => ctx.req.get('CF-Connecting-IP'),
  allowList: ['127.0.0.1', '::1'],
  denyList: ['203.0.113.0/24', /1.2.3.[0-9]{1,3}/],
  denyHandler: (ctx) => ctx.throw(403, 'Forbidden')
}))

app.use(async (ctx) => {
  ctx.res.body = 'Hello, Hoa!'
})

export default app
```

## Options

| Option | Type | Description |
|---|---|---|
| `getIp` | `(ctx) => string \| null \| undefined` | Resolve client IP from context. Defaults to reading `CF-Connecting-IP`. |
| `allowList` | `IPRule[]` | Rules that allow a request when matched. If empty, all requests are allowed unless denied by `denyList`. |
| `denyList` | `IPRule[]` | Rules that deny a request when matched. |
| `denyHandler` | `(ctx) => void \| Promise<void>` | Invoked when a request is denied or IP is missing; mutate `ctx.res` or throw (`ctx.throw(403, 'Forbidden')`). Return values are ignored. |

## Examples

Basic allow/deny:

```js
app.use(ip({
  allowList: ['127.0.0.1', '::1'],
  denyList: ['203.0.113.0/24']
}))
```

Regex rules:

```js
app.use(ip({
  allowList: [/^8\.8\.8\.[0-3]$/],
  denyList: [/^8\.8\.8\.2$/]
}))
```

Function rule (IPv6 only):

```js
app.use(ip({
  allowList: [(remote) => remote.type === 'IPv6']
}))
```

Custom `getIp` with fallbacks:

```js
app.use(ip({
  getIp: (ctx) =>
    ctx.req.get('CF-Connecting-IP') ||
    ctx.req.get('X-Real-IP') ||
    ctx.req.get('X-Forwarded-For')?.split(',')[0]?.trim()
}))
```

Match-all with override:

```js
app.use(ip({
  allowList: ['*'],
  denyList: ['203.0.113.10']
}))
```

Priority (deny overrides allow):

```js
app.use(ip({
  // Even if allowed, denyList takes precedence and blocks the request
  allowList: ['127.0.0.0/8'],
  denyList: ['127.0.0.1']
}))
```

Allow only private IPv4 (common enterprise):

```js
app.use(ip({
  // Only private ranges are allowed; everything else is denied
  allowList: [
    '10.0.0.0/8',
    '172.16.0.0/12',
    '192.168.0.0/16'
  ]
}))
```

Custom deny handler:

```js
app.use(ip({
  getIp: () => undefined,
  denyHandler: (ctx) => {
    ctx.res.status = 418
    ctx.res.body = 'No IP'
    // or
    // ctx.throw(418, 'No IP')
  }
}))
```
