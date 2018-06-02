
import { Response } from './base'
import { ServerResponse } from 'http'

export class JsonResponse extends Response {
  /**
   * Create a new empty response
   * 
   * @param json The response body
   * @constructor
   * @public
   */
  public constructor (json: object) {
    super(json)

    // default content type
    this.set('Content-Type', 'application/json; charset=utf-8')
  }

  /**
   * Send the response and terminate the stream
   * 
   * @param res The response stream
   * @public
   */
  send (res: ServerResponse): void {
    this.body = JSON.stringify(this.body)

    this.set('Content-Length', Buffer.byteLength(this.body))

    super.send(res)
  }
}
