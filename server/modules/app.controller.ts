import { Controller, Get } from '@/core/common'

import { AppService } from '@/modules/app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  index() {
    return this.appService.getHello()
  }
}
