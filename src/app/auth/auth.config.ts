import Google from '@/app/auth/providers/google'

export const authConfig = {
  providers: {
    discord: new Google({
      clientId: process.env.AUTH_GOOGLE_ID ?? '',
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? '',
    }),
  },
} as const
