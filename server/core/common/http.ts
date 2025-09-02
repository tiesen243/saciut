import { HttpErrorStatus } from '@/core/http'

import 'reflect-metadata'

const STATUS_CODE_METADATA_KEY = Symbol('http:status_code')
const HEADERS_METADATA_KEY = Symbol('http:headers')

export function Http(statusCode: number): MethodDecorator {
  return (target, propertyKey) => {
    Reflect.defineMetadata(
      STATUS_CODE_METADATA_KEY,
      statusCode,
      target,
      propertyKey,
    )
  }
}

export function getHttpStatusCode(
  target: object,
  propertyKey: string | symbol,
): number | undefined {
  return Reflect.getMetadata(STATUS_CODE_METADATA_KEY, target, propertyKey) as
    | number
    | undefined
}

export function ResponseHeaders(
  heads: Record<string, string>,
): MethodDecorator {
  return (target, propertyKey) => {
    Reflect.defineMetadata(HEADERS_METADATA_KEY, heads, target, propertyKey)
  }
}

export function getResponseHeaders(
  target: object,
  propertyKey: string | symbol,
): Record<string, string> {
  return (Reflect.getMetadata(HEADERS_METADATA_KEY, target, propertyKey) ??
    {}) as Record<string, string>
}

export class HttpException extends Error {
  statusCode: number
  details: unknown

  constructor(
    statusCode: keyof typeof HttpErrorStatus,
    {
      message = statusCode,
      details,
    }: { message?: string; details?: unknown } = {},
  ) {
    super(message)
    this.name = 'HttpError'
    this.statusCode = HttpErrorStatus[statusCode]
    this.details = details
  }
}
