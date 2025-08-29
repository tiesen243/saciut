import 'reflect-metadata'

import { HttpStatus } from '@/core/http'

const HEADERS_METADATA_KEY = Symbol('http:headers')
const HTTP_CODE_METADATA_KEY = Symbol('http:code')

export function ResHeaders(heads: Record<string, string>): MethodDecorator {
  return (target, propertyKey) => {
    Reflect.defineMetadata(HEADERS_METADATA_KEY, heads, target, propertyKey)
  }
}

export function getResHeaders(
  target: object,
  propertyKey: string | symbol,
): Record<string, string> {
  return (Reflect.getMetadata(HEADERS_METADATA_KEY, target, propertyKey) ??
    {}) as Record<string, string>
}

export function HttpCode(statusCode: keyof typeof HttpStatus): MethodDecorator {
  return (target, propertyKey) => {
    Reflect.defineMetadata(
      HTTP_CODE_METADATA_KEY,
      HttpStatus[statusCode],
      target,
      propertyKey,
    )
  }
}

export function getHttpCode(
  target: object,
  propertyKey: string | symbol,
): number {
  return (Reflect.getMetadata(HTTP_CODE_METADATA_KEY, target, propertyKey) ??
    HttpStatus.OK) as number
}

export class HttpException extends Error {
  statusCode: number
  details: unknown

  constructor(
    statusCode: keyof typeof HttpStatus,
    {
      message = statusCode,
      details,
    }: { message?: string; details?: unknown } = {},
  ) {
    super(message)
    this.name = 'HttpError'
    this.statusCode = HttpStatus[statusCode]
    this.details = details
  }
}
