import { desc, eq, ilike } from 'drizzle-orm'

import { Injectable } from '@/core'

import { FindManyType, StorePostType } from '@/app/post/post.schema'
import DrizzleService from '@/common/services/drizzle.service'
import { HttpError } from '@/common/utils/http'

@Injectable()
export default class PostService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async findMany(options: FindManyType) {
    const {
      db,
      schema: { posts, users },
    } = this.drizzleService

    const query = db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        author: { id: users.id, name: users.name },
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
      })
      .from(posts)
      .orderBy(desc(posts.createdAt))
      .innerJoin(users, eq(posts.authorId, users.id))

    query.limit(options.limit).offset((options.page - 1) * options.limit)

    if (options.title) query.where(ilike(posts.title, `%${options.title}%`))

    return query.execute()
  }

  async findOne(id: string) {
    const {
      db,
      schema: { posts, users },
    } = this.drizzleService

    const [post] = await db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        author: { id: users.id, name: users.name },
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
      })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .where(eq(posts.id, id))
      .limit(1)

    if (!post) throw new HttpError('NOT_FOUND', { message: 'Post not found' })
    return post
  }

  async store(data: StorePostType, authorId: string) {
    const {
      db,
      schema: { posts },
    } = this.drizzleService

    const [post] = await db
      .insert(posts)
      .values({ ...data, authorId })
      .onConflictDoUpdate({
        target: [posts.id],
        set: { ...data, authorId },
      })
      .returning({ id: posts.id })

    if (!post)
      throw new HttpError('INTERNAL_SERVER_ERROR', {
        message: 'Failed to create or update post',
      })

    return post
  }

  async deleteOne(id: string, authorId: string) {
    const {
      db,
      schema: { posts },
    } = this.drizzleService

    const post = await this.findOne(id)
    if (post.author.id !== authorId)
      throw new HttpError('FORBIDDEN', {
        message: 'You do not have permission to delete this post',
      })

    await db.delete(posts).where(eq(posts.id, id))
    return null
  }
}
