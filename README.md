
`Aldo-http` is an enhanced HTTP `createServer` module for Node.js.
It provides a decorated versions of `IncomingMessage` and `ServerResponse` objects which are mostly similar to `Koa`'s request and response objects.

## Usage

`Aldo-http` exposes `createServer` function to create both HTTP and HTTPS servers.

```ts
declare function createServer(fn: RequestListener, options?: ServerOptions): Server;

declare interface ServerOptions {
  tls?: https.ServerOptions;
}
```

### HTTP
```js
const { createServer } = require('aldo-http')

const listener = (request) => {
  return {
    status: 200,
    body: 'Hello world!'
  }
}

// make a new HTTP server
const server = createServer(listener)



// 
(async () => {
  try {
    // start listening on port 3000
    await server.start(3000)

    console.log('The server is ready')
  }
  catch (error) {
    // log the error
    console.error(error)
  }
})
```

### HTTPS
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
const server = createServer(options, (request, response) => {
  response.send('Hello world!')
})

(async () => {
  // start listening on port 443
  await server.start({
    port: 443,
    exclusive: true,
    host: 'example.com'
  })
})
```

### Trust proxy
To enable parsing `X-Forwarded-*` request headers, the `proxy` flag can be set to `true`

```js
const { createServer } = require('aldo-http')

// make a new HTTP server
const server = createServer({ proxy: true }, (request, response) => {
  response.send('Hello world!')
})

(async () => {
  // start listening on port 3000
  await server.start(3000)
})
```

### Request listener callback
The `request` event listener can be a simple or an async function.
It will reveice a `Request` and a `Response` instances instead of the default `IncompingMessage` and `ServerResponse` objects.
```ts
declare type RequestListener = (req: http.IncomingMessage) => Response;
```

## Request
The request is an `IncomingMessage` decorator.
```ts
declare class Request {
  body: any;
  stream: http.IncomingMessage;

  readonly url: string; // URL pathname
  readonly ips: string[];
  readonly method: string;
  readonly length: number;
  readonly origin: string;
  readonly secure: boolean;
  readonly protocol: string;
  readonly querystring: string;
  readonly ip: string | undefined;
  readonly host: string | undefined;
  readonly type: string | undefined;
  readonly charset: string | undefined;
  readonly headers: http.IncomingHttpHeaders;
  readonly cookies: { [name: string]: string | undefined; };
  readonly query: { [key: string]: string | string[] | undefined; };

  constructor(req: http.IncomingMessage, options?: { proxy?: boolean; });

  has(header: string): boolean;
  is(...types: string[]): string | false;
  get(header: string): string | string[] | undefined;
  accept(...types: string[]): string | false | string[];
  acceptCharset(...args: string[]): string | false | string[];
  acceptEncoding(...args: string[]): string | false | string[];
  acceptLanguage(...args: string[]): string | false | string[];
}
```

## Response
The response is a `ServerResponse` decorator.
```ts
declare class Response {
  body: any;
  etag: string;
  type: string;
  length: number;
  status: number;
  message: string;
  location: string;
  lastModified: Date;
  stream: http.ServerResponse;

  readonly writable: boolean;
  readonly headersSent: boolean;
  readonly headers: http.OutgoingHttpHeaders;

  constructor(res: http.ServerResponse, options?: {});

  send(content?: any): void;
  has(header: string): boolean;
  remove(header: string): this;
  vary(field: string | string[]): this;
  is(...types: string[]): string | false;
  append(header: string, value: string | string[]): this;
  get(header: string): string | number | string[] | undefined;
  set(header: string, value: string | number | string[]): this;
  set(headers: { [field: string]: string | number | string[]; }): this;
  reset(headers?: { [field: string]: string | number | string[]; }): this;
  setCookie(name: string, value: string, options?: SerializeCookieOptions): this;
  clearCookie(name: string, options?: SerializeCookieOptions): this;
}

declare interface SerializeCookieOptions {
  path?: string;
  expires?: Date;
  domain?: string;
  maxAge?: number;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: boolean | 'lax' | 'strict';
}
```
