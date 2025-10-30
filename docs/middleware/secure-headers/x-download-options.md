## X-Download-Options

The X-Download-Options middleware sets the `X-Download-Options` header to prevent Internet Explorer from executing downloads in the site's context.

## Quick Start

```js
import { Hoa } from 'hoa'
import { xDownloadOptions } from '@hoajs/secure-headers'

const app = new Hoa()

// Prevent IE from executing downloads in site context
app.use(xDownloadOptions())

app.use(async (ctx) => {
  ctx.res.body = 'Hello, Hoa!'
})

export default app
```

## Options

This middleware takes no options. It always sets the header to `noopen`.

## Examples

### Basic Usage

```js
// Sets: X-Download-Options: noopen
app.use(xDownloadOptions())
```

## Behavior Details

- **Internet Explorer Specific**: This header is specific to Internet Explorer 8+ and prevents it from executing downloaded files in the context of your site.

- **Security**: Without this header, IE might execute downloaded HTML files in your site's security context, potentially allowing attackers to access cookies and other sensitive data.

- **Modern Browsers**: Modern browsers don't have this behavior, so this header mainly provides protection for legacy IE users.

## What Does "noopen" Mean?

When IE downloads a file, it can show an "Open" button that executes the file in the site's security context. Setting `X-Download-Options: noopen` prevents this, forcing users to save the file first before opening it.

## Common Use Cases

### All Applications (Recommended)

```js
// Protect legacy IE users
app.use(xDownloadOptions())
```

### File Download Applications

```js
// Especially important for applications that serve downloadable files
app.use(xDownloadOptions())

app.get('/download/:file', async (ctx) => {
  // Serve file for download
  // The noopen header prevents IE from executing it in site context
})
```

## Important Notes

- **No Configuration**: This middleware has no configuration options. It always sets `X-Download-Options: noopen`.

- **Legacy Support**: This header primarily benefits users of Internet Explorer 8 and later. Modern browsers don't need it.

- **No Downsides**: There are no downsides to setting this header, so it's recommended for all applications.

- **Default Enabled**: This header is enabled by default in the main `secureHeaders()` middleware.

## Legacy Alias

This middleware can also be accessed as `ieNoOpen`:

```js
import { ieNoOpen } from '@hoajs/secure-headers'

app.use(ieNoOpen())
```

## Related Security Measures

For comprehensive download security, combine with other headers:

```js
import { 
  xDownloadOptions,
  xContentTypeOptions,
  contentSecurityPolicy 
} from '@hoajs/secure-headers'

app.use(xDownloadOptions())
app.use(xContentTypeOptions())
app.use(contentSecurityPolicy())
```
