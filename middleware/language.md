---
url: /middleware/language.md
---
# @hoajs/language

`@hoajs/language` is a language detection middleware for Hoa. It automatically detects the user's preferred language from various sources and makes it available via `ctx.language`.

## Quick Start

```js
import { Hoa } from 'hoa'
import { language } from '@hoajs/language'
import { cookie } from '@hoajs/cookie'

const app = new Hoa()

// Cookie plugin is required for caching & detection
app.extend(cookie())

// Enable language detection with defaults
app.use(language())

app.use(async (ctx) => {
  ctx.res.body = `Hello, your language is: ${ctx.language}`
})

export default app
```

Route-scoped language detection:

```js
import { Hoa } from 'hoa'
import { router } from '@hoajs/router'
import { language } from '@hoajs/language'
import { cookie } from '@hoajs/cookie'

const app = new Hoa()
app.extend(router())
app.extend(cookie())

// Different language settings for different routes
app.get('/api', language({
  supportedLanguages: ['en', 'fr', 'de'],
  fallbackLanguage: 'en'
}), async (ctx) => {
  ctx.res.body = { language: ctx.language }
})

app.get('/admin', language({
  supportedLanguages: ['en'],
  fallbackLanguage: 'en',
  order: ['header'] // Only check Accept-Language header
}), async (ctx) => {
  ctx.res.body = { language: ctx.language }
})

export default app
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `order` | `DetectorType[]` | `['querystring', 'cookie', 'header']` | Order of language detection strategies. |
| `lookupQueryString` | `string` | `'lang'` | Query parameter name for language detection. |
| `lookupCookie` | `string` | `'language'` | Cookie name for language detection. |
| `lookupFromPathIndex` | `number` | `0` | Index in URL path where language code appears. |
| `lookupFromHeaderKey` | `string` | `'accept-language'` | Header key for language detection. |
| `caches` | `CacheType[] \| false` | `['cookie']` | Caching strategies. Set to `false` to disable caching. |
| `ignoreCase` | `boolean` | `true` | Whether to ignore case in language codes. |
| `fallbackLanguage` | `string` | `'en'` | Default language if none detected. |
| `supportedLanguages` | `string[]` | `['en']` | List of supported language codes. |
| `convertDetectedLanguage` | `(lang: string) => string` | `undefined` | Optional function to transform detected language codes. |
| `debug` | `boolean` | `false` | Enable debug logging. |

## Detection Strategies

The middleware supports multiple detection strategies that are tried in order:

### Query String Detection

Detects language from URL query parameters:

```
https://example.com/?lang=fr
```

### Cookie Detection

Detects language from cookies using the specified cookie name. Requires the `@hoajs/cookie` plugin.

### Header Detection

Detects language from the `Accept-Language` HTTP header, parsing quality values and selecting the best match.

### Path Detection

Detects language from URL path segments:

```
https://example.com/en/products  // Detects 'en' from path
```

## Behavior Details

* **Language Normalization**
  * Detected languages are trimmed and optionally case-insensitive
  * Custom transformation can be applied via `convertDetectedLanguage`
  * Only languages in `supportedLanguages` are accepted

* **Fallback Logic**
  * If no language is detected from any strategy, uses `fallbackLanguage`
  * Fallback language must be included in `supportedLanguages`

* **Caching**
  * When `caches: ['cookie']` is enabled, detected language is stored in a cookie
  * Cookie caching requires the `@hoajs/cookie` plugin
  * Set `caches: false` to disable caching

* **Error Handling**
  * Detection errors are logged (if debug enabled) and don't break the middleware
  * Invalid detector configurations throw errors during initialization

## Examples

Basic setup with multiple languages:

```js
app.use(language({
  supportedLanguages: ['en', 'fr', 'de', 'es', 'ja'],
  fallbackLanguage: 'en'
}))
```

Custom detection order:

```js
app.use(language({
  order: ['path', 'querystring', 'header'],
  lookupFromPathIndex: 0,
  caches: false // Disable cookie caching
}))
```

Path-based language detection:

```js
// For URLs like /en/home, /fr/contact
app.use(language({
  order: ['path'],
  lookupFromPathIndex: 0,
  supportedLanguages: ['en', 'fr', 'de'],
  fallbackLanguage: 'en'
}))
```

Custom language transformation:

```js
app.use(language({
  supportedLanguages: ['en-US', 'fr-FR', 'de-DE'],
  convertDetectedLanguage: (lang) => {
    // Convert 'en' to 'en-US', 'fr' to 'fr-FR', etc.
    const shortCode = lang.split('-')[0]
    return `${shortCode}-${shortCode.toUpperCase()}`
  }
}))
```

Header-only detection (no caching):

```js
app.use(language({
  order: ['header'],
  caches: false,
  supportedLanguages: ['en', 'fr'],
  fallbackLanguage: 'en'
}))
```

Debug mode for development:

```js
app.use(language({
  supportedLanguages: ['en', 'fr', 'de'],
  debug: true // Logs detection attempts and results
}))
```

## Requirements

* The cookie plugin (e.g., `@hoajs/cookie`) is required when using cookie caching & detection
* Fallback language must be included in supported languages
* Path index must be non-negative
