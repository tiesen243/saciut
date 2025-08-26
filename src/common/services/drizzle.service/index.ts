import { drizzle } from 'drizzle-orm/node-postgres'

import { Injectable } from '@/core'

import { env } from '@/common/utils/env'
import * as schema from './schema'

@Injectable()
export default class DrizzleService {
  private connectionString = `postgresql://${env.DB_USER}:${encodeURIComponent(env.DB_PASSWORD)}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}?schema=public`
  private instance

  constructor() {
    this.instance = drizzle(this.connectionString, {
      schema,
      casing: 'snake_case',
    })
  }

  get db() {
    return this.instance
  }

  get schema() {
    return schema
  }
}
