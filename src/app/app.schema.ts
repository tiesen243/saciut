import z from 'zod'

export const QuerySchema = z.object({
  page: z.coerce.number().int().min(1),
})
export type QueryType = z.infer<typeof QuerySchema>
