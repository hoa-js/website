## Origin-Agent-Cluster

The Origin-Agent-Cluster middleware sets the `Origin-Agent-Cluster` header to request that the browser isolate the page in its own agent cluster, improving security and performance.

## Quick Start

```js
import { Hoa } from 'hoa'
import { originAgentCluster } from '@hoajs/secure-headers'

const app = new Hoa()

// Enable origin agent clustering
app.use(originAgentCluster())

app.use(async (ctx) => {
  ctx.res.body = 'Hello, Hoa!'
})

export default app
```

## Options

This middleware takes no options. It always sets the header to `?1`.

## Examples

### Basic Usage

```js
// Sets: Origin-Agent-Cluster: ?1
app.use(originAgentCluster())
```

## Behavior Details

- **Agent Cluster Isolation**: This header requests that the browser place the document in an origin-keyed agent cluster, meaning it won't share an agent cluster with cross-origin pages.

- **Performance**: Origin-keyed agent clusters can improve performance by allowing the browser to better parallelize work across origins.

- **Security**: Provides additional isolation between origins, reducing the risk of side-channel attacks like Spectre.

- **Compatibility**: This is a hint to the browser. Browsers may ignore it or implement it differently.

## What is an Agent Cluster?

An agent cluster is a group of browsing contexts (windows, iframes, workers) that can synchronously access each other. By requesting origin-keyed agent clusters, you're asking the browser to:
- Not share JavaScript execution contexts between different origins
- Potentially improve parallelization
- Reduce cross-origin information leakage

## Common Use Cases

### All Applications (Recommended)

```js
// Enable for better isolation and performance
app.use(originAgentCluster())
```

### With Other Security Headers

```js
import { 
  originAgentCluster,
  crossOriginOpenerPolicy,
  crossOriginEmbedderPolicy 
} from '@hoajs/secure-headers'

app.use(originAgentCluster())
app.use(crossOriginOpenerPolicy({ policy: 'same-origin' }))
app.use(crossOriginEmbedderPolicy({ policy: 'require-corp' }))
```

## Important Notes

- **No Configuration**: This middleware has no configuration options. It always sets `Origin-Agent-Cluster: ?1`.

- **Browser Hint**: This is a request to the browser, not a guarantee. Browsers may choose to ignore it.

- **No Downsides**: There are generally no downsides to enabling this header, so it's recommended for all applications.

- **Default Enabled**: This header is enabled by default in the main `secureHeaders()` middleware.
