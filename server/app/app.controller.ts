import { Controller, Get } from '@/core/common'

@Controller('/api')
export class AppController {
  @Get('/')
  index() {
    return {
      message: 'Welcome to the API!',
    }
  }
}
