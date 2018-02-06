
/// <reference types="node" />
/// <reference types="cookie" />

import * as http from 'http';
import * as cookie from 'cookie';

export class Request {
    /**
     * Native http request
     * 
     * @type {http.IncomingMessage}
     */
    stream: http.IncomingMessage;
    /**
     * Request body
     *
     * @type {Any}
     */
    body: any;
    /**
     * Contruct a new request instance
     *
     * @param {http.IncomingMessage} req
     * @constructor
     */
    constructor(req: http.IncomingMessage);
    /**
     * Request headers
     *
     * @type {Object}
     */
    readonly headers: http.IncomingHttpHeaders;
    /**
     * Get the parsed cookies object
     *
     * @type {Object}
     */
    readonly cookies: { [x: string]: string | undefined; };
    /**
     * URL pathname
     *
     * @type {String}
     */
    readonly url: string;
    /**
     * Request method
     *
     * @type {String}
     */
    readonly method: string;
    /**
     * URL query string
     *
     * @type {String}
     */
    readonly querystring: string;
    /**
     * Request mime type, void of parameters such as "charset", or undefined
     *
     * @type {String | undefined}
     */
    readonly type: string | undefined;
    /**
     * Get the charset when present or undefined
     *
     * @type {String | undefined}
     */
    readonly charset: string | undefined;
    /**
     * Returns the parsed Content-Length when present or NaN
     *
     * @type {Number}
     */
    readonly length: number;
    /**
     * Get the parsed query string
     *
     * @type {Object}
     */
    readonly query: { [key: string]: string | string[] | undefined; };
    /**
     * Returns true when requested with TLS, false otherwise
     *
     * @type {Boolean}
     */
    readonly secure: boolean;
    /**
     * "Host" header value
     *
     * @type {String | undefined}
     */
    readonly host: string | undefined;
    /**
     * Return the protocol string "http" or "https" when requested with TLS
     *
     * @type {String}
     */
    readonly protocol: string;
    /**
     * Origin of the URL
     */
    readonly origin: string;
    /**
     * Remote IP address
     *
     * @type {String | undefined}
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
     * @param {String} header
     * @returns {String | Array<String> | undefined}
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
     * @param {String} header
     * @returns {Boolean}
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
     * @param {String...} types
     * @returns {String | false}
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
     * @param {String...} types
     * @returns {String | Array<String> | false}
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
     * @param {String...} args
     * @returns {String | Array<String> | false}
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
     * @param {String...} args
     * @returns {String | Array<String> | false}
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
     * @param {String...} args
     * @returns {String | Array<String> | false}
     */
    acceptLanguage(...args: string[]): string | false | string[];
}

export class Response {
    /**
     * Native http response
     * 
     * @type {http.ServerResponse}
     */
    stream: http.ServerResponse;
    /**
     * Response internal body
     *
     * @type {Any}
     */
    private _body;
    /**
     * Construct a new response instance
     *
     * @param {http.ServerResponse} res
     * @constructor
     */
    constructor(res: http.ServerResponse);
    /**
     * Response headers
     *
     * @type {http.OutgoingHttpHeaders}
     */
    readonly headers: http.OutgoingHttpHeaders;
    /**
     * Get the response status code
     *
     * @type {Number}
     */
    /**
     * Set the response status code
     *
     * @type {Number}
     */
    status: number;
    /**
     * Get the response status code
     *
     * @type {Number}
     */
    /**
     * Set the response status message
     *
     * @type {String}
     */
    message: string;
    /**
     * Return the response mime type void of the "charset" parameter, or undefined
     *
     * @type {String | undefined}
     */
    /**
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
     *
     * @type {String}
     */
    type: string;
    /**
     * Get the response content length or NaN otherwise.
     *
     * @type {Number}
     */
    /**
     * Set `Content-Length` reponse header
     *
     * @type {Number}
     */
    length: number;
    /**
     * Get the response body
     *
     * @type {Any}
     */
    /**
     * Set the response body
     *
     * @type {String | Buffer | Object | null}
     */
    body: any;
    /**
     * Get the `Last-Modified` date, or undefined if not present
     *
     * @type {Date | undefined}
     */
    /**
     * Set the `Last-Modified` response header
     *
     * @type {Date}
     */
    lastModified: Date;
    /**
     * Get the `ETag` of the response.
     *
     * @type {String}
     */
    /**
     * Set the `ETag` of the response.
     *
     * This will normalize the quotes if necessary.
     *
     * Examples:
     *
     *     response.etag = 'md5hashsum'
     *     response.etag = '"md5hashsum"'
     *     response.etag = 'W/"123456789"'
     *
     * @type {String}
     */
    etag: string;
    /**
     * Get the `Location` response header
     *
     * @type {String}
     */
    /**
     * Set the `Location` response header
     *
     * @type {String}
     */
    location: string;
    /**
     * Check if the incoming request contains the "Content-Type"
     * header field, and it contains any of the give mime `type`s.
     *
     * It returns the first matching type or false otherwise.
     *
     * Pretty much the same as `Request.is()`
     *
     * @param {String...} types
     * @returns {String | false}
     */
    is(...types: string[]): string | false;
    /**
     * Get the response header if present, or undefined
     *
     * @param {String} header
     * @returns {String | number | Array<String> | undefined}
     */
    get(header: string): string | number | string[] | undefined;
    /**
     * Set the response header, or pass an object of header fields.
     *
     * Examples:
     *
     *    response.set('Foo', ['bar', 'baz'])
     *    response.set('Accept', 'application/json')
     *    response.set({ Accept: 'text/plain', 'X-API-Key': 'tobi' })
     *
     * @param {Object | String} header
     * @param {String | Array} [value]
     * @returns {Response} for chaining
     */
    set(headers: { [field: string]: string | number | string[]; }): this;
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
     * @param {String} name
     * @param {String} value
     * @param {Object} [options]
     * @returns {Response} for chaining
     */
    setCookie(name: string, value: string, options?: cookie.CookieSerializeOptions): this;
    /**
     * Unset the cookie `name`.
     *
     * @param {String} name
     * @param {Object} [options]
     * @returns {Response} for chaining
     */
    clearCookie(name: string, options?: cookie.CookieSerializeOptions): this;
    /**
     * Append additional header name
     * 
     * Examples:
     * 
     *    this.append('Link', ['<http://localhost/>', '<http://localhost:3000/>'])
     *    this.append('Set-Cookie', 'foo=bar; Path=/; HttpOnly')
     *    this.append('Warning', '199 Miscellaneous warning')
     *
     * @param {String} header
     * @param {String | Array} value
     * @returns {Response} for chaining
     */
    append(header: string, value: string | string[]): this;
    /**
     * Check if response header is defined
     *
     * @param {String} header
     * @returns {Boolean}
     */
    has(header: string): boolean;
    /**
     * Remove the response header
     *
     * @param {String} header
     * @returns {Response} for chaining
     */
    remove(header: string): this;
    /**
     * Reset all response headers
     *
     * @returns {Response} for chaining
     */
    reset(): this;
    /**
     * Send and end the response stream
     *
     * @param {String | Buffer | Object} [content]
     */
    send(content?: any): void;
}

/**
 * Create a decorated version of the native HTTP server
 *
 * @param {RequestListener} fn
 * @returns {Server}
 */
export function createServer(fn?: RequestListener): http.Server;

/**
 * Request listener
 * 
 * @param {Request} request
 * @param {Response} response
 */
export type RequestListener = (request: Request, response: Response) => void;
