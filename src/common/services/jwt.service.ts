import type { JWTPayload } from 'jose'
import { jwtVerify, SignJWT } from 'jose'

import { Injectable } from '@/core'

import { env } from '@/common/utils/env'

@Injectable()
export default class JwtService {
  private secret = env.AUTH_SECRET
  private alg = 'HS256'

  async sign(payload: JWTPayload, expiresIn = '1h'): Promise<string | null> {
    try {
      const jwt = new SignJWT(payload)
      jwt.setProtectedHeader({ alg: this.alg })
      jwt.setIssuedAt()
      jwt.setExpirationTime(expiresIn)
      return await jwt.sign(new TextEncoder().encode(this.secret))
    } catch (error) {
      console.error('JWT signing failed:', error)
      return null
    }
  }

  async verify<T = JWTPayload>(token: string): Promise<T | null> {
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(this.secret),
      )
      return payload as T
    } catch (error) {
      console.error('JWT verification failed:', error)
      return null
    }
  }
}
