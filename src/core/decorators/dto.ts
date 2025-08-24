import type { Request, RequestHandler } from 'express'
import * as z from 'zod'

export function DTO(options: {
  query?: z.ZodType
  body?: z.ZodType
}): MethodDecorator {
  return function QueryDecorator<T = RequestHandler>(
    _: object,
    __: string | symbol,
    descriptor: TypedPropertyDescriptor<T>,
  ) {
    const originalMethod = descriptor.value as RequestHandler
    // @ts-expect-error - override descriptor value
    descriptor.value = function (...args: Parameters<RequestHandler>) {
      const req = args[0] as Request

      if (options.query) {
        const parsedQuery = options.query.safeParse(req.query)
        if (!parsedQuery.success)
          return args[1].status(400).json({
            message: 'Invalid query parameters',
            errors: z.flattenError(parsedQuery.error).fieldErrors,
          })

        Object.defineProperty(req, 'query', {
          ...Object.getOwnPropertyDescriptor(req, 'query'),
          value: parsedQuery.data,
        })
      }

      if (options.body) {
        const parsedBody = options.body.safeParse(req.body)
        if (!parsedBody.success)
          return args[1].status(400).json({
            message: 'Invalid request body',
            errors: z.flattenError(parsedBody.error).fieldErrors,
          })

        Object.defineProperty(req, 'body', {
          ...Object.getOwnPropertyDescriptor(req, 'body'),
          value: parsedBody.data,
        })
      }

      return originalMethod.apply(this, args)
    }
  }
}

export abstract class Dto {
  static query?: z.ZodType
  static body?: z.ZodType
}

export interface InferDto<T extends typeof Dto> {
  query: T['query'] extends z.ZodType ? z.infer<T['query']> : never
  body: T['body'] extends z.ZodType ? z.infer<T['body']> : never
}
