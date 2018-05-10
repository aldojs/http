
/// <reference types="node" />

import * as net from 'net';
import * as http from 'http';
import * as https from 'https';

export class Response {
    /**
     * Get or set the response body
     */
    readonly body?: any;

    /**
     * The response status code
     */
    readonly statusCode: number;

    /**
     * The response status message
     */
    readonly statusMessage?: string;

    /**
     * The response headers
     */
    readonly headers?: http.OutgoingHttpHeaders;
}

export class Server {
    /**
     * The native server instance to use internally
     */
    native: http.Server | https.Server;

    /**
     * Initialize a new Server instance
     * 
     * @param server The native server to wrap
     */
    constructor (server: http.Server | https.Server);

    /**
     * Add a `listener` for the given `event`
     * 
     * @param event
     * @param fn listener
     */
    on (event: string, fn: (...args: any[]) => void): this;

    /**
     * Start a server listening for requests
     * 
     * @param options
     */
    start (options: net.ListenOptions): Promise<void>;

    /**
     * Start a server listening for requests
     * 
     * @param port
     */
    start (port: number): Promise<void>;

    /**
     * Stop the server from accepting new requests
     */
    stop (): Promise<void>;
}

/**
 * Create a HTTP server
 * 
 * @param fn The request listener
 * @param options
 */
export function createServer(fn: RequestListener, options?: CreateServerOptions): Server;

/**
 * `createServer` options
 */
export interface CreateServerOptions {
    /**
     * Secure server options
     */
    tls?: https.ServerOptions
}

/**
 * Request listener callback
 */
export type RequestListener = (request: http.IncomingMessage) => Response;
