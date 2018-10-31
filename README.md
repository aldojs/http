
An enhanced HTTP(S) [createServer](#createserver) module for Node.js.

## Install

```sh
$ npm add @aldojs/http
```

## create a server

To create HTTP or HTTPS servers, you may use the function `createServer`.

```ts
import { ServerOptions } from 'https';

declare function createServer (options: Options, fn: RequestHandler): Server;
declare function createServer (fn: RequestHandler): Server;
declare function createServer (options: Options): Server;
declare function createServer (): Server;

declare interface Options {
  tls?: ServerOptions;
}
```

### Server options

```js
const { readFileSync } = require('fs')
const { createServer } = require('@aldojs/http')

const options = {
  tls: {
    key: readFileSync('path/to/key/file.pem'),
    cert: readFileSync('path/to/cert/file.pem')
    
    // see `https.createServer()` for more options
  }
}

// will make a HTTPS server using the TLS options
const secureServer = createServer(options)
```

### Request handler

The `request` event handler could be a common or an async function.

Each handler will receive the [http.IncomingMessage](https://nodejs.org/docs/latest-v8.x/api/http.html#http_class_http_incomingmessage) object as a request, and should return a [Response](#response) object.

```ts
declare type RequestHandler = (request: http.IncomingMessage) => Response | Promise<Response>;
```

## Response

The response object returned by the [request handler](#request-handler) should be as following:

```ts
import { ServerResponse } from 'http';

declare class Response {
  send (res: ServerResponse): any;
}
```

You may return, any object with `send` method, to configure and finalize the [http.ServerResponse](https://nodejs.org/docs/latest-v8.x/api/http.html#http_class_http_serverresponse)

