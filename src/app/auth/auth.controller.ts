import type { Request, Response } from 'express'

import {
  Body,
  Controller,
  Cookies,
  Get,
  Guard,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@/core'

import type {
  CookiesType,
  OAuthParamsType,
  OAuthQueryType,
  SignInType,
  SignUpType,
} from '@/app/auth/auth.schema'
import JwtGuard from '@/app/auth/auth.jwt'
import { authConfig } from '@/app/auth/auth.module'
import {
  CookiesSchema,
  OAuthParamsSchema,
  OAuthQuerySchema,
  SignInSchema,
  SignUpSchema,
} from '@/app/auth/auth.schema'
import AuthService from '@/app/auth/auth.service'
import { generateStateOrCode } from '@/app/auth/lib/crypto'
import JwtService from '@/common/services/jwt.service'
import { HttpCode, HttpError } from '@/common/utils/http'

@Controller('/api/auth')
export default class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('/get-session')
  @Guard(JwtGuard)
  getSession(
    @Query(SignInSchema) query: SignInType,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    res.status(HttpCode.OK).json({
      status: HttpCode.OK,
      message: 'Get session successfully',
      data: req.user,
    })
  }

  @Post('/sign-up')
  async signUp(
    @Body(SignUpSchema) body: SignUpType,
    @Res() res: Response,
  ): Promise<void> {
    const { userId } = await this.authService.signUp(body)
    res.status(HttpCode.CREATED).json({
      status: HttpCode.CREATED,
      message: 'Sign up successfully',
      data: { userId },
    })
  }

  @Post('/sign-in')
  async signIn(
    @Body(SignInSchema) body: SignInType,
    @Res() res: Response,
  ): Promise<void> {
    const { expiresIn } = authConfig
    const { userId } = await this.authService.signIn(body)

    const token = await this.jwtService.sign(
      { sub: userId, aud: 'user' },
      expiresIn.asString,
    )

    res
      .status(HttpCode.OK)
      .cookie('auth.token', token, {
        ...cookieOptions,
        maxAge: expiresIn.asMilliseconds,
      })
      .json({
        status: HttpCode.OK,
        message: 'Sign in successfully',
        data: { userId, token },
      })
  }

  @Post('/sign-out')
  signOut(@Res() res: Response): void {
    res
      .status(HttpCode.OK)
      .clearCookie('auth.token', cookieOptions)
      .json({ status: HttpCode.OK, message: 'Sign out successfully' })
  }

  @Get('/:provider')
  async oauthRedirect(
    @Param(OAuthParamsSchema) params: OAuthParamsType,
    @Query(OAuthQuerySchema) query: OAuthQueryType,
    @Res() res: Response,
  ) {
    const { providers } = authConfig
    if (!(params.provider in providers))
      throw new HttpError('BAD_REQUEST', { message: 'Provider not supported' })

    const provider = providers[params.provider as keyof typeof providers]
    const state = generateStateOrCode()
    const codeVerifier = generateStateOrCode()
    const redirectUrl = query.redirect_uri ?? '/'

    const callbackUrl = await provider.createAuthorizationUrl(
      state,
      codeVerifier,
    )

    res
      .cookie('auth.state', state, cookieOptions)
      .cookie('auth.code', codeVerifier, cookieOptions)
      .cookie('auth.redirect', redirectUrl, cookieOptions)
      .redirect(callbackUrl.toString())
  }

  @Get('/callback/:provider')
  async oauthCallback(
    @Param(OAuthParamsSchema) params: OAuthParamsType,
    @Query(OAuthQuerySchema) query: OAuthQueryType,
    @Cookies(CookiesSchema) cookies: CookiesType,
    @Res() res: Response,
  ) {
    if (!(params.provider in authConfig.providers))
      throw new HttpError('BAD_REQUEST', { message: 'Provider not supported' })

    const { providers, expiresIn } = authConfig

    const provider = providers[params.provider as keyof typeof providers]
    if (
      query.state !== cookies['auth.state'] ||
      !query.code ||
      !cookies['auth.code']
    )
      throw new HttpError('FORBIDDEN', { message: 'Invalid state or code' })

    const userData = await provider.fetchUserData(
      query.code,
      cookies['auth.code'],
    )
    const { userId } = await this.authService.oauthSignIn({
      ...userData,
      provider: params.provider,
    })
    const token = await this.jwtService.sign(
      { sub: userId, aud: 'user' },
      expiresIn.asString,
    )

    res
      .status(HttpCode.OK)
      .cookie('auth.token', token, {
        ...cookieOptions,
        maxAge: expiresIn.asMilliseconds,
      })
      .clearCookie('auth.state', { path: '/' })
      .clearCookie('auth.code', { path: '/' })
      .clearCookie('auth.redirect', { path: '/' })
      .redirect(cookies['auth.redirect'] ?? '/')
  }
}

const cookieOptions = {
  path: '/',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
}
