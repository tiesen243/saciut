import type { NextFunction, Request, Response } from 'express'

import { env } from '@/common/utils/env'
import { HttpError } from '@/common/utils/http'

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (env.NODE_ENV === 'development')
    console.error(
      `[${req.method} ${req.path}]`,
      error instanceof Error ? (error.stack ?? error.message) : error,
    )

  const statusCode = error instanceof HttpError ? error.statusCode : 500

  let message = 'Internal Server Error'
  if (error instanceof HttpError) message = error.message
  else if (error instanceof Error && env.NODE_ENV === 'development')
    message = error.message

  let details = undefined
  if (error instanceof HttpError) details = error.details
  else if (error instanceof Error && env.NODE_ENV === 'development')
    details = error.stack

  res.status(statusCode).json({ status: statusCode, message, details })
}
