import * as z from 'zod'

export const FindManySchema = z.object({
  title: z.string().min(1).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
})
export type FindManyType = z.infer<typeof FindManySchema>

export const FindOneSchema = z.object({
  id: z.cuid2(),
})
export type FindOneType = z.infer<typeof FindOneSchema>

export const PostSchema = z.object({
  id: z.cuid2(),
  title: z.string().min(1).max(255),
  content: z.string().min(1),
  author: z.object({
    id: z.cuid2(),
    name: z.string().min(2).max(100),
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
})
export type PostType = z.infer<typeof PostSchema>

export const StorePostSchema = z.object({
  id: z
    .cuid2()
    .or(z.literal(''))
    .optional()
    .transform((val) => (val === '' ? undefined : val)),
  title: z.string().min(1).max(255),
  content: z.string().min(1),
})
export type StorePostType = z.infer<typeof StorePostSchema>
