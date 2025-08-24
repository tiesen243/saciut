import type { Request, Response } from '@/core/types'
import { Controller, Get } from '@/core/decorators'

@Controller('/posts')
export default class PostController {
  @Get('/')
  public index(_: Request, res: Response): void {
    res.send('List of posts')
  }
}
