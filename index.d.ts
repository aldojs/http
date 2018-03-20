
/// <reference types="node" />

import * as net from 'net';
import * as http from 'http';
import * as https from 'https';

/**
 * HTTP request decorator
 */
export class Request {
    /**
     * Native HTTP request
     */
    stream: http.IncomingMessage;
    /**
     * Request body
     */
    body: any;
    /**
     * Contruct a new request instance
     *
     * @param req
     * @param options
     */
    constructor(req: http.IncomingMessage, options?: { proxy?: boolean });
    /**
     * Request headers
     */
    readonly headers: http.IncomingHttpHeaders;
    /**
     * Get the parsed cookies object
     */
    readonly cookies: { [name: string]: string | undefined; };
    /**
     * URL pathname
     */
    readonly url: string;
    /**
     * Request method
     */
    readonly method: string;
    /**
     * URL query string
     */
    readonly querystring: string;
    /**
     * Request mime type, void of parameters such as "charset", or undefined
     */
    readonly type: string | undefined;
    /**
     * Get the charset when present or undefined
     */
    readonly charset: string | undefined;
    /**
     * Returns the parsed Content-Length when present or NaN
     */
    readonly length: number;
    /**
     * Get the parsed query string
     */
    readonly query: { [key: string]: string | string[] | undefined; };
    /**
     * Returns true when requested with TLS, false otherwise
     */
    readonly secure: boolean;
    /**
     * "Host" header value
     */
    readonly host: string | undefined;
    /**
     * Return the protocol string "http" or "https" when requested with TLS
     */
    readonly protocol: string;
    /**
     * Origin of the URL
     */
    readonly origin: string;
    /**
     * IP address list when a `proxy` is enabled
     */
    readonly ips: string[];
    /**
     * Remote IP address
     */
    readonly ip: string | undefined;
    /**
     * Returns the request header value
     *
     * Case insensitive name matching.
     *
     * The `Referrer` header field is special-cased,
     * both `Referrer` and `Referer` are interchangeable.
     *
     * Examples:
     *
     *     this.get('Content-Type')
     *     // => "text/plain"
     *
     *     this.get('content-type')
     *     // => "text/plain"
     *
     *     this.get('Something')
     *     // => undefined
     *
     * @param header
     */
    get(header: string): string | string[] | undefined;
    /**
     * Check if the header is present
     *
     * Case insensitive name matching.
     *
     * The `Referrer` header field is special-cased,
     * both `Referrer` and `Referer` are interchangeable.
     *
     * Examples:
     *
     *     this.has('Content-Type')
     *     // => true
     *
     *     this.has('content-type')
     *     // => true
     *
     *     this.has('Something')
     *     // => false
     *
     * @param header
     */
    has(header: string): boolean;
    /**
     * Check if the incoming request contains the "Content-Type"
     * header field, and it contains any of the give mime `type`s.
     *
     * It returns the first matching type or false otherwise
     *
     * Examples:
     *
     *     // With Content-Type: text/html charset=utf-8
     *     this.is('html') // => 'html'
     *     this.is('text/html') // => 'text/html'
     *     this.is('text/*', 'application/json') // => 'text/html'
     *
     *     // When Content-Type is application/json
     *     this.is('json', 'urlencoded') // => 'json'
     *     this.is('application/json') // => 'application/json'
     *     this.is('html', 'application/*') // => 'application/json'
     *
     *     this.is('html') // => false
     *
     * @param types
     */
    is(...types: string[]): string | false;
    /**
     * Check if the given `type(s)` is acceptable, returning
     * the best match when true, otherwise `false`, in which
     * case you should respond with 406 "Not Acceptable".
     *
     * It returns an array of accepted mime types
     * ordered by "qvalue" parameter, if no argument given
     *
     * The `type` value may be a single mime type string
     * such as "application/json", the extension name
     * such as "json" or an array `["json", "html", "text/plain"]`. When a list
     * or array is given the _best_ match, if any is returned.
     *
     * Examples:
     *
     *     // with Accept: text/html
     *     this.accept('html')
     *     // => "html"
     *
     *     // with Accept: text/*, application/json
     *     this.accept('html')
     *     // => "html"
     *     this.accept('text/html')
     *     // => "text/html"
     *     this.accept('json', 'text')
     *     // => "json"
     *     this.accept('application/json')
     *     // => "application/json"
     *
     *     // with Accept: text/*, application/json
     *     this.accept('image/png')
     *     this.accept('png')
     *     // => false
     *
     *     // with Accept: text/*q=.5, application/json
     *     this.accept('html', 'json')
     *     // => "json"
     *
     *     // with Accept: text/*, application/json
     *     this.accept()
     *     // => ["text/*", "application/json"]
     *
     * @param types
     */
    accept(...types: string[]): string | false | string[];
    /**
     * Return accepted charsets or best fit based on `charsets`.
     *
     * If no argument supplied, it returns all accepted charsets sorted by "qvalue"
     *
     * Examples:
     *
     *     // with Accept-Charset: utf-8, iso-8859-1q=0.2, utf-7q=0.5
     *     this.acceptCharset()
     *     // => ['utf-8', 'utf-7', 'iso-8859-1']
     *     this.acceptCharset('utf-8', 'iso-8859-1')
     *     // => "utf-8"
     *     this.acceptCharset('utf-16')
     *     // => false
     *
     * @param args
     */
    acceptCharset(...args: string[]): string | false | string[];
    /**
     * Returns accepted encodings or best fit based on `encodings`.
     *
     * If no argument supplied, it returns all accepted encodings sorted by "qvalue"
     *
     * Examples:
     *
     *     // with Accept-Encoding: gzip, deflate
     *     this.acceptEncoding()
     *     // => ['gzip', 'deflate']
     *     this.acceptEncoding('br', 'gzip')
     *     // => "gzip"
     *     this.acceptEncoding('br')
     *     // => false
     *
     * @param args
     */
    acceptEncoding(...args: string[]): string | false | string[];
    /**
     * Return accepted languages or best fit based on `langs`.
     *
     * If no argument supplied, it returns all accepted languages sorted by "qvalue"
     *
     * Examples:
     *
     *     // with Accept-Language: enq=0.8, es, pt
     *     this.acceptLanguage()
     *     // => ['es', 'pt', 'en']
     *     this.acceptLanguage('en', 'pt')
     *     // => "en"
     *     this.acceptLanguage('fr')
     *     // => false
     *
     * @param args
     */
    acceptLanguage(...args: string[]): string | false | string[];
}

