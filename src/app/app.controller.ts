import type { Response } from 'express'

import { Controller, Get, Res } from '@/core'

@Controller()
export default class AppController {
  @Get('/')
  getHello(@Res() res: Response): void {
    res.render('index')
  }
}
