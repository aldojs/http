
An enhanced HTTP(S) [Server](#server) for Node.js.
It uses a pure [`request handler`](#request-handler) instead of the traditional
Nodejs [request handler](https://nodejs.org/docs/latest-v8.x/api/http.html#http_event_request)

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
It's a pure function to replace the traditional handler
```ts
declare type RequestHandler = (request: http.IncomingMessage, response: http.ServerResponse) => void;
```

Each handler will receive the [http.IncomingMessage](https://nodejs.org/docs/latest-v8.x/api/http.html#http_class_http_incomingmessage) object as a request, and should return a [Response](#response) object.

```ts
declare type RequestHandler = (request: http.IncomingMessage) => Response | Promise<Response>;
```

## Response

The returned response object should have a `send` method to configure and finalize the [http.ServerResponse](https://nodejs.org/docs/latest-v8.x/api/http.html#http_class_http_serverresponse)

```ts
import { ServerResponse } from 'http';

declare interface Response {
  send (res: ServerResponse): void | Promise<void>;
}
```
