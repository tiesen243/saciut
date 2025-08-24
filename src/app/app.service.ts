import { Injectable } from '@/core/decorators'

@Injectable()
export default class AppService {
  getHello(): string {
    return 'Hello World!'
  }
}
