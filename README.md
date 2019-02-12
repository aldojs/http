
An enhanced HTTP(S) [Server](#server) for Node.js.
It uses a pure [`request handler`](#request-handler) instead of the traditional
`(request: http.IncomingMessage, response: http.ServerResponse) => void`

## Install

```sh
$ npm add @aldojs/http
```

## Server

To create HTTP or HTTPS servers, you may use the function `createServer`.

```ts
const { readFileSync } = require('fs');

declare function createServer (options: Options, fn: RequestHandler): Server;
declare function createServer (fn: RequestHandler): Server;
declare function createServer (options: Options): Server;
declare function createServer (): Server;

declare interface Options {
  tls?: {
    key: readFileSync('path/to/key/file.pem'),
    cert: readFileSync('path/to/cert/file.pem')

    // see `https.createServer()` for more options to create secure servers
  }
}
```

## Request handler

The `request` event handler could be a common or an async function.

Each handler will receive the [http.IncomingMessage](https://nodejs.org/docs/latest-v8.x/api/http.html#http_class_http_incomingmessage) object as a request, and should return a [Response](#response) object.

```ts
declare type RequestHandler = (request: http.IncomingMessage) => Response | Promise<Response>;
```

## Response

The response object returned by the [request handler](#request-handler) should have a `send` method to configure and finalize the [http.ServerResponse](https://nodejs.org/docs/latest-v8.x/api/http.html#http_class_http_serverresponse)

```ts
import { ServerResponse } from 'http';

declare interface Response {
  send (res: ServerResponse): void | Promise<void>;
}
```
