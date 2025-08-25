import type { Response } from 'express'

import { Controller, Get, Res } from '@/core'

import PostService from '@/app/post/post.service'

@Controller('/posts')
export default class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('/')
  getPosts(@Res() res: Response): void {
    res.status(200).json({ message: 'Posts fetched successfully' })
  }
}
