import { and, eq } from 'drizzle-orm'

import { Injectable } from '@/core'

import { SignInType, SignUpType } from '@/app/auth/auth.schema'
import { Password } from '@/app/auth/lib/password'
import { Account, OauthAccount } from '@/app/auth/lib/types'
import DrizzleService from '@/common/services/drizzle.service'
import { HttpError } from '@/common/utils/http'

@Injectable()
export default class AuthService {
  private readonly password = new Password()

  constructor(private readonly drizzle: DrizzleService) {}

  async getUser(
    id: string,
  ): Promise<typeof this.drizzle.schema.users.$inferSelect> {
    const { db, schema } = this.drizzle

    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id))
    if (!user) throw new HttpError('NOT_FOUND', { message: 'User not found' })

    return user
  }

  async signUp(data: SignUpType): Promise<{ userId: string }> {
    const {
      db,
      schema: { accounts, users },
    } = this.drizzle

    const [existingUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1)
    if (existingUser)
      throw new HttpError('CONFLICT', { message: 'Email already in use' })

    const [user] = await db
      .insert(users)
      .values({ name: data.name, email: data.email })
      .returning({ id: users.id })
    if (!user)
      throw new HttpError('INTERNAL_SERVER_ERROR', {
        message: 'Failed to create user',
      })

    const [account] = await db
      .insert(accounts)
      .values({
        userId: user.id,
        accountId: user.id,
        provider: 'credentials',
        password: await this.password.hash(data.password),
      })
      .returning()
    if (!account)
      throw new HttpError('INTERNAL_SERVER_ERROR', {
        message: 'Failed to create account',
      })

    return { userId: user.id }
  }

  async signIn(data: SignInType): Promise<{ userId: string }> {
    const {
      db,
      schema: { accounts, users },
    } = this.drizzle

    const [user] = await db
      .select({ id: users.id, password: accounts.password })
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1)
      .innerJoin(
        accounts,
        and(
          eq(accounts.userId, users.id),
          eq(accounts.accountId, users.id),
          eq(accounts.provider, 'credentials'),
        ),
      )
    if (!user?.password)
      throw new HttpError('UNAUTHORIZED', { message: 'Invalid credentials' })

    const isValid = await this.password.verify(user.password, data.password)
    if (!isValid)
      throw new HttpError('UNAUTHORIZED', { message: 'Invalid credentials' })

    return { userId: user.id }
  }

  async oauthSignIn(
    data: Omit<OauthAccount & Account, 'userId' | 'password'>,
  ): Promise<{ userId: string }> {
    const { provider, accountId, ...userData } = data
    const {
      schema: { accounts, users },
    } = this.drizzle

    return await this.drizzle.db.transaction(async (tx) => {
      const [existingAccount] = await tx
        .select()
        .from(accounts)
        .where(
          and(
            eq(accounts.provider, provider),
            eq(accounts.accountId, accountId),
          ),
        )
      if (existingAccount) return existingAccount

      const [existingUser] = await tx
        .select()
        .from(users)
        .where(eq(users.email, userData.email))
      const userId =
        existingUser?.id ??
        (await tx
          .insert(users)
          .values(userData)
          .returning({ id: users.id })
          .then((res) => res.at(0)?.id))
      if (!userId)
        throw new HttpError('INTERNAL_SERVER_ERROR', {
          message: 'Failed to create user',
        })
      await tx.insert(accounts).values({ provider, accountId, userId })
      return { userId }
    })
  }
}
