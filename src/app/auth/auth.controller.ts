import type { Response } from 'express'

import { Body, Controller, Cookies, Get, Headers, Post, Res } from '@/core'

import type {
  CookiesType,
  SignInType,
  SignUpType,
} from '@/app/auth/auth.schema'
import {
  CookiesSchema,
  SignInSchema,
  SignUpSchema,
} from '@/app/auth/auth.schema'
import AuthService from '@/app/auth/auth.service'
import JwtService from '@/common/services/jwt.service'

@Controller('/api/auth')
export default class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('/get-session')
  async getSession(
    @Headers() headers: Record<string, string>,
    @Cookies(CookiesSchema) cookies: CookiesType,
    @Res() res: Response,
  ) {
    const token =
      cookies['auth.token'] ??
      headers.authorization?.replace('Bearer ', '') ??
      ''
    const decoded = await this.jwtService.verify(token)

    try {
      const user = await this.authService.getUser(decoded?.sub ?? '')
      res.json({
        status: 200,
        message: 'Get session successfully',
        data: user,
      })
    } catch (error) {
      res.status(401).json({
        status: 401,
        message: 'Get session failed',
        details: error instanceof Error ? error.message : error,
      })
    }
  }

  @Post('/sign-up')
  async signUp(
    @Body(SignUpSchema) body: SignUpType,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const { userId } = await this.authService.signUp(body)
      res.status(201).json({
        status: 201,
        message: 'Sign up successfully',
        data: { userId },
      })
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: 'Sign up failed',
        details: error instanceof Error ? error.message : error,
      })
    }
  }

  @Post('/sign-in')
  async signIn(
    @Body(SignInSchema) body: SignInType,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const { userId } = await this.authService.signIn(body)
      const token = await this.jwtService.sign({ sub: userId }, '7d')
      res
        .cookie('auth.token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
        .json({
          status: 200,
          message: 'Sign in successfully',
          data: { userId, token },
        })
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: 'Sign in failed',
        details: error instanceof Error ? error.message : error,
      })
    }
  }

  @Post('/sign-out')
  signOut(@Res() res: Response): void {
    res
      .clearCookie('auth.token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      })
      .json({
        status: 200,
        message: 'Sign out successfully',
      })
  }
}
