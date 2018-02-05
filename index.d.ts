
/// <reference types="node" />
/// <reference types="cookie" />

import * as http from 'http';
import * as cookie from 'cookie';

export class Request {
    public constructor(req: http.IncomingMessage);

    // properties
    public body: any;
    public readonly url: string;
    public readonly method: string;
    public readonly origin: string;
    public readonly length: number;
    public readonly secure: boolean;
    public readonly protocol: string;
    public readonly querystring: string;
    public stream: http.IncomingMessage;
    public readonly ip: string | undefined;
    public readonly host: string | undefined;
    public readonly type: string | undefined;
    public readonly charset: string | undefined;
    public readonly headers: http.IncomingHttpHeaders;
    public readonly cookies: { [key: string]: string | undefined; };
    public readonly query:{ [key: string]: string | string[] | undefined; };

    // methods 
    public has(header: string): boolean;
    public get(header: string): string | string[];
    public is(...types: string[]): string | false;
    public accept(...types: string[]): string | false | string[];
    public acceptCharset(...args: string[]): string | false | string[];
    public acceptEncoding(...args: string[]): string | false | string[];
    public acceptLanguage(...args: string[]): string | false | string[];
}

export class Response {
    public constructor(res: http.ServerResponse);

    // properties
    public body: any;
    public type: string;
    public etag: string;
    public length: number;
    public status: number;
    public message: string;
    public lastModified: Date;
    public stream: http.ServerResponse;
    public readonly headers: http.OutgoingHttpHeaders;

    // methods
    public reset(): this;
    public send(content?: any): void;
    public has(header: string): boolean;
    public remove(header: string): this;
    public is(...types: string[]): string | false;
    public redirect(url?: string, status?: number): void;
    public append(header: string, value: string | string[]): this;
    public get(header: string): string | number | string[] | undefined;
    public set(header: string, value: string | number | string[]): this;
    public set(headers: { [field: string]: string | number | string[]; }): this;
    public clearCookie(name: string, options?: cookie.CookieSerializeOptions): this;
    public setCookie(name: string, value: string, options?: cookie.CookieSerializeOptions): this;
}

export function createServer(fn?: RequestListener): http.Server;

export type RequestListener = (request: Request, response: Response) => void;
