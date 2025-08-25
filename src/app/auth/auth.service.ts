import { and, eq } from 'drizzle-orm'

import { Injectable } from '@/core'

import { SignInType, SignUpType } from '@/app/auth/auth.schema'
import { Password } from '@/app/auth/lib/password'
import DrizzleService from '@/common/services/drizzle.service'

@Injectable()
export default class AuthService {
  private readonly password = new Password()

  constructor(private readonly db: DrizzleService) {}

  async getUser(id: string): Promise<typeof this.db.schema.users.$inferSelect> {
    const { db, schema } = this.db

    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id))
    if (!user) throw new Error('You are not signed in or user not found')

    return user
  }

  async signUp(data: SignUpType): Promise<{ userId: string }> {
    const {
      db,
      schema: { accounts, users },
    } = this.db

    const [existingUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1)
    if (existingUser) throw new Error('User already exists')

    const [user] = await db
      .insert(users)
      .values({ name: data.name, email: data.email })
      .returning({ id: users.id })
    if (!user) throw new Error('Failed to create user')
    const [account] = await db
      .insert(accounts)
      .values({
        userId: user.id,
        accountId: user.id,
        provider: 'credentials',
        password: await this.password.hash(data.password),
      })
      .returning()
    if (!account) throw new Error('Failed to create account')

    return { userId: user.id }
  }

  async signIn(data: SignInType): Promise<{ userId: string }> {
    const {
      db,
      schema: { accounts, users },
    } = this.db

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
    if (!user?.password) throw new Error('Invalid credentials')

    const isValid = await this.password.verify(user.password, data.password)
    if (!isValid) throw new Error('Invalid credentials')

    return { userId: user.id }
  }
}
