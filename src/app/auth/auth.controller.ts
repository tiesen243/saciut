import type { Response } from 'express'

import { Body, Controller, Cookies, Get, Post, Res } from '@/core'

import type { CookieType, SignInType, SignUpType } from '@/app/auth/auth.schema'
import {
  CookieSchema,
  SignInSchema,
  SignUpSchema,
} from '@/app/auth/auth.schema'
import AuthService from '@/app/auth/auth.service'
import JwtService from '@/common/services/jwt.service'
import { formatDate } from '@/common/utils/date.util'

@Controller('/auth')
export default class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('/')
  async getStatus(
    @Cookies(CookieSchema) cookies: CookieType,
    @Res() res: Response,
  ) {
    const jwt = await this.jwtService.verify(cookies['auth.token'] ?? '')
    const user = await this.authService.getUser(jwt?.sub ?? '')

    res.json({
      user,
      timestamp: formatDate(new Date()),
    })
  }

  @Post('/register')
  async register(@Body(SignUpSchema) body: SignUpType, @Res() res: Response) {
    try {
      const user = await this.authService.signUp(body)
      res.status(201).json({ message: 'User registered', userId: user.id })
    } catch (error) {
      res.status(400).json({ message: (error as Error).message })
    }
  }

  @Post('/login')
  async login(@Body(SignInSchema) body: SignInType, @Res() res: Response) {
    try {
      const user = await this.authService.signIn(body)
      const token = await this.jwtService.sign({ sub: user.id }, '7d')

      res
        .cookie('auth.token', token, {
          httpOnly: true,
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .json({ message: 'Login successful' })
    } catch (error) {
      res.status(401).json({ message: (error as Error).message })
    }
  }
}
