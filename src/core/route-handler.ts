import type { NextFunction, Request, RequestHandler, Response } from 'express'

import type { Type } from '@/core/decorators/types'
import { getParams, ParamType, parsedSchema } from '@/core/decorators/params'

export function createRouteHandler(
  controller: Type,
  methodName: string,
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const params = getParams(controller, methodName)
    const args: unknown[] = []

    params.forEach((param) => {
      switch (param.type) {
        case ParamType.BODY:
          args[param.index] = param.schema
            ? parsedSchema(param.schema, req.body, res)
            : req.body
          break
        case ParamType.QUERY:
          args[param.index] = param.schema
            ? parsedSchema(param.schema, req.query, res)
            : req.query
          break
        case ParamType.PARAM:
          args[param.index] = param.schema
            ? parsedSchema(param.schema, req.params, res)
            : req.params
          break
        case ParamType.HEADERS:
          args[param.index] = req.headers
          break
        case ParamType.COOKIES:
          args[param.index] = param.schema
            ? parsedSchema(param.schema, req.cookies, res)
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
    ;(controller[methodName as keyof Type] as RequestHandler)(
      ...(args as Parameters<RequestHandler>),
    )
  }
}
