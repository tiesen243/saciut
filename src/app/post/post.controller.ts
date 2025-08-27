import type { Response } from 'express'

import {
  Body,
  Controller,
  Delete,
  Get,
  Guard,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@/core'

import type {
  FindManyType,
  FindOneType,
  StorePostType,
} from '@/app/post/post.schema'
import JwtGuard from '@/app/auth/auth.jwt'
import {
  FindManySchema,
  FindOneSchema,
  StorePostSchema,
} from '@/app/post/post.schema'
import PostService from '@/app/post/post.service'
import { HttpCode } from '@/common/utils/http'

@Controller('/api/posts')
export default class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('/')
  async getPosts(
    @Query(FindManySchema) query: FindManyType,
    @Res() res: Response,
  ): Promise<void> {
    const posts = await this.postService.findMany(query)
    res.status(HttpCode.OK).json({
      status: HttpCode.OK,
      message: 'Posts retrieved successfully',
      data: posts,
    })
  }

  @Get('/:id')
  async getPost(
    @Param(FindOneSchema) param: FindOneType,
    @Res() res: Response,
  ): Promise<void> {
    const post = await this.postService.findOne(param.id)
    res.status(HttpCode.OK).json({
      status: HttpCode.OK,
      message: 'Post retrieved successfully',
      data: post,
    })
  }

  @Post('/')
  @Guard(JwtGuard)
  async storePost(
    @Body(StorePostSchema) body: StorePostType,
    @Req() req: { user: { id: string } },
    @Res() res: Response,
  ): Promise<void> {
    const post = await this.postService.store(body, req.user.id)
    res.status(HttpCode.CREATED).json({
      status: HttpCode.CREATED,
      message: 'Post stored successfully',
      data: post,
    })
  }

  @Delete('/:id')
  @Guard(JwtGuard)
  async deletePost(
    @Param(FindOneSchema) param: FindOneType,
    @Req() req: { user: { id: string } },
    @Res() res: Response,
  ): Promise<void> {
    const post = await this.postService.deleteOne(param.id, req.user.id)
    res.status(HttpCode.OK).json({
      status: HttpCode.OK,
      message: 'Post deleted successfully',
      data: post,
    })
  }
}
