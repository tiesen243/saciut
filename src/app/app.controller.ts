import { Controller, Get, Guard, Query } from '@/core/common'

import type { QueryType } from '@/app/app.schema'
import { QuerySchema } from '@/app/app.schema'
import { AppService } from '@/app/app.service'
import { ExampleGuard } from '@/app/example.guard'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  index() {
    return this.appService.getHello()
  }

  @Get('/private')
  @Guard(ExampleGuard)
  private() {
    return {
      message: 'You have access to the private route!',
    }
  }

  @Get('/query')
  query(@Query(QuerySchema) query: QueryType) {
    return {
      message: 'This is a query route example.',
      query,
    }
  }
}
