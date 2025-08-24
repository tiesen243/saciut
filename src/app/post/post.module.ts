import { Module } from '@/core/decorators'

import PostController from '@/app/post/post.controller'
import PostService from '@/app/post/post.service'

@Module({
  controllers: [PostController],
  providers: [PostService],
})
export default class PostModule {}
