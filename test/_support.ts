
import * as http from 'http'
import * as sinon from 'sinon'

export function createHttpServerStub (): any {
  return sinon.createStubInstance(http.Server)
}

export function noop (): any {
  // do nothing
}
