import type { Request, Response } from 'express'

import { Controller, Get } from '@/core/decorators'

import PostService from '@/app/post/post.service'

@Controller('/posts')
export default class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('/')
  getPosts(_: Request, res: Response): void {
    res.status(200).json({ data: this.postService.getPosts() })
  }
}
