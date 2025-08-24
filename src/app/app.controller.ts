import type { Response } from 'express'

import { Controller, Get, Res } from '@/core'

import AppService from '@/app/app.service'

@Controller()
export default class AppController {
  constructor(private appService: AppService) {}

  @Get('/')
  getHello(@Res() res: Response): void {
    res.render('index', { message: this.appService.getHello() })
  }
}
