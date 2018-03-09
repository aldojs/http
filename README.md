
An enhanced HTTP `createServer` module for Node.js.

It provides a decorated version of `IncomingMessage` and `ServerResponse` objects.
The API is mostly similar to `Koa`

## Installation
```sh
npm add aldo-http
```

## Testing
```sh
npm test
```

## Getting started

`Aldo-http` exposes `createServer` function to create both HTTP and HTTPS servers.

```ts
declare function createServer (options?: ServerOptions, fn?: RequestListener): Server

declare interface ServerOptions {
  proxy?: boolean
  tls?: https.ServerOptions
}
```

### HTTP server
```js
const { createServer } = require('aldo-http')

// make a new HTTP server
const server = createServer((request, response) => {
  // Set the `Content-Type` and `Content-Length` headers,
  // write `Hello world!` response body
  // Set the status code to `200 OK`
  // and finally, terminate the response stream
  response.send('Hello world!')
})

// start listening on port 3000
server.start(3000)
```

### HTTPS server
```js
const { createServer } = require('aldo-http')

const options = {
  tls: {
    // options
  }
}

// make a HTTPS server using the TLS options
const server = createServer(options, (request, response) => {
  response.send('Hello world!')
})

// start listening on port 443
server.start(443)
```
### Trust proxy
To enable parsing `X-Forwarded-*` request headers, the `proxy` flag can be set to `true`

```js
const { createServer } = require('aldo-http')

// make a new HTTP server
const server = createServer({ proxy: true }, (request, response) => {
  response.send('Hello world!')
})

// start listening on port 3000
server.start(3000)
```

### Request listener callback
The `request` event listener is a simple or async function.
```ts
declare type RequestListener = (req: Request, res: Response) => void

declare class Request {
  stream: http.IncomingMessage

  constructor (req: http.IncomingMessage)

  // ...
}

declare class Response {
  stream: http.ServerResponse

  constructor (res: http.ServerResponse)

  // ...
}
```

## to be continued...
