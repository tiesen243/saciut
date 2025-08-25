import * as z from 'zod'

export const CookieSchema = z.object({
  'auth.token': z.string().min(1).optional(),
})
export type CookieType = z.infer<typeof CookieSchema>

export const SignUpSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(8),
})
export type SignUpType = z.infer<typeof SignUpSchema>

export const SignInSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
})
export type SignInType = z.infer<typeof SignInSchema>
