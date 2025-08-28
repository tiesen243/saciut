import { HttpStatus } from '@/core/http'

export * from './container'
export * from './guard'
export * from './http-methods'
export * from './metadata'
export * from './params'

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
