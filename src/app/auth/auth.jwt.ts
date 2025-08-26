import { NextFunction, Request, Response } from 'express'

import { CanActivate, Injectable } from '@/core'

import { CookiesSchema } from '@/app/auth/auth.schema'
import AuthService from '@/app/auth/auth.service'
import { User } from '@/app/auth/lib/types'
import JwtService from '@/common/services/jwt.service'
import { HttpError } from '@/common/utils/http'

@Injectable()
export default class JwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(
    req: Request,
    _res: Response,
    _next: NextFunction,
  ): Promise<boolean> {
    const cookies = CookiesSchema.parse(req.cookies)
    const token =
      cookies['auth.token'] ??
      req.headers.authorization?.replace('Bearer ', '') ??
      ''
    if (!token) throw new HttpError('UNAUTHORIZED')

    try {
      const payload = await this.jwtService.verify(token)
      const user = await this.authService.getUser(payload?.sub ?? '')
      req.user = user
      return true
    } catch {
      throw new HttpError('UNAUTHORIZED')
    }
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: User
    }
  }
}
