import type { Response } from 'express'

import { Controller, Get, Res } from '@/core'

import AuthService from '@/app/auth/auth.service'

@Controller('/auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/status')
  getStatus(@Res() res: Response) {
    res.json({ status: 'ok', timestamp: Date.now() })
  }
}
