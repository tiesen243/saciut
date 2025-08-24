import { eq } from 'drizzle-orm'

import { Injectable } from '@/core'

import DrizzleService from '@/common/services/drizzle.service'

@Injectable()
export default class PostService {
  private posts

  constructor(private readonly db: DrizzleService) {
    this.posts = db.schema.posts
  }

  async getPosts(): Promise<(typeof this.posts.$inferSelect)[]> {
    const posts = await this.db.select().from(this.posts)
    return posts
  }

  async getPost(id: string): Promise<typeof this.posts.$inferSelect | null> {
    const post = await this.db
      .select()
      .from(this.posts)
      .where(eq(this.posts.id, id))
      .limit(1)
    return post[0] ?? null
  }
}
