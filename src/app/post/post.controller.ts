import type { Response } from 'express'

import { Controller, Get, Param, Res } from '@/core'

import type { ParamType } from '@/app/post/post.schema'
import { ParamSchema } from '@/app/post/post.schema'
import PostService from '@/app/post/post.service'

@Controller('/posts')
export default class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('/')
  async getPosts(@Res() res: Response): Promise<void> {
    const posts = await this.postService.getPosts()
    res.status(200).json({ data: posts })
  }

  @Get('/:id')
  async getPost(
    @Param(ParamSchema) params: ParamType,
    @Res() res: Response,
  ): Promise<void> {
    const post = await this.postService.getPost(params.id)
    if (!post) res.status(404).json({ message: 'Post not found' })
    else res.status(200).json({ data: post })
  }
}
