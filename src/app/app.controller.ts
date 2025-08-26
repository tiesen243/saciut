import type { Response } from 'express'

import { Controller, Get, Res } from '@/core'

@Controller()
export default class AppController {
  @Get('/api/health')
  health(@Res() res: Response) {
    return res.status(200).json({ status: 'ok' })
  }
}
