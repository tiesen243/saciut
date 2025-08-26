import type { Response } from 'express'

import { Controller, Get, Guard, Res } from '@/core'

import JwtGuard from '@/app/auth/auth.jwt'

@Controller()
export default class AppController {
  @Get('/')
  index(@Res() res: Response): void {
    res.render('index')
  }

  @Get('/protected')
  @Guard(JwtGuard)
  protected(@Res() res: Response): void {
    res.json({ message: 'You have accessed a protected route!' })
  }
}
