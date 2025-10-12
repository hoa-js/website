## @hoajs/cookie

Provides cookie read/write capabilities on request/response. Supports plain and signed cookies, prefix constraints (__Secure- / __Host-), and modern attributes like Partitioned.

## Quick Start

```ts
import { Hoa } from 'hoa'
import { cookie } from '@hoajs/cookie'

const app = new Hoa()
app.extend(cookie({
  secret: 'your-secret',
  defaultOptions: {
    signed: false,
    path: '/',
    httpOnly: true,
    secure: false,
    sameSite: 'Lax',
    maxAge: 7 * 24 * 60 * 60
  }
}))

app.use(async (ctx) => {
  const name = await ctx.req.getCookie('name')
  ctx.res.body = `Hello, ${name}!`
})

export default app
```

## API

- ctx.req.getCookie()
- ctx.req.setCookie()
- ctx.req.deleteCookie()
- ctx.res.getCookie()
- ctx.res.setCookie()
- ctx.res.deleteCookie()

#### getCookie(name, opts?): Promise\<string | undefined | false\>

- name: string - logical cookie name (without __Secure- / __Host- prefix)
- opts?: object
  - prefix?: 'secure' | 'host' - match cookies written with __Secure- or __Host- prefixes
  - signed?: boolean - verify and decode signed cookie; returns false if signature is invalid; returns undefined if the cookie is missing or the adapter secret is not provided

#### setCookie(name, value, opts?): Promise\<void\>

- name: string - logical cookie name (prefix applied automatically when opts.prefix is set)
- value: string - cookie value
- opts?: object
  - path?: string, default '/'
  - domain?: string
  - maxAge?: number - seconds; effective when >= 0; floored
  - expires?: Date
  - httpOnly?: boolean
  - secure?: boolean
  - sameSite?: 'Lax' | 'Strict' | 'None'
  - priority?: 'Low' | 'Medium' | 'High'
  - partitioned?: boolean - requires secure=true
  - prefix?: 'secure' | 'host'
    - secure: writes as __Secure-\<name\>; enforces secure=true and path='/'
    - host: writes as __Host-\<name\>; enforces secure=true and path='/'; strips domain
  - signed?: boolean - requires adapter secret; uses HMAC-SHA256 to generate a signature

#### deleteCookie(name): Promise\<void\>

- name: string - logical cookie name; deletes by setting Max-Age=0

## Examples

Write and read a plain cookie:

```ts
await ctx.req.setCookie('lang', 'zh-CN', { httpOnly: true })
const lang = await ctx.req.getCookie('lang') // 'zh-CN'
```

Write a signed cookie:

```ts
await ctx.res.setCookie('sid', 'abc123', { signed: true, secure: true, sameSite: 'Lax' })
const sid = await ctx.res.getCookie('sid', { signed: true }) // returns plaintext if signature is valid, otherwise false
```

Write/read with prefix:

```ts
await ctx.res.setCookie('id', '123', { prefix: 'secure' }) // actual name: __Secure-id
const id = await ctx.res.getCookie('id', { prefix: 'secure' })
```

Delete cookie:

```ts
await ctx.res.deleteCookie('id')
```
