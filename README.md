
**`Aldo-http`** is an enhanced HTTP createServer module for Node.js.
It provides a decorated version of `IncomingMessage` and `ServerResponse` objects.
The API is mostly similar to `Koa`

## Installation
```sh
npm add aldo-http
```

## Example
```js
const { createServer } = require('aldo-http')

// server
const server = createServer((request, response) => {
  // will send and end the response stream
  response.send('Hello world!')
})

// start
server.listen(3000)
```

The above code is similar than the following

```js
const { createServer } = require('http')

// server
const server = createServer((request, response) => {
  let content = 'Hello world!'

  response.setHeader('Content-Type', 'text/plain; charset=utf-8')
  response.setHeader('Content-Length', Buffer.byteLength(content))
  response.end(content)
})

// start
server.listen(3000)
```

## Testing
```sh
npm test
```
