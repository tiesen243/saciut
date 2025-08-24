import z from 'zod'

export const schema = {
  query: z.object({
    page: z.coerce.number().int(),
  }),

  body: z.object({
    q: z.string().min(3),
  }),
}

export type Schema = {
  [K in keyof typeof schema]: z.infer<(typeof schema)[K]>
}
