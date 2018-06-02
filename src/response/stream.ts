
import { Stream } from 'stream'
import { Response } from './base'
import is from '@sindresorhus/is'
import { ServerResponse } from 'http'

export class StreamResponse extends Response {
  /**
   * Create a new empty response
   * 
   * @param stream The response stream
   * @constructor
   * @public
   */
  public constructor (stream: Stream) {
    super(stream)

    // default content type
    this.set('Content-Type', 'application/octet-stream')
  }

  /**
   * Send the response and terminate the stream
   * 
   * @param res The response stream
   * @public
   */
  send (res: ServerResponse): any {
    // ignore
    if (!this._isWritable(res)) return

    // head
    this._writeHeaders(res)

    let { body: stream } = this

    // body
    stream.pipe(res)

    return Promise.all([stream, res].map(_toPromise))
  }
}

/**
 * Return a promise that resolves when the stream is finished,
 * or rejects when the `error` event is emitted
 * 
 * @param stream The stream object
 * @private
 */
function _toPromise (stream: Stream): Promise<void> {
  return new Promise((resolve, reject) => {
    let event = _isReadable(stream) ? 'end' : 'finish'

    stream.once('close', resolve)
    stream.once('error', reject)
    stream.once(event, resolve)
  })
}

/**
 * Check if the given stream is readable
 * 
 * @param stream The stream object
 * @private
 */
function _isReadable (stream: any): boolean {
  return stream.readable || is.function_(stream._read)
}
