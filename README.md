
`Aldo-http` is an enhanced HTTP `createServer` module for Node.js.

```js
const { createServer } = require('aldo-http')

// server
const server = createServer(() => "Hello world!")

// start
server.start(3000)
```

## createServer

```ts
declare function createServer (options: Options, fn: RequestHandler): Server;
declare function createServer (fn: RequestHandler): Server;
declare function createServer (options: Options): Server;
declare function createServer (): Server;

declare interface Options {
  tls?: https.ServerOptions;
}
```

### HTTPS server

```js
const { readFileSync } = require('fs')
const { createServer } = require('aldo-http')

const options = {
  tls: {
    key: readFileSync('path/to/key/file.pem'),
    cert: readFileSync('path/to/cert/file.pem')
    
    // see `https.createServer()` for more options
  }
}

// make a HTTPS server using the TLS options
const server = createServer(options, () => 'Hello world!')

server.start({
  port: 443,
  exclusive: true,
  host: 'example.com'
})
```

### Request handler

The `request` event handler could be a common function, an async function or an object with a `handle` method.

Each handler will receive the `http.IncomingMessage` object as a request, and could return anything as a response.

```ts
declare type HandlerFn = (request: http.IncomingMessage) => any;

declare type RequestHandler = HandlerFn | { handle: HandlerFn };
```

The handler's output could be anything:
- `streams` will be piped
- `strings` and `buffers` will be sent as is
- `nulls` and `undefined` values will be considered as empty responses (Status code 204)
- anything else will be serialized as `JSON`.

To get more control over the response to send, [Response](#response) instances could be used.

## Response

The response instance let you construct a complex response with status code, body and headers.

```ts
declare class Response {
  body: any;
  statusCode: number;
  statusMessage: string;
  headers: http.OutgoingHttpHeaders;

  constructor(body?: any);

  type(value: string): this; // set the `Content-Type` header
  etag(value: string): this; // set the `ETag` header
  length(value: number): this; // set the `Content-Length` header
  location(url: string): this; // set the `Location` header
  has(header: string): boolean; // check the given header is already set
  remove(header: string): this; // remove the give header
  setCookie(value: string): this; // append a `Set-Cookie` header
  vary(...headers: string[]): this; // append a `Vary` header
  send(res: http.ServerResponse): void; // send the response to the client (used internally)
  lastModified(value: string | Date): this; // set the `Last-Modfied` header
  status(code: number, message?: string): this; // set the status code and message
  append(header: string, value: string | string[]): this; // append a header value
  get(header: string): string | number | string[] | undefined; // get the header value
  set(header: string, value: string | number | string[]): this; // set the header value
  set(headers: { [field: string]: string | number | string[]; }): this; // set multiple headers
  reset(headers?: { [field: string]: string | number | string[]; }): this; // reset the headers
}
```

To create [Response](#response) instances, you may use the `constructor` or one of the available factories:
- `createRespnse(content?)` to create a response based on the given content.
- `createEmptyResponse()` to create an empty response (default status code `204`).
- `createHtmlResponse(html)` to create a HTML response, sets the `Content-Type` header to `text/html; charset=utf-8` and the `Content-Length` header.
- `createTextResponse(text)` to create a text response, sets the `Content-Type` header to `text/plain; charset=utf-8` and the `Content-Length` header.
- `createBufferResponse(buff)` to create a buffered response, sets the `Content-Type` header to `application/octet-stream` and the `Content-Length` header.
- `createStreamResponse(stream)` to create a streamed response, sets the `Content-Type` header to `application/octet-stream`.
- `createJsonResponse(object)` to create a JSON response, sets the `Content-Type` header to `application/json; charset=utf-8` and the `Content-Length` header.

```js
const { createServer, createTextResponse } = require('aldo-http')

// handler
const handler = () => createTextResponse("Hello world!")

// server
const server = createServer(handler)

// start
server.start(3000)
```
