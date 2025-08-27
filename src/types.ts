import type AuthService from '@/app/auth/auth.service'
import type PostService from '@/app/post/post.service'

interface Controllers {
  auth: AuthService
  post: PostService
}

type InferOutputs<T> = {
  [K in keyof T]: {
    [M in keyof T[K]]: T[K][M] extends (...args: never[]) => Promise<infer R>
      ? {
          status: number
          message: string
          data: R
        }
      : never
  }
}

type InferInput<T> = {
  [K in keyof T]: {
    [M in keyof T[K]]: T[K][M] extends (
      arg: infer A,
      ...args: never[]
    ) => Promise<unknown>
      ? A
      : never
  }
}

export type Inputs = InferInput<Controllers>
export type Outputs = InferOutputs<Controllers>
