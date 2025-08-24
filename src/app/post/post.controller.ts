import type { Request, Response } from 'express'

import { Controller, DTO, Get, Post } from '@/core'

import { CreatePostDto, GetPostsDto } from '@/app/post/post.dto'
import PostService from '@/app/post/post.service'

@Controller('/posts')
export default class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('/')
  @DTO(GetPostsDto)
  getPosts(req: Request, res: Response): void {
    console.log(req.query)

    res.status(200).json({ data: this.postService.getPosts() })
  }

  @Post('/')
  @DTO(CreatePostDto)
  createPost(req: Request, res: Response): void {
    console.log(req.body)
    res.status(201).json({ message: 'Post created' })
  }
}
