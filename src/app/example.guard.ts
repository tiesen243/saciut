import type { CanActivate } from '@/core/common'

export class ExampleGuard implements CanActivate {
  canActivate(): boolean {
    return Math.random() > 0.5 // Example: allow access 50% of the time
  }
}
