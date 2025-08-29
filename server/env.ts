import * as z from 'zod/v4'

export const env = createEnv({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
})

function createEnv<TSchema extends Record<string, z.ZodType>>(schema: TSchema) {
  const parsed = z.object(schema).safeParse(process.env)
  if (!parsed.success) {
    console.error(
      '❌ Invalid environment variables:',
      z.flattenError(parsed.error).fieldErrors,
    )
    process.exit(1)
  }
  return parsed.data as z.infer<z.ZodObject<TSchema>>
}
