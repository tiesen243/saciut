import * as z from 'zod'

export const CookiesSchema = z.object({
  'auth.token': z.string().startsWith('ey').optional(),
})
export type CookiesType = z.infer<typeof CookiesSchema>

export const UserSchema = z.object({
  id: z.cuid2(),
  name: z.string().min(2).max(100),
  email: z.email(),
  createdAt: z.date(),
})
export type UserType = z.infer<typeof UserSchema>

export const SignInSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?]).{8,}$/,
      'Password not strong enough',
    ),
})
export type SignInType = z.infer<typeof SignInSchema>

export const SignUpSchema = SignInSchema.extend({
  name: z.string().min(2).max(100),
})
export type SignUpType = z.infer<typeof SignUpSchema>
