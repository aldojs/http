
/// <reference types="node" />

import * as net from 'net';
import * as http from 'http';
import * as https from 'https';


/**
* Create a HTTP(S) Server
*
* @param options The `Server` options
* @param handler The request handler
* @public
*/
export declare function createServer(options: CreateServerOptions, handler: RequestHandler): Server;

/**
* Create a HTTP(S) Server
*
* @param options The `Server` options
* @public
*/
export declare function createServer(options: CreateServerOptions): Server;

/**
* Create a HTTP(S) Server
*
* @param handler The request handler
* @public
*/
export declare function createServer(handler: RequestHandler): Server;

/**
* Create a HTTP(S) server
*
* @public
*/
export declare function createServer(): Server;

/**
 * High level wrapper arround http native server
 * 
 * @class
 */
export declare class Server {
  /**
   * Create a new server instance
   *
   * @param server The HTTP(S) native server
   * @constructor
   * @public
   */
  constructor(server: http.Server | https.Server);

  /**
   * Add a handler for the `request` event
   *
   * @param event The `request` event
   * @param handler The `request` handler
   * @public
   */
  on(event: 'request', handler: RequestHandler): this;

  /**
   * Add a `listener` for the given `event`
   *
   * @param event The event name
   * @param listener The event listener
   * @public
   */
  on(event: string | symbol, listener: EventListener): this;

  /**
   * Add a one time `listener` for the given `event`
   *
   * @param event The event name
   * @param fn The event listener
   * @public
   */
  once(event: string | symbol, fn: EventListener): this;

  /**
   * Trigger the `event` with `arguments`
   *
   * @param event The event name
   * @param args The optional arguments to pass
   * @public
   */
  emit(event: string | symbol, ...args: any[]): boolean;

  /**
   * Stop listening to the given `event`
   *
   * @param event The event name
   * @param fn The event listener
   * @public
   */
  off(event?: string | symbol, fn?: EventListener): this;

  /**
   * Start a server listening for requests
   *
   * @public
   * @async
   */
  start(portOrOptions?: number | net.ListenOptions): Promise<void>;

  /**
   * Prevent the server from accepting new requests
   *
   * @public
   * @async
   */
  stop(): Promise<void>;
}

export declare type RequestHandler = (req: Request) => Response | Promise<Response>;

export declare type EventListener = (...args: any[]) => any;

export declare type Request = http.IncomingMessage;

export interface CreateServerOptions {
  tls?: https.ServerOptions;
}

export interface Response {
  send(res: http.ServerResponse): any;
}
