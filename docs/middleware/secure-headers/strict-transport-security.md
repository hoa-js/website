# Strict-Transport-Security

The Strict-Transport-Security (HSTS) middleware sets the `Strict-Transport-Security` header to tell browsers to only access the site over HTTPS.

## Quick Start

```js
import { Hoa } from 'hoa'
import { strictTransportSecurity } from '@hoajs/secure-headers'

const app = new Hoa()

// Use default HSTS settings (1 year, includeSubDomains)
app.use(strictTransportSecurity())

app.use(async (ctx) => {
  ctx.res.body = 'Hello, Hoa!'
})

export default app
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `maxAge` | `number` | `31536000` (1 year) | Time in seconds that the browser should remember to only access the site over HTTPS. |
| `includeSubDomains` | `boolean` | `true` | If `true`, applies the rule to all subdomains. |
| `preload` | `boolean` | `false` | If `true`, allows the site to be included in browsers' HSTS preload lists. |

## Examples

### Default Configuration

```js
// Sets: Strict-Transport-Security: max-age=31536000; includeSubDomains
app.use(strictTransportSecurity())
```

### Custom Max Age

```js
// 2 years
app.use(strictTransportSecurity({
  maxAge: 63072000
}))
```

### Without Subdomains

```js
app.use(strictTransportSecurity({
  maxAge: 31536000,
  includeSubDomains: false
}))
```

### With Preload

```js
app.use(strictTransportSecurity({
  maxAge: 63072000,
  includeSubDomains: true,
  preload: true
}))
```

## Behavior Details

- **Max Age**: Specifies how long (in seconds) the browser should remember to only access the site over HTTPS. Common values:
  - `31536000` - 1 year (default)
  - `63072000` - 2 years
  - `15768000` - 6 months
  
- **Include Subdomains**: When enabled, the HSTS policy applies to all subdomains. Be careful with this option if you have subdomains that don't support HTTPS.

- **Preload**: Allows your site to be included in browsers' HSTS preload lists. Before enabling this:
  - Set `maxAge` to at least 1 year (31536000 seconds)
  - Enable `includeSubDomains`
  - Ensure all subdomains support HTTPS
  - Submit your domain to the [HSTS preload list](https://hstspreload.org/)

## Legacy Alias

This middleware can also be accessed as `hsts`:

```js
import { hsts } from '@hoajs/secure-headers'

app.use(hsts({
  maxAge: 31536000
}))
```
