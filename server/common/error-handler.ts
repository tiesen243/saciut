import type { NextFunction, Request, Response } from 'express'

import { HttpException } from '@/core/common'

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err) {
    const statusCode = err instanceof HttpException ? err.statusCode : 500
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    const details =
      err instanceof HttpException
        ? err.details
        : err instanceof Error
          ? err.cause
          : undefined
    res.status(statusCode).json({ status: statusCode, message, details })
  } else next()
}
