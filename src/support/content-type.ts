
import * as typeis from 'type-is'

export function extract (header: string): string {
  return header ? header.split(';', 1)[0].trim() : ''
}

export function is (value: string, types: string[]) {
  return typeis.is(value, types)
}
