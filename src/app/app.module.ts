import { Module } from '@/core'

import AppController from '@/app/app.controller'
import AuthModule from '@/app/auth/auth.module'
import PostModule from '@/app/post/post.module'
import DrizzleService from '@/common/services/drizzle.service'

@Module({
  imports: [AuthModule, PostModule],
  controllers: [AppController],
  providers: [DrizzleService],
})
export default class AppModule {}
