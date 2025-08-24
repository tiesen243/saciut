import { Module } from '@/core'

import AppController from '@/app/app.controller'
import AppService from '@/app/app.service'
import AuthModule from '@/app/auth/auth.module'
import PostModule from '@/app/post/post.module'

@Module({
  imports: [AuthModule, PostModule],
  controllers: [AppController],
  providers: [AppService],
})
export default class AppModule {}
