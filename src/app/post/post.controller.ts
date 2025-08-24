import type { Response } from 'express'

import { Body, Controller, Get, Post, Query, Res } from '@/core'

import type { CreatePostType, QueryType } from '@/app/post/post.dto'
import { CreatePostSchema, QuerySchema } from '@/app/post/post.dto'
import PostService from '@/app/post/post.service'

@Controller('/posts')
export default class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('/')
  getPosts(@Query(QuerySchema) query: QueryType, @Res() res: Response): void {
    res.status(200).json({ data: this.postService.getPosts(), query })
  }

  @Post('/')
  createPost(
    @Body(CreatePostSchema) body: CreatePostType,
    @Res() res: Response,
  ): void {
    res.status(201).json({ message: 'Post created', post: body })
  }
}
