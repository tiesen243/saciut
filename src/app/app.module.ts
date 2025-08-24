import { Module } from '@/core/decorators'

import AppController from '@/app/app.controller'
import AppService from '@/app/app.service'
import PostModule from '@/app/post/post.module'

@Module({
  imports: [PostModule],

  controllers: [AppController],
  providers: [AppService],
})
export default class AppModule {}
