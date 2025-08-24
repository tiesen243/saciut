import type { Request, Response } from 'express'

import { Controller, Get } from '@/core/decorators'

import AppService from '@/app/app.service'

@Controller()
export default class AppController {
  constructor(private appService: AppService) {}

  @Get('/')
  getHello(_: Request, res: Response): void {
    res.send(this.appService.getHello())
  }

  @Get('/health')
  getHealth(_: Request, res: Response): void {
    res.send('OK')
  }
}
