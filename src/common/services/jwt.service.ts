import type { JWTPayload } from 'jose'
import { jwtVerify, SignJWT } from 'jose'

import { Injectable } from '@/core'

@Injectable()
export default class JwtService {
  private secret = process.env.AUTH_SECRET ?? ''
  private alg = 'HS256'

  async sign(payload: JWTPayload, expiresIn = '1h'): Promise<string> {
    const jwt = new SignJWT(payload)
    jwt.setProtectedHeader({ alg: this.alg })
    jwt.setIssuedAt()
    jwt.setExpirationTime(expiresIn)

    return jwt.sign(new TextEncoder().encode(this.secret))
  }

  async verify<T = JWTPayload>(token: string): Promise<T> {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(this.secret),
    )
    return payload as T
  }
}
