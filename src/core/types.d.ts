import type { Request as ExpressRequest, NextFunction, Response } from 'express'

type DefaultQuery = Record<string, unknown>
type DefaultBody = Record<string, unknown>

interface Request<TQuery = DefaultQuery, TBody = DefaultBody>
  extends ExpressRequest {
  _startTime?: number
  userId?: string
  validatedQuery?: TQuery
  validatedBody?: TBody
}

type RequestHandler<TQuery = DefaultQuery, TBody = DefaultBody> = (
  req: Request<TQuery, TBody>,
  res: Response,
  next: NextFunction,
) => void | Promise<void>

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Controller = (new () => Record<string | symbol, any>) & {
  prefix?: string
  routes?: {
    method: HttpMethod
    path: string
    handler: string | symbol
  }[]
}

type MethodDecorator<
  TQuery = DefaultQuery,
  TBody = DefaultBody,
> = ClassMethodDecoratorContext<object, RequestHandler<TQuery, TBody>>

type Descriptor<TQuery = DefaultQuery, TBody = DefaultBody> =
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  void | ((_: Request<TQuery, TBody>, res: Response) => void)

export {
  HttpMethod,
  Controller,
  DefaultQuery,
  DefaultBody,
  Request,
  Response,
  NextFunction,
  RequestHandler,
  MethodDecorator,
  Descriptor,
}
