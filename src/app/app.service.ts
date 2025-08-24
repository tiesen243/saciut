import { Injectable } from '@/core'

@Injectable()
export default class AppService {
  getHello(): string {
    return 'Hello World!'
  }
}
