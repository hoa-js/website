## @hoajs/mustache

A Mustache-based view renderer extension for Hoa. It adds `ctx.render(template, view, partials?)` so you can generate HTML strings in middleware and send them as the response body.

## Quick Start

```js
import { Hoa } from 'hoa'
import { mustache } from '@hoajs/mustache'

const app = new Hoa()
app.extend(mustache())

const userTemplate = '<p>Hello, my name is {{name}}. I have {{kids.length}} kids:</p><ul>{{#kids}}{{> kid}}{{/kids}}</ul>'
const kidTemplate = '<li>{{name}} is {{age}}</li>'

app.use(async (ctx) => {
  const html = ctx.render(
    userTemplate,
    {
      name: 'David',
      kids: [
        { name: 'Jack', age: 18 },
        { name: 'John', age: 20 }
      ]
    },
    {
      kid: kidTemplate
    }
  )

  ctx.res.body = html
})

export default app
```

## Options

- `cache` (default `true`): Enables template caching to improve render performance. When disabled, Mustache’s template cache is turned off.
- `tags` (default `['{{', '}}']`): Custom Mustache delimiters, e.g. `['<%', '%>']`.
- `escape` (default uses Mustache’s built-in HTML escape): Custom escape function. Must return an HTML-safe string.

## Examples

```js
import { mustache } from '@hoajs/mustache'

// Disable cache
app.extend(mustache({ cache: false }))

// Custom delimiters
app.extend(mustache({ tags: ['<%', '%>'] }))

// Custom escape function
const entityMap = {
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '/': '&#x2F;',
  '`': '&#x60;', '=': '&#x3D;', ':': '&#x3A;', '(': '&#40;', ')': '&#41;'
}
app.extend(mustache({
  escape: (string) => String(string).replace(/[&<>"'`=/:()]/g, (s) => entityMap[s])
}))
```

## Partials

```js
const list = '{{#items}}{{> item}}{{/items}}'

// String partial
ctx.res.body = ctx.render(list, { items: [{ name: 'A' }, { name: 'B' }] }, {
  item: '<li>{{name}}</li>'
})

// Function partial (if your project uses Mustache's functional partials)
ctx.res.body = ctx.render(list, { items: [{ name: 'A' }, { name: 'B' }] }, {
  item: (view) => `<li>${view.name.toLowerCase()}</li>`
})
```
