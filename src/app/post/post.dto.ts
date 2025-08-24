import * as z from 'zod'

export const QuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
})
export type QueryType = z.infer<typeof QuerySchema>

export const CreatePostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
})
export type CreatePostType = z.infer<typeof CreatePostSchema>
