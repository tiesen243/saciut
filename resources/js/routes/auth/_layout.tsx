import { Outlet } from 'react-router'

import { Button } from '@client/components/ui/button'
import { Card, CardFooter } from '@client/components/ui/card'

export default function AuthLayout() {
  return (
    <main className="container grid min-h-[calc(100lvh-3.5rem)] place-items-center">
      <Card className="w-full max-w-2xl">
        <Outlet />

        <CardFooter className="flex-col">
          <div className="mb-4 flex w-full items-center gap-2 text-sm text-muted-foreground">
            <span className="h-0.5 flex-1 bg-border" />
            or
            <span className="h-0.5 flex-1 bg-border" />
          </div>
          <Button variant="outline" className="w-full" asChild>
            <a href="/api/auth/google">Continue with Google</a>
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
