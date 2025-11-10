# @hoajs/combine

提供组合中间件的工具函数，包括 `some`、`every` 和 `except` 方法，用于更灵活地组合和控制中间件的执行流程。

## 快速开始

```js
import { Hoa } from 'hoa'
import { some, every, except } from '@hoajs/combine'

const app = new Hoa()

// 使用 some 方法，任一中间件通过即继续
app.use(some(
  (ctx) => ctx.req.method === 'GET',
  (ctx) => ctx.req.method === 'POST'
))

export default app
```

## 方法

### some(...middlewares)

创建一个组合中间件，运行第一个返回 true 的中间件。

- 按顺序执行中间件，如果中间件返回 true 或没有返回值，则停止执行后续中间件
- 如果中间件返回 false，则继续执行下一个中间件
- 如果所有中间件都返回 false 或抛出错误，则抛出最后一个错误

```js
app.use(some(
  (ctx) => ctx.req.method === 'GET',
  (ctx) => ctx.req.method === 'POST',
  (ctx) => {
    ctx.status = 405
    ctx.body = 'Method Not Allowed'
    return true
  }
))
```

### every(...middlewares)

创建一个组合中间件，运行所有中间件，如果任何中间件返回 false 或抛出错误，则停止执行。

- 按顺序执行所有中间件
- 如果任何中间件返回 false 或抛出错误，则停止执行并抛出错误
- 所有中间件都通过才会继续执行后续中间件

```js
app.use(every(
  (ctx) => ctx.req.method === 'GET',
  (ctx) => ctx.req.headers['x-auth-token'] === 'secret',
  (ctx) => {
    // 只有前两个条件都通过才会执行到这里
    ctx.state.user = { id: 1, name: 'admin' }
  }
))
```

### except(condition, ...middlewares)

创建一个组合中间件，当条件不满足时执行指定的中间件。

- `condition`: 可以是一个条件函数或条件函数数组
- `middlewares`: 当条件不满足时要执行的中间件
- 如果条件函数返回 true，则跳过中间件执行
- 如果条件函数返回 false，则执行中间件

```js
// 当请求方法不是 GET 时执行中间件
app.use(except(
  (ctx) => ctx.req.method === 'GET',
  (ctx, next) => {
    ctx.status = 405
    ctx.body = 'Only GET method is allowed'
  }
))

// 使用多个条件
app.use(except(
  [
    (ctx) => ctx.req.method === 'GET',
    (ctx) => ctx.req.method === 'POST'
  ],
  (ctx) => {
    ctx.status = 405
    ctx.body = 'Only GET and POST methods are allowed'
  }
))
```

## 类型定义

| 类型/函数 | 说明 | 参数 | 返回值 |
|----------|------|------|--------|
| `Condition` | 条件函数类型 | `ctx: HoaContext` | `boolean` |
| `some` | 任一中间件通过即继续 | `...middlewares: (HoaMiddleware \| Condition)[]` | `HoaMiddleware` |
| `every` | 所有中间件都通过才继续 | `...middlewares: (HoaMiddleware \| Condition)[]` | `HoaMiddleware` |
| `except` | 条件不满足时执行中间件 | `condition: Condition \| Condition[], ...middlewares: HoaMiddleware[]` | `HoaMiddleware` |

## 使用场景

1. **条件路由**：根据请求参数、头信息等条件执行不同的中间件
2. **权限控制**：组合多个权限检查条件
3. **请求验证**：验证请求参数、头信息等
4. **API 版本控制**：根据请求头或路径执行不同版本的中间件