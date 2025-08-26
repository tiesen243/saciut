import { Module } from '@/core'

import AuthController from '@/app/auth/auth.controller'
import JwtGuard from '@/app/auth/auth.jwt'
import AuthService from '@/app/auth/auth.service'
import Google from '@/app/auth/providers/google'

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtGuard],
})
export default class AuthModule {}

export const authConfig = {
  expiresIn: {
    asString: '7d',
    asMilliseconds: 60 * 60 * 24 * 7 * 1000, // 7 days
  },
  providers: {
    google: new Google({
      clientId: process.env.AUTH_GOOGLE_ID ?? '',
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? '',
    }),
  },
}
