---
url: /middleware/context-storage.md
---
# @hoajs/context-storage

Context storage middleware for Hoa.

Note: This middleware uses AsyncLocalStorage. The runtime should support it.
Cloudflare Workers: To enable AsyncLocalStorage, add the `nodejs_compat` or `nodejs_als` flag to your wrangler file.

## Quick Start

```js
import { Hoa } from 'hoa'
import { contextStorage, getContext } from '@hoajs/context-storage'

const app = new Hoa()
app.use(contextStorage())

app.use(async (ctx, next) => {
  ctx.state.requestId = crypto.randomUUID()
  await next()
})

app.use(async (ctx, next) => {
  log('Request start')
  await doSomething()
  log('Request end')
})

function log (msg) {
  const ctx = getContext()
  console.log(`[${ctx.state.requestId}] ${msg}`)
}

export default app
```
