import { relations } from 'drizzle-orm'
import { pgTable } from 'drizzle-orm/pg-core'

export const users = pgTable('user', (t) => ({
  id: t.uuid().primaryKey().defaultRandom().notNull(),
  name: t.varchar({ length: 256 }).notNull(),
  email: t.varchar({ length: 256 }).notNull().unique(),
  password: t.varchar({ length: 512 }).notNull(),
  createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: t
    .timestamp({ withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
}))

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}))

export const posts = pgTable('post', (t) => ({
  id: t.uuid().primaryKey().defaultRandom().notNull(),
  title: t.text().notNull(),
  content: t.text().notNull(),
  authorId: t
    .uuid()
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: t
    .timestamp({ withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
}))

export const postsRelations = relations(posts, ({ one }) => ({
  auther: one(users, { fields: [posts.authorId], references: [users.id] }),
}))
