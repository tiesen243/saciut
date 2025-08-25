import { eq } from 'drizzle-orm'

import { Injectable } from '@/core'

import { SignInType, SignUpType } from '@/app/auth/auth.schema'
import DrizzleService from '@/common/services/drizzle.service'

@Injectable()
export default class AuthService {
  constructor(private readonly db: DrizzleService) {}

  async getUser(
    id: string,
  ): Promise<typeof this.db.schema.users.$inferSelect | null> {
    const { users } = this.db.schema
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1)
    return user ?? null
  }

  async signUp(data: SignUpType): Promise<{ id: string }> {
    const { users } = this.db.schema

    const [existingUser] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1)
    if (existingUser) throw new Error('User already exists')

    const [user] = await this.db
      .insert(users)
      .values({
        name: data.name,
        email: data.email,
        password: data.password,
      })
      .returning({ id: users.id })
    return user ?? { id: '' }
  }

  async signIn(data: SignInType): Promise<{ id: string }> {
    const { users } = this.db.schema

    const [user] = await this.db
      .select({ id: users.id, password: users.password })
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1)
    if (!user) throw new Error('User not found')
    if (user.password !== data.password) throw new Error('Invalid password')
    return user
  }
}
