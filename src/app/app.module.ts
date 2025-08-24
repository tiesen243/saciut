import { Module } from '@/core'

import AppController from '@/app/app.controller'
import AuthModule from '@/app/auth/auth.module'
import PostModule from '@/app/post/post.module'
import DrizzleService from '@/common/services/drizzle.service'
import JwtService from '@/common/services/jwt.service'

@Module({
  imports: [AuthModule, PostModule],
  controllers: [AppController],
  providers: [DrizzleService, JwtService],
})
export default class AppModule {}
