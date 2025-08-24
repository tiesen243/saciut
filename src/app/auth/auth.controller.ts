import type { Response } from 'express'

import { Controller, Get, Res } from '@/core'

import { formatDate } from '@/common/utils/date.util'

@Controller('/auth')
export default class AuthController {
  @Get('/')
  getStatus(@Res() res: Response) {
    res.json({
      message: 'Auth service is running',
      timestamp: formatDate(new Date()),
    })
  }
}
