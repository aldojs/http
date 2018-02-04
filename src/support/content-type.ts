
import { is as typeis } from 'type-is'

export function extract (header: string): string {
  return header ? header.split(';', 1)[0].trim() : ''
}

export function is (value: string, types: string[]): string | false {
  return value ? typeis(value, types) : false
}
