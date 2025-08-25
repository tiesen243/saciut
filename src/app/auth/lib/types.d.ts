import type BaseProvider from '@/app/auth/providers/base'

export interface OAuth2Token {
  access_token: string
  token_type: string
  expires_in: number
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface User {}

export interface Account {
  provider: string
  accountId: string
  userId: string
  password: string | null
}

export interface OauthAccount {
  accountId: string
  email: string
  name: string
  image: string
}

export interface AuthOptions {
  providers: Record<string, BaseProvider>
}
