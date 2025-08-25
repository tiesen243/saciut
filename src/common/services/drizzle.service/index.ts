import { drizzle } from 'drizzle-orm/node-postgres'

import { Injectable } from '@/core'

import * as schema from './schema'

@Injectable()
export default class DrizzleService {
  private connectionString = `postgresql://${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PASSWORD ?? '')}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?schema=public`
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
