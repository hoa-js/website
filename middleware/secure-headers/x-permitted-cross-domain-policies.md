---
url: /middleware/secure-headers/x-permitted-cross-domain-policies.md
---
# X-Permitted-Cross-Domain-Policies

The X-Permitted-Cross-Domain-Policies middleware sets the `X-Permitted-Cross-Domain-Policies` header to control how Adobe Flash and PDF documents can access data across domains.

## Quick Start

```js
import { Hoa } from 'hoa'
import { xPermittedCrossDomainPolicies } from '@hoajs/secure-headers'

const app = new Hoa()

// Disable cross-domain policies (default)
app.use(xPermittedCrossDomainPolicies())

app.use(async (ctx) => {
  ctx.res.body = 'Hello, Hoa!'
})

export default app
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `permittedPolicies` | `'none' \| 'master-only' \| 'by-content-type' \| 'all'` | `'none'` | Controls which cross-domain policy files are allowed. |

## Policy Values

| Value | Description |
| --- | --- |
| `'none'` | No policy files are allowed anywhere on the target server, including the master policy file. |
| `'master-only'` | Only the master policy file (`/crossdomain.xml`) is allowed. |
| `'by-content-type'` | Only policy files served with `Content-Type: text/x-cross-domain-policy` are allowed. |
| `'all'` | All policy files on the target server are allowed. |

## Examples

### None (Default - Most Secure)

```js
// Sets: X-Permitted-Cross-Domain-Policies: none
app.use(xPermittedCrossDomainPolicies())

// Or explicitly
app.use(xPermittedCrossDomainPolicies({ 
  permittedPolicies: 'none' 
}))
```

### Master Only

```js
// Allow only the master policy file
app.use(xPermittedCrossDomainPolicies({ 
  permittedPolicies: 'master-only' 
}))
```

### By Content Type

```js
// Allow policy files with correct Content-Type
app.use(xPermittedCrossDomainPolicies({ 
  permittedPolicies: 'by-content-type' 
}))
```

### All (Least Secure)

```js
// Allow all policy files
app.use(xPermittedCrossDomainPolicies({ 
  permittedPolicies: 'all' 
}))
```

## Behavior Details

* **Adobe Flash/PDF**: This header controls how Adobe Flash Player and Adobe Acrobat/Reader access data across domains using policy files.

* **Legacy Technology**: Flash is deprecated and no longer supported by modern browsers. This header is mainly for legacy support.

* **Default None**: By default, this middleware sets the policy to `none`, which is the most secure option.

* **Policy Files**: Cross-domain policy files (`crossdomain.xml`) were used by Flash to determine which domains could access resources.

## What are Cross-Domain Policy Files?

Cross-domain policy files (`crossdomain.xml`) were XML files that Flash and PDF documents used to determine cross-domain access permissions. For example:

```xml
<?xml version="1.0"?>
<cross-domain-policy>
  <allow-access-from domain="*.example.com" />
</cross-domain-policy>
```

## Common Use Cases

### Modern Applications (Recommended)

```js
// Disable all cross-domain policies (Flash is deprecated)
app.use(xPermittedCrossDomainPolicies({ 
  permittedPolicies: 'none' 
}))
```

### Legacy Flash Applications

```js
// If you still need to support Flash
app.use(xPermittedCrossDomainPolicies({ 
  permittedPolicies: 'master-only' 
}))
```

### Conditional Configuration

```js
const hasLegacyFlash = process.env.LEGACY_FLASH === 'true'

app.use(xPermittedCrossDomainPolicies({ 
  permittedPolicies: hasLegacyFlash ? 'master-only' : 'none' 
}))
```

## Important Notes

* **Flash is Deprecated**: Adobe Flash Player reached end-of-life on December 31, 2020. Modern browsers no longer support it.

* **Default None**: Setting this to `none` is the most secure option and recommended for all modern applications.

* **No Downsides**: There are no downsides to setting this to `none` unless you specifically need to support legacy Flash content.

* **Default Enabled**: This header is set to `none` by default in the main `secureHeaders()` middleware.

## Legacy Alias

This middleware can also be accessed as `permittedCrossDomainPolicies`:

```js
import { permittedCrossDomainPolicies } from '@hoajs/secure-headers'

app.use(permittedCrossDomainPolicies({ 
  permittedPolicies: 'none' 
}))
```

## Historical Context

This header was important when Adobe Flash was widely used. Flash applications needed to load data from different domains, and the `crossdomain.xml` file controlled these permissions. With Flash deprecated, this header is now mainly set for defense-in-depth and to explicitly deny any legacy Flash content from accessing cross-domain resources.

## Related Security Measures

For comprehensive cross-origin security, combine with other headers:

```js
import { 
  xPermittedCrossDomainPolicies,
  crossOriginResourcePolicy,
  contentSecurityPolicy 
} from '@hoajs/secure-headers'

app.use(xPermittedCrossDomainPolicies({ permittedPolicies: 'none' }))
app.use(crossOriginResourcePolicy({ policy: 'same-origin' }))
app.use(contentSecurityPolicy())
```
