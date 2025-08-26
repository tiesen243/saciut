import type { NextFunction, Request, Response } from 'express'

import { HttpError } from '@/common/utils/http'

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (process.env.NODE_ENV !== 'production')
    console.error(
      `[${req.method} ${req.path}]`,
      error instanceof Error ? (error.stack ?? error.message) : error,
    )

  const statusCode = error instanceof HttpError ? error.statusCode : 500
  const message =
    error instanceof Error ? error.message : 'Internal Server Error'
  const details =
    error instanceof HttpError
      ? error.details
      : error instanceof Error
        ? error.stack
        : undefined
  res.status(statusCode).json({ status: statusCode, message, details })
}
