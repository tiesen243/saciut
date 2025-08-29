import { Module } from '@/core/common'

import { AppController } from '@/modules/app.controller'
import { AppService } from '@/modules/app.service'

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export default class AppModule {}
