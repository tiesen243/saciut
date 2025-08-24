import { Injectable } from '@/core/decorators'

@Injectable()
export default class PostService {
  getPosts(): string[] {
    return ['Post 1', 'Post 2', 'Post 3']
  }
}
