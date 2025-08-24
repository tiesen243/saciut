import type { Schema } from '@/app/schemas/home.schema'
import type { Request, Response } from '@/core/types'
import { schema } from '@/app/schemas/home.schema'
import Auth from '@/app/services/auth'
import { Body, Query } from '@/app/services/validate'
import { Controller, Get, Post } from '@/core/decorators'

@Controller('/')
export default class HomeController {
  @Get('/')
  @Query(schema.query)
  public index(req: Request<Schema['query']>, res: Response): void {
    res.json({ message: 'Hello, world!', query: req.validatedQuery })
  }

  @Get('/health')
  @Auth.Guard()
  public health(_: Request, res: Response): void {
    res.status(200).send('OK')
  }

  @Post('/test')
  @Body(schema.body)
  public test(req: Request<never, Schema['body']>, res: Response): void {
    console.log(req.validatedBody)
    res.json({ message: 'Test successful', data: req.validatedBody })
  }
}
