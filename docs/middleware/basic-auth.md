## @hoajs/basic-auth

HTTP Basic Authentication middleware for Hoa.

Supported scenarios:
- Single user authentication with username/password
- Multiple users authentication with user list
- Custom verification function for flexible authentication logic
- Secure password comparison with timing-safe algorithms
- Custom hash function for password security

## Quick Start

```js
import { Hoa } from 'hoa'
import { basicAuth } from '@hoajs/basic-auth'

const app = new Hoa()
app.use(basicAuth({ username: 'admin', password: 'secret' }))
app.use(async (ctx) => { ctx.res.body = 'Hello, authenticated user!' })

export default app
```


## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| **username** | `string` | - | Username for authentication (when using single user mode) |
| **password** | `string` | - | Password for authentication (when using single user mode) |
| **verifyUser** | `(ctx: HoaContext, username: string, password: string) => boolean \| Promise<boolean>` | - | Custom function to verify user credentials |
| **realm** | `string` | `ctx.app.name` | The realm attribute for the WWW-Authenticate header |
| **hashFunction** | `(data: string \| object \| boolean) => string \| Promise<string>` | SHA-256 | Custom hash function for secure comparison |
| **invalidUserMessage** | `string \| ((ctx: HoaContext) => string \| Promise<string>)` | `'Unauthorized'` | Custom message or function that returns a message for unauthorized access |


## Examples

### Single user authentication


```js
app.use(basicAuth({
  username: 'admin', 
  password: 'secret123',
  realm: 'Admin Area' 
}))
```

### Multiple users authentication

```js
app.use(basicAuth( 
  { username: 'admin', password: 'admin123' }, 
  { username: 'user1', password: 'pass1' }, 
  { username: 'user2', password: 'pass2' } 
))
```



### Custom verification function

```js
app.use(basicAuth({
  verifyUser: async (ctx, username, password) => {
    // Custom authentication logic
    const user = await getUserFromDatabase(username)
    return user && await bcrypt.compare(password, user.hashedPassword)
  },
  realm: 'myApp'
}))
```

### Custom hash function

```js
app.use(basicAuth({
  username: 'admin',
  password: 'secret',
  hashFunction: async (data) => {
    // Custom hash implementation
    return await customHashFunction(data)
  }
}))
```

### Custom error message

```js
app.use(basicAuth({
  username: 'admin',
  password: 'secret',
  invalidUserMessage: 'Access denied - please check your credentials'
}))

// Or with dynamic message
app.use(basicAuth({
  username: 'admin',
  password: 'secret',
  invalidUserMessage: (ctx) => `Access denied for ${ctx.req.ip}`
}))
```


## Security Notes

The middleware implements several security best practices:
- **Timing-safe comparison**: Uses cryptographic hash functions to prevent timing attacks
- **Secure password handling**: Passwords are hashed using SHA-256 by default
- **RFC 7617 compliance**: Follows HTTP Basic Authentication specification
- **Safe base64 decoding**: Handles invalid base64 input gracefully
- **Realm escaping**: Properly escapes realm values in WWW-Authenticate header

## Error Handling

When authentication fails, the middleware:
1. Returns HTTP 401 Unauthorized status
2. Sets WWW-Authenticate header with the specified realm

