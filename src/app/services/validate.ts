import * as z from 'zod/v4'

import type { Descriptor, MethodDecorator, RequestHandler } from '@/core/types'

export function Query<TSchema extends z.ZodType, TQuery = z.output<TSchema>>(
  schema: TSchema,
) {
  return function QueryDecorator(
    _: object,
    __: MethodDecorator<TQuery, never>,
    descriptor: Descriptor<TQuery>,
  ): Descriptor<TQuery> {
    const treatedDescriptor = descriptor as unknown as {
      value: (...args: Parameters<RequestHandler>) => void
    }
    const originalMethod = treatedDescriptor.value
    treatedDescriptor.value = function ValidateQueryMiddleware(
      ...args: Parameters<typeof originalMethod>
    ): void {
      const req = args[0]
      const query = new URLSearchParams(req.url.split('?')[1])
      const parsed = schema.safeParse(Object.fromEntries(query.entries()))
      if (!parsed.success)
        args[1].status(400).json({
          error: 'Invalid query',
          details: z.flattenError(parsed.error).fieldErrors,
        })
      else {
        req.validatedQuery = parsed.data as Record<string, unknown>
        originalMethod.apply(this, args)
      }
    }

    return treatedDescriptor as unknown as Descriptor<TQuery>
  }
}

export function Body<TSchema extends z.ZodType, TBody = z.output<TSchema>>(
  schema: TSchema,
) {
  return function BodyDecorator(
    _: object,
    __: MethodDecorator<never, TBody>,
    descriptor: Descriptor<never, TBody>,
  ): Descriptor<never, TBody> {
    const treatedDescriptor = descriptor as unknown as {
      value: (...args: Parameters<RequestHandler>) => void
    }
    const originalMethod = treatedDescriptor.value
    treatedDescriptor.value = function ValidateBodyMiddleware(
      ...args: Parameters<typeof originalMethod>
    ): void {
      const req = args[0]
      const parsed = schema.safeParse(req.body)
      if (!parsed.success)
        args[1].status(400).json({
          error: 'Invalid body',
          details: z.flattenError(parsed.error).fieldErrors,
        })
      else {
        req.validatedBody = parsed.data as Record<string, unknown>
        originalMethod.apply(this, args)
      }
    }

    return treatedDescriptor as unknown as Descriptor<never, TBody>
  }
}
