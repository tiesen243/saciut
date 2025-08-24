import { defineConfig } from 'drizzle-kit'

const connectionString = `postgresql://${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PASSWORD ?? '')}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?schema=public`

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: { url: connectionString },
  schema: './src/services/drizzle.service/schema.ts',
  casing: 'snake_case',
  strict: true,
})
