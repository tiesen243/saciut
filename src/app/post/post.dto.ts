import * as z from 'zod'

import { Dto } from '@/core'

export class GetPostsDto extends Dto {
  static override query = z.object({
    page: z.coerce.number().int(),
  })
}

export class CreatePostDto extends Dto {
  static override body = z.object({
    title: z.string().min(5).max(100),
    content: z.string().min(20),
  })
}
