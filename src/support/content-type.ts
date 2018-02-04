
import { is as typeis } from 'type-is'

export function extract (header: string | undefined): string | undefined {
  return header ? header.split(';', 1)[0].trim() : undefined
}

export function is (value: string | undefined, types: string[]): string | false {
  return value ? typeis(value, types) : false
}
