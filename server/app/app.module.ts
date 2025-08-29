import { Module } from '@/core/common'

import { AppController } from '@/app/app.controller'

@Module({
  imports: [],
  controllers: [AppController],
  providers: [],
})
export default class AppModule {}
