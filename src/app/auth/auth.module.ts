import { Module } from '@/core'

import AuthController from '@/app/auth/auth.controller'

@Module({
  controllers: [AuthController],
  providers: [],
})
export default class AuthModule {}
