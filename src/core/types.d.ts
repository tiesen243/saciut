import type { NextFunction, Request, RequestHandler, Response } from 'express'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Type<T = any> = new (...args: any[]) => T

export interface ModuleMetadata {
  imports?: Type[]
  controllers: Type[]
  providers: Type[]
}

export interface AppInstance {
  configure: (options: {
    middlewares: RequestHandler[]
    settings: Record<string, unknown>
  }) => void
  listen: (port: number) => Promise<void>
}

export type Method =
  | 'get'
  | 'post'
  | 'put'
  | 'delete'
  | 'patch'
  | 'options'
  | 'head'
  | 'all'

export interface CanActivate {
  canActivate?: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => boolean | Promise<boolean>
}
