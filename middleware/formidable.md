---
url: /middleware/formidable.md
---
# @hoajs/formidable

Formidable middleware for Hoa that parses `multipart/form-data` requests using the [formidable](https://github.com/node-formidable/formidable) library. Parses form fields and assigns them to `ctx.req.body`, while uploaded files are assigned to `ctx.req.files`. Designed for use with `@hoajs/adapter` in Node.js environment.

## Quick Start

```js
import { Hoa } from 'hoa'
import { nodeServer } from '@hoajs/adapter'
import { hoaFormidable } from '@hoajs/formidable'

const app = new Hoa()
app.extend(nodeServer())
app.use(hoaFormidable())

app.use(async (ctx) => {
  // Form fields are available in ctx.req.body
  // Uploaded files are available in ctx.req.files
  ctx.res.body = {
    fields: ctx.req.body,
    files: (ctx.req as any).files
  }
})

await app.listen(3000)
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `parsedMethods` | `string[]` | `['POST','PUT','PATCH']` | HTTP methods whose bodies will be parsed (case-insensitive). Requests with other methods are skipped. |
| `onError` | `(err: Error, ctx: HoaContext) => void` | `undefined` | Custom error handler. If provided, errors are not thrown; you are responsible for setting response status and body. |
| `onFileBegin` | `(name: string, file: File) => void` | `undefined` | Called when a new file begins uploading. |
| `onPart` | `(part: Part, handlePart: (part: Part) => void) => void` | `undefined` | Called for each multipart part. |
| `...formidableOptions` | `FormidableOptions` | `{ multiples: true }` | All other options are passed directly to formidable. See [formidable documentation](https://github.com/node-formidable/formidable#options). |

### Common formidable options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `maxFileSize` | `number` | `200 * 1024 * 1024` | Maximum file size (bytes). |
| `maxTotalFileSize` | `number` | `Infinity` | Maximum total size of all files (bytes). |
| `keepExtensions` | `boolean` | `false` | Include file extensions in temporary filenames. |
| `uploadDir` | `string` | `os.tmpdir()` | Directory for temporary files. |
| `hash` | `boolean \| string` | `false` | Calculate file hash. Use `'sha1'` or `'md5'` for algorithm. |

## Examples

### Parse form fields

```js
app.use(hoaFormidable())
app.use(async (ctx) => {
  // Request: multipart/form-data with fields: name=hoa, version=1.0
  ctx.res.body = ctx.req.body // => { name: 'hoa', version: '1.0' }
})
```

### Handle file uploads

```js
app.use(hoaFormidable())
app.use(async (ctx) => {
  const files = (ctx.req as any).files
  const file = files?.upload // Single file
  
  if (file) {
    ctx.res.body = {
      originalFilename: file.originalFilename,
      mimetype: file.mimetype,
      size: file.size,
      filepath: file.filepath
    }
  }
})
```

### Multiple files with same field name

```js
app.use(hoaFormidable())
app.use(async (ctx) => {
  const files = (ctx.req as any).files
  const documents = files?.document // Array of files
  
  if (Array.isArray(documents)) {
    ctx.res.body = {
      count: documents.length,
      filenames: documents.map(f => f.originalFilename)
    }
  }
})
```

### Parse only specific methods

```js
app.use(hoaFormidable({ parsedMethods: ['POST'] }))
```

### Custom error handling

```js
app.use(hoaFormidable({
  onError: (err, ctx) => {
    ctx.res.status = 422
    ctx.res.body = { error: 'Upload failed', details: err.message }
  }
}))
```

### File size limits

```js
app.use(hoaFormidable({
  maxFileSize: 5 * 1024 * 1024, // 5MB per file
  maxTotalFileSize: 50 * 1024 * 1024, // 50MB total
  onError: (err, ctx) => {
    ctx.res.status = 413
    ctx.res.body = { error: 'File too large' }
  }
}))
```

### Keep file extensions

```js
app.use(hoaFormidable({
  keepExtensions: true,
  uploadDir: './uploads'
}))
```

### Custom file handling with onFileBegin

```js
import { createWriteStream } from 'fs'
import { join } from 'path'

app.use(hoaFormidable({
  onFileBegin: (name, file) => {
    // Custom destination based on file type
    const ext = file.originalFilename?.split('.').pop()
    file.filepath = join('./uploads', `${Date.now()}.${ext}`)
  }
}))
```

### Custom part processing with onPart

```js
app.use(hoaFormidable({
  onPart: (part, handlePart) => {
    // Skip certain fields
    if (part.name === 'skip_me') {
      return
    }
    // Process normally
    handlePart(part)
  }
}))
```

## Result Types

### Fields (`ctx.req.body`)

Single values are returned as strings, multiple values as arrays:

```js
// Single value: name=hoa
ctx.req.body.name // => 'hoa'

// Multiple values: tag=alpha&tag=beta  
ctx.req.body.tag // => ['alpha', 'beta']
```

### Files (`ctx.req.files`)

Single files are returned as `File` objects, multiple files as arrays:

```js
// Single file upload
ctx.req.files.avatar // => File object

// Multiple files with same field name
ctx.req.files.documents // => [File, File, ...]
```

#### File object properties

| Property | Type | Description |
| --- | --- | --- |
| `originalFilename` | `string` | Original filename from client. |
| `newFilename` | `string` | Generated filename in upload directory. |
| `filepath` | `string` | Full path to temporary file. |
| `mimetype` | `string` | MIME type of the file. |
| `size` | `number` | File size in bytes. |

## Requirements

* **Node.js**: `>=20`
* **Hoa**: `*`
* **@hoajs/adapter**: Required for Node.js server support

## Notes

* Only processes `multipart/form-data` content type. Other content types are skipped.
* Requires Node.js stream support (works with `@hoajs/adapter`).
* Temporary files are automatically cleaned up by the OS or formidable.
* Use `multiples: true` (default) to support multiple files per field name.
