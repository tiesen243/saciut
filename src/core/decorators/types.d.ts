import type { RequestHandler } from 'express'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Type<T = any> = new (...args: any[]) => T

export interface ModuleMetadata {
  imports?: Type[]
  controllers: Type[]
  providers: Type[]
}

export interface AppInstance {
  configure: (middlewares: RequestHandler[]) => void
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
