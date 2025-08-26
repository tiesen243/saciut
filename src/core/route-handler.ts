import type { NextFunction, Request, RequestHandler, Response } from 'express'

import type { Type } from '@/core/types'
import { getParams, ParamType, parsedSchema } from '@/core/decorators/params'

export function createRouteHandler(
  controller: Type,
  methodName: string,
): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    const params = getParams(controller, methodName)
    const args: unknown[] = []

    params.forEach((param) => {
      switch (param.type) {
        case ParamType.BODY:
          args[param.index] = param.schema
            ? parsedSchema(param.schema, req.body)
            : req.body
          break
        case ParamType.QUERY:
          args[param.index] = param.schema
            ? parsedSchema(param.schema, req.query)
            : req.query
          break
        case ParamType.PARAM:
          args[param.index] = param.schema
            ? parsedSchema(param.schema, req.params)
            : req.params
          break
        case ParamType.HEADERS:
          args[param.index] = req.headers
          break
        case ParamType.COOKIES:
          args[param.index] = param.schema
            ? parsedSchema(param.schema, req.cookies)
            : req.cookies
          break
        case ParamType.REQUEST:
          args[param.index] = req
          break
        case ParamType.RESPONSE:
          args[param.index] = res
          break
        case ParamType.NEXT:
          args[param.index] = next
          break
        default:
          args[param.index] = undefined
      }
    })

    if (res.headersSent) return
    await (controller[methodName as keyof Type] as RequestHandler)(
      ...(args as Parameters<RequestHandler>),
    )
  }
}
