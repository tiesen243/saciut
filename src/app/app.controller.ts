import type { Response } from 'express'

import { Controller, Get, Res } from '@/core'

@Controller()
export default class AppController {
  @Get('/')
  index(@Res() res: Response): void {
    res.render('index')
  }

  @Get('/protected')
  protected(@Res() res: Response): void {
    res.json({ message: 'You have accessed a protected route!' })
  }
}
