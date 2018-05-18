
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

The `request` event handler could be a common or an async function.

Each handler will receive the `http.IncomingMessage` object as a single input, and could return anything as a response.

```ts
declare type RequestHandler = (request: http.IncomingMessage) => any;
```

The handler's output could be anything:
- `streams` will be piped
- `strings` and `buffers` will be sent as is
- `nulls` and `undefined` values will be considered as empty responses (Status code 204)
- anything else will be serialized as `JSON`.

To get more control over the response to send, [Response](#response) instances could be returned.

## Response

The response instance let you construct a complex response (status code, body and headers)

```ts
declare class Response {
  body: any;
  statusCode: number;
  statusMessage: string;
  headers: http.OutgoingHttpHeaders;

  constructor(body?: any);

  type(value: string): this;
  etag(value: string): this;
  length(value: number): this;
  location(url: string): this;
  has(header: string): boolean;
  remove(header: string): this;
  setCookie(value: string): this;
  vary(...headers: string[]): this;
  send(res: http.ServerResponse): void;
  lastModified(value: string | Date): this;
  status(code: number, message?: string): this;
  append(header: string, value: string | string[]): this;
  get(header: string): string | number | string[] | undefined;
  set(header: string, value: string | number | string[]): this;
  set(headers: { [field: string]: string | number | string[]; }): this;
  reset(headers?: { [field: string]: string | number | string[]; }): this;
}
```
