import * as z from 'zod/v4'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  APP_URL: z.string().optional(),
  PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default(3000),

  AUTH_SECRET: z.string().min(1, 'AUTH_SECRET is required'),

  AUTH_GOOGLE_ID: z.string().min(1, 'AUTH_GOOGLE_ID is required'),
  AUTH_GOOGLE_SECRET: z.string().min(1, 'AUTH_GOOGLE_SECRET is required'),

  DB_NAME: z.string().min(1, 'DB_NAME is required'),
  DB_USER: z.string().min(1, 'DB_USER is required'),
  DB_PASSWORD: z.string().min(1, 'DB_PASSWORD is required'),
  DB_HOST: z.string().min(1, 'DB_HOST is required'),
  DB_PORT: z
    .string()
    .min(1, 'DB_PORT is required')
    .transform((val) => parseInt(val, 10)),
})

const createEnv = () => {
  const parsedEnv = envSchema.safeParse(process.env)

  if (!parsedEnv.success) {
    console.error(
      '❌ Invalid environment variables:',
      z.flattenError(parsedEnv.error).fieldErrors,
    )
    process.exit(1)
  }

  return parsedEnv.data
}

export const env = createEnv()
