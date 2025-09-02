import { Injectable } from '@/core/common'

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!'
  }
}
