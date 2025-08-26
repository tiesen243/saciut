import type { Response } from 'express'

import { Controller, Get, Res } from '@/core'

import DrizzleService from '@/common/services/drizzle.service'

@Controller()
export default class AppController {
  constructor(private readonly drizzle: DrizzleService) {}

  @Get('/api/health')
  async health(@Res() res: Response) {
    let isDatabaseConnected = true
    try {
      await this.drizzle.db.execute('SELECT 1')
    } catch {
      isDatabaseConnected = false
    }

    return res.status(200).json({
      status: 'ok',
      database: isDatabaseConnected ? 'connected' : 'disconnected',
    })
  }
}
