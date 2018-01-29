
/// <reference types="node" />

import * as http from 'http';

export class Request {
    req: http.IncomingMessage;
    res: http.ServerResponse;
    body: any;
    constructor(req: http.IncomingMessage, res: http.ServerResponse);
    readonly headers: http.IncomingHttpHeaders;
    readonly cookies: {
        [x: string]: string | undefined;
    };
    readonly url: string;
    readonly method: string;
    readonly querystring: string;
    readonly type: string;
    readonly charset: string;
    readonly length: number;
    readonly query: {
        [x: string]: any;
    };
    readonly secure: boolean;
    readonly host: string;
    readonly protocol: string;
    get(header: string): string | string[];
    has(header: string): boolean;
    is(...types: string[]): string | false;
    accept(...types: string[]): string | false | string[];
    acceptCharset(...args: string[]): string | false | string[];
    acceptEncoding(...args: string[]): string | false | string[];
    acceptLanguage(...args: string[]): string | false | string[];
}

export class Response {
    req: http.IncomingMessage;
    res: http.ServerResponse;
    private _body;
    private _sent;
    constructor(req: http.IncomingMessage, res: http.ServerResponse);
    readonly headers: http.OutgoingHttpHeaders;
    status: number;
    message: string;
    type: string;
    length: number;
    body: any;
    lastModified: Date;
    etag: string;
    is(...types: string[]): string | false;
    get(header: string): string | number | string[];
    set(headers: {
        [field: string]: string | number | string[];
    }): this;
    set(header: string, value: string | number | string[]): this;
    setCookie(name: string, value: string, options?: SerializeOptions): this;
    append(header: string, value: string | string[]): this;
    has(header: string): boolean;
    remove(header: string): this;
    reset(): this;
    redirect(url?: string, status?: number): void;
    send(content?: any): void;
}

export function createServer(fn?: RequestListener): http.Server;

export type RequestListener = (req: Request, res: Response) => void;

export interface SerializeOptions {
    domain?: string;
    encode?(val: string): string;
    expires?: Date;
    httpOnly?: boolean;
    maxAge?: number;
    path?: string;
    sameSite?: boolean | 'lax' | 'strict';
    secure?: boolean;
}
