import type { NextFunction, Request, Response } from 'express'

import { getParams, ParamType, parsedSchema } from '@/core/common/params'

export function parseArgs(
  target: object,
  key: string | symbol,
  req: Request,
  res: Response,
  next: NextFunction,
): unknown[] {
  const params = getParams(target, key)
  const args: unknown[] = []

  for (const param of params) {
    switch (param.type) {
      case ParamType.REQ:
        args[param.index] = req
        break
      case ParamType.RES:
        args[param.index] = res
        break
      case ParamType.NEXT:
        args[param.index] = next
        break
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
        args[param.index] = param.schema
          ? parsedSchema(param.schema, req.headers)
          : req.headers
        break
      case ParamType.COOKIES:
        args[param.index] = param.schema
          ? parsedSchema(param.schema, req.cookies)
          : req.cookies
        break
    }
  }

  return args
}
