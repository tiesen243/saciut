import * as jose from 'jose'

import type {
  Descriptor,
  MethodDecorator,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from '@/core/types'

export default class Auth {
  public static AUTH_KEY = 'auth.token'

  public async signToken(
    payload: { userId: string },
    secret: string,
  ): Promise<string> {
    return new jose.SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .sign(Buffer.from(secret))
  }

  public async verifyToken(
    token: string,
    secret: string,
  ): Promise<{ userId: string } | null> {
    try {
      const { payload } = await jose.jwtVerify(token, Buffer.from(secret))
      return payload as { userId: string } | null
    } catch {
      return null
    }
  }

  public static middleware(): RequestHandler {
    return async function AuthMiddleware(
      req: Request,
      _: Response,
      next: NextFunction,
    ): Promise<void> {
      const token = String(
        req.cookies[Auth.AUTH_KEY] ??
          req.headers.authorization?.split('Bearer ').at(1) ??
          '',
      )
      const secret = process.env.AUTH_SECRET ?? ''

      const payload = await new Auth().verifyToken(token, secret)
      req.userId = payload?.userId ?? ''

      next()
    }
  }

  public static Guard() {
    return function AuthDecorator(
      _: object,
      __: MethodDecorator,
      descriptor: Descriptor,
    ): Descriptor {
      const treatedDescriptor = descriptor as unknown as {
        value: (...args: Parameters<RequestHandler>) => void
      }

      const originalMethod = treatedDescriptor.value
      treatedDescriptor.value = function AuthMiddleware(
        ...args: Parameters<typeof originalMethod>
      ): void {
        const req = args[0]
        if (!req.userId) args[1].status(401).send('Unauthorized')
        else originalMethod.apply(this, args)
      }

      return treatedDescriptor as unknown as Descriptor
    }
  }
}
