import { Module } from '@/core/common'

import { AppController } from '@/modules/app.controller'

@Module({
  imports: [],
  controllers: [AppController],
  providers: [],
})
export default class AppModule {}
