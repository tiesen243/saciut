import { Injectable } from '@/core'

import DrizzleService from '@/common/services/drizzle.service'

@Injectable()
export default class PostService {
  constructor(private readonly db: DrizzleService) {}
}
