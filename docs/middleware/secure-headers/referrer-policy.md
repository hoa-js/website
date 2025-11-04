# Referrer-Policy

The Referrer-Policy middleware sets the `Referrer-Policy` header to control how much referrer information should be included with requests.

## Quick Start

```js
import { Hoa } from 'hoa'
import { referrerPolicy } from '@hoajs/secure-headers'

const app = new Hoa()

// Use default policy (no-referrer)
app.use(referrerPolicy())

app.use(async (ctx) => {
  ctx.res.body = 'Hello, Hoa!'
})

export default app
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `policy` | `ReferrerPolicyToken \| ReferrerPolicyToken[]` | `['no-referrer']` | One or more referrer policy tokens. |

## Available Policy Tokens

| Token | Description |
| --- | --- |
| `'no-referrer'` | Never send the Referer header. |
| `'no-referrer-when-downgrade'` | Send full URL when protocol security level stays the same (HTTPS→HTTPS), but don't send to less secure destinations (HTTPS→HTTP). |
| `'same-origin'` | Send full URL for same-origin requests, no referrer for cross-origin requests. |
| `'origin'` | Send only the origin (scheme, host, and port) in all cases. |
| `'strict-origin'` | Send origin when protocol security level stays the same (HTTPS→HTTPS), no referrer to less secure destinations (HTTPS→HTTP). |
| `'origin-when-cross-origin'` | Send full URL for same-origin requests, only origin for cross-origin requests. |
| `'strict-origin-when-cross-origin'` | Send full URL for same-origin requests, origin for cross-origin requests when protocol security level stays the same, no referrer to less secure destinations. |
| `'unsafe-url'` | Always send full URL (not recommended for privacy). |
| `''` | Empty string (legacy, equivalent to no-referrer-when-downgrade). |

## Examples

### No Referrer (Most Private)

```js
app.use(referrerPolicy({
  policy: 'no-referrer'
}))
```

### Same Origin Only

```js
app.use(referrerPolicy({
  policy: 'same-origin'
}))
```

### Strict Origin When Cross-Origin (Recommended)

```js
app.use(referrerPolicy({
  policy: 'strict-origin-when-cross-origin'
}))
```

### Origin Only

```js
app.use(referrerPolicy({
  policy: 'origin'
}))
```

### Multiple Policies (Fallback)

You can specify multiple policies for browser compatibility. Browsers will use the first policy they support:

```js
app.use(referrerPolicy({
  policy: ['no-referrer', 'strict-origin-when-cross-origin']
}))
```

### Unsafe URL (Not Recommended)

```js
// Always sends full URL including path and query string
// This can leak sensitive information
app.use(referrerPolicy({
  policy: 'unsafe-url'
}))
```

## Behavior Details

- **Privacy vs Functionality**: More restrictive policies (like `no-referrer`) provide better privacy but may break analytics or anti-CSRF measures that rely on the Referer header.

- **HTTPS Downgrade Protection**: Policies with `strict-origin` prevent sending referrer information when navigating from HTTPS to HTTP, protecting against information leakage.

- **Cross-Origin Considerations**: Policies like `same-origin` and `origin-when-cross-origin` help balance privacy with functionality for cross-origin requests.

## Recommended Policies

- **High Privacy**: `'no-referrer'` or `'same-origin'`
- **Balanced**: `'strict-origin-when-cross-origin'` or `'origin-when-cross-origin'`
- **Analytics-Friendly**: `'no-referrer-when-downgrade'` (browser default)

## Common Use Cases

### Public Website

```js
app.use(referrerPolicy({
  policy: 'strict-origin-when-cross-origin'
}))
```

### Privacy-Focused Application

```js
app.use(referrerPolicy({
  policy: 'no-referrer'
}))
```

### Internal Application

```js
app.use(referrerPolicy({
  policy: 'same-origin'
}))
```

### API Server

```js
app.use(referrerPolicy({
  policy: 'no-referrer'
}))
```
