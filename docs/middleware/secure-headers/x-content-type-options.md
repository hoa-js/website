# X-Content-Type-Options

The X-Content-Type-Options middleware sets the `X-Content-Type-Options` header to prevent browsers from MIME-sniffing responses away from the declared content-type.

## Quick Start

```js
import { Hoa } from 'hoa'
import { xContentTypeOptions } from '@hoajs/secure-headers'

const app = new Hoa()

// Prevent MIME-sniffing
app.use(xContentTypeOptions())

app.use(async (ctx) => {
  ctx.res.body = 'Hello, Hoa!'
})

export default app
```

## Options

This middleware takes no options. It always sets the header to `nosniff`.

## Examples

### Basic Usage

```js
// Sets: X-Content-Type-Options: nosniff
app.use(xContentTypeOptions())
```

## Behavior Details

- **MIME-Sniffing Prevention**: This header prevents browsers from trying to guess the MIME type of a response, forcing them to respect the `Content-Type` header set by the server.

- **Security**: MIME-sniffing can lead to security vulnerabilities. For example, a browser might interpret a text file as HTML and execute any scripts within it.

- **Best Practice**: Always set this header to `nosniff` for all responses.

## What is MIME-Sniffing?

MIME-sniffing is when browsers try to determine the content type of a resource by examining its content, rather than trusting the `Content-Type` header. This can lead to:
- Security vulnerabilities (e.g., executing scripts in uploaded files)
- Unexpected behavior
- Content type confusion attacks

## Common Use Cases

### All Applications (Recommended)

```js
// Always prevent MIME-sniffing
app.use(xContentTypeOptions())
```

### File Upload Applications

```js
// Especially important for applications that serve user-uploaded content
app.use(xContentTypeOptions())

app.post('/upload', async (ctx) => {
  // Handle file upload
  // The nosniff header prevents browsers from executing uploaded files
})
```

## Important Notes

- **No Configuration**: This middleware has no configuration options. It always sets `X-Content-Type-Options: nosniff`.

- **Always Recommended**: There are no legitimate reasons to allow MIME-sniffing, so this header should always be enabled.

- **Content-Type Required**: Make sure your application sets appropriate `Content-Type` headers for all responses.

- **Default Enabled**: This header is enabled by default in the main `secureHeaders()` middleware.

## Legacy Alias

This middleware can also be accessed as `noSniff`:

```js
import { noSniff } from '@hoajs/secure-headers'

app.use(noSniff())
```
