import { pgTable } from 'drizzle-orm/pg-core'

export const posts = pgTable('post', (t) => ({
  id: t.uuid().primaryKey().defaultRandom().notNull(),
  title: t.text().notNull(),
  content: t.text().notNull(),
  createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: t
    .timestamp({ withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
}))
