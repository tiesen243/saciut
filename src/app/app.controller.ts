import type { Response } from 'express'

import { Controller, Get, Guard, Res } from '@/core/common'

import { AppService } from '@/app/app.service'
import { ExampleGuard } from '@/app/example.guard'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  index(@Res() res: Response) {
    res.send(this.appService.getHello())
  }

  @Get('/private')
  @Guard(ExampleGuard)
  private(@Res() res: Response) {
    res.send('This is a private route')
  }
}
