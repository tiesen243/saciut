import { Module } from '@/core/common'

import { AppController } from '@/app/app.controller'
import { AppService } from '@/app/app.service'

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export default class AppModule {}
