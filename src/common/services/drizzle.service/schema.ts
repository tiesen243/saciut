import { relations } from 'drizzle-orm'
import { pgTable, primaryKey } from 'drizzle-orm/pg-core'

export const users = pgTable('user', (t) => ({
  id: t.varchar({ length: 25 }).primaryKey().$defaultFn(cuid).notNull(),
  name: t.varchar({ length: 255 }).notNull(),
  email: t.varchar({ length: 320 }).notNull().unique(),
  createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: t
    .timestamp({ withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
}))

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  posts: many(posts),
}))

export const accounts = pgTable(
  'account',
  (t) => ({
    provider: t.varchar({ length: 25 }).notNull(),
    accountId: t.varchar({ length: 128 }).notNull(),
    password: t.varchar({ length: 255 }),
    userId: t
      .varchar({ length: 25 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  }),
  (account) => [primaryKey({ columns: [account.provider, account.accountId] })],
)

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}))

export const posts = pgTable('post', (t) => ({
  id: t.varchar({ length: 25 }).primaryKey().$defaultFn(cuid).notNull(),
  title: t.varchar({ length: 255 }).notNull(),
  content: t.text().notNull(),
  authorId: t
    .varchar({ length: 25 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: t
    .timestamp({ withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
}))

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}))

function cuid(): string {
  const alphabet = 'abcdefghijklmnpqrstuvwxyz0123456789'
  const timestamp = Date.now().toString(36).padStart(8, '0')

  const randomBytes = crypto.getRandomValues(new Uint8Array(16))
  const randomPart = Array.from(
    randomBytes,
    (byte) => alphabet[byte % alphabet.length],
  ).join('')

  return `c${timestamp}${randomPart}`
}