/**
 * HTTP response decorator
 */
export class Response {
    /**
     * Native HTTP response
     */
    stream: http.ServerResponse;
    /**
     * Construct a new response instance
     *
     * @param res
     * @param options
     */
    constructor(res: http.ServerResponse, options?: {});
    /**
     * Get the response headers
     * 
     * Shortcut to `response.stream.getHeaders()`
     */
    readonly headers: http.OutgoingHttpHeaders;
    /**
     * Checks if the request is writable.
     */
    readonly writable: boolean;
    /**
     * Check if a header has been written to the socket
     */
    readonly headersSent: boolean;
    /**
     * Get or set the response status code
     */
    status: number;
    /**
     * Get or set the response status message
     */
    message: string;
    /**
     * Response mime type void of the "charset" parameter, or undefined
     * 
     * Set `Content-Type` response header.
     * 
     * Will add the the charset if not present.
     * 
     * Examples:
     * 
     *     response.type = '.html'
     *     response.type = 'html'
     *     response.type = 'json'
     *     response.type = 'application/json'
     *     response.type = 'png'
     */
    type: string;
    /**
     * Get or set the `Content-Length` header value
     */
    length: number;
    /**
     * Get or set the response body
     */
    body: any;
    /**
     * `Last-Modified` header value, or undefined if not present
     */
    lastModified: Date | undefined;
    /**
     * Get or set the `ETag` of the response.
     *
     * This will normalize the quotes if necessary.
     *
     * Examples:
     *
     *     response.etag = 'md5hashsum'
     *     response.etag = '"md5hashsum"'
     *     response.etag = 'W/"123456789"'
     */
    etag: string;
    /**
     * Get or set the `Location` response header
     */
    location: string;
    /**
     * Append `field` to the `Vary` header
     * 
     * 
     */
    vary(field: string | string[]): this;
    /**
     * Check if the incoming request contains the "Content-Type"
     * header field, and it contains any of the give mime `type`s.
     *
     * It returns the first matching type or false otherwise.
     *
     * Pretty much the same as `Request.is()`
     *
     * @param types
     */
    is(...types: string[]): string | false;
    /**
     * Get the response header if present, or undefined
     *
     * @param header
     */
    get(header: string): string | number | string[] | undefined;
    /**
     * Set the response header, or pass an object of header fields.
     *
     * Example:
     *
     *    response.set({ Accept: 'text/plain', 'X-API-Key': 'tobi' })
     *
     * @param headers
     */
    set(headers: { [field: string]: string | number | string[]; }): this;
    /**
     * Set the response header, or pass an object of header fields.
     *
     * Examples:
     *
     *    response.set('Foo', ['bar', 'baz'])
     *    response.set('Accept', 'application/json')
     *
     * @param header
     * @param value
     */
    set(header: string, value: string | number | string[]): this;
    /**
     * Set cookie `name` to `value`, with the given `options`.
     *
     * Examples:
     *
     *    // "Remember Me" for 15 minutes
     *    res.cookie('remember', '1', { expires: new Date(Date.now() + 900000), httpOnly: true })
     *
     *    // same as above
     *    res.cookie('remember', '1', { maxAge: 900000, httpOnly: true })
     *
     * @param name
     * @param value
     * @param options
     */
    setCookie(name: string, value: string, options?: SerializeCookieOptions): this;
    /**
     * Unset the cookie `name`.
     *
     * @param name
     * @param options
     */
    clearCookie(name: string, options?: SerializeCookieOptions): this;
    /**
     * Append additional header name
     * 
     * Examples:
     * 
     *    this.append('Link', ['<http://localhost/>', '<http://localhost:3000/>'])
     *    this.append('Set-Cookie', 'foo=bar; Path=/; HttpOnly')
     *    this.append('Warning', '199 Miscellaneous warning')
     *
     * @param header
     * @param value
     */
    append(header: string, value: string | string[]): this;
    /**
     * Check if response header is defined
     *
     * @param header
     */
    has(header: string): boolean;
    /**
     * Remove the response header
     *
     * @param header
     */
    remove(header: string): this;
    /**
     * Reset all response headers
     *
     * @param headers
     */
    reset(headers?: { [field: string]: string | number | string[]; }): this;
    /**
     * Send and end the response stream
     * 
     * @param content
     */
    send(content?: any): void;
}

