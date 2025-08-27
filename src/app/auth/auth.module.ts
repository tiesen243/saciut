import { Module } from '@/core'

import AuthController from '@/app/auth/auth.controller'
import JwtGuard from '@/app/auth/auth.jwt'
import AuthService from '@/app/auth/auth.service'
import Google from '@/app/auth/providers/google'
import { users } from '@/common/services/drizzle.service/schema'
import { env } from '@/common/utils/env'

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
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    }),
  },
}

declare module '@/app/auth/lib/types' {
  type IUser = typeof users.$inferInsert

  interface User extends IUser {
    id: string
  }
}