/**
 * HTTP server decorator
 */
export class Server {
    /**
     * Initialize a new Server instance
     * 
     * @param options
     */
    constructor (native: http.Server | https.Server, options?: ServerOptions);
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
 * @param options
 * @param fn request listener
 */
export function createServer(options: CreateServerOptions, fn: RequestListener): Server;
/**
 * Create a HTTP server
 * 
 * @param options
 */
export function createServer(options: CreateServerOptions): Server;
/**
 * Create a HTTP server
 * 
 * @param fn request listener
 */
export function createServer(fn: RequestListener): Server;
/**
 * Create a HTTP server
 */
export function createServer(): Server;

/**
 * `createServer` options
 */
export interface ServerOptions {
    /**
     * Specifies whenever `X-Forwarded-*` headers can be trusted by the request.
     * By default, its value is `false`.
     */
    proxy?: boolean
}

/**
 * `createServer` options
 */
export interface CreateServerOptions extends ServerOptions {
    /**
     * Secure server options
     */
    tls?: https.ServerOptions
}

/**
 * Request listener callback
 */
export interface RequestListener {
    (request: Request, response: Response): void;
}

/**
 * Response `setCookie` options
 */
export interface SerializeCookieOptions {
    /**
     * Specifies the value for the Domain Set-Cookie attribute. By default, no
     * domain is set, and most clients will consider the cookie to apply to only
     * the current domain.
     */
    domain?: string;
    /**
     * Specifies the `Date` object to be the value for the `Expires`
     * `Set-Cookie` attribute. By default, no expiration is set, and most
     * clients will consider this a "non-persistent cookie" and will delete it
     * on a condition like exiting a web browser application.
     *
     * *Note* the cookie storage model specification states that if both
     * `expires` and `maxAge` are set, then `maxAge` takes precedence, but it is
     * possible not all clients by obey this, so if both are set, they should
     * point to the same date and time.
     */
    expires?: Date;
    /**
     * Specifies the boolean value for the `HttpOnly` `Set-Cookie` attribute.
     * When truthy, the `HttpOnly` attribute is set, otherwise it is not. By
     * default, the `HttpOnly` attribute is not set.
     *
     * *Note* be careful when setting this to true, as compliant clients will
     * not allow client-side JavaScript to see the cookie in `document.cookie`.
     */
    httpOnly?: boolean;
    /**
     * Specifies the number (in seconds) to be the value for the `Max-Age`
     * `Set-Cookie` attribute. The given number will be converted to an integer
     * by rounding down. By default, no maximum age is set.
     *
     * *Note* the cookie storage model specification states that if both
     * `expires` and `maxAge` are set, then `maxAge` takes precedence, but it is
     * possible not all clients by obey this, so if both are set, they should
     * point to the same date and time.
     */
    maxAge?: number;
    /**
     * Specifies the value for the `Path` `Set-Cookie` attribute. By default,
     * the path is considered the "default path".
     */
    path?: string;
    /**
     * Specifies the boolean or string to be the value for the `SameSite`
     * `Set-Cookie` attribute.
     *
     * - `true` will set the `SameSite` attribute to `Strict` for strict same
     * site enforcement.
     * - `false` will not set the `SameSite` attribute.
     * - `'lax'` will set the `SameSite` attribute to Lax for lax same site
     * enforcement.
     * - `'strict'` will set the `SameSite` attribute to Strict for strict same
     * site enforcement.
     */
    sameSite?: boolean | 'lax' | 'strict';
    /**
     * Specifies the boolean value for the `Secure` `Set-Cookie` attribute. When
     * truthy, the `Secure` attribute is set, otherwise it is not. By default,
     * the `Secure` attribute is not set.
     *
     * *Note* be careful when setting this to `true`, as compliant clients will
     * not send the cookie back to the server in the future if the browser does
     * not have an HTTPS connection.
     */
    secure?: boolean;
}
