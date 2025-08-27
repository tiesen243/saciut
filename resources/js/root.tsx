import type { QueryClient } from '@tanstack/react-query'
import { QueryClientProvider } from '@tanstack/react-query'
import { Loader2Icon } from 'lucide-react'
import { isRouteErrorResponse, Outlet, useRouteError } from 'react-router'

import { Header } from '@client/components/header'
import { Toaster } from '@client/components/ui/sonner'
import { ThemeProvider } from '@client/hooks/use-theme'
import { createQueryClient } from '@client/lib/query-client'

let clientQueryClientSingleton: QueryClient | undefined = undefined
const getQueryClient = () => {
  if (typeof window === 'undefined') return createQueryClient()
  else return (clientQueryClientSingleton ??= createQueryClient())
}

export default function RootLayout() {
  const queryClient = getQueryClient()

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Header />
        <Outlet />
      </QueryClientProvider>

      <Toaster />
    </ThemeProvider>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()

  let message = 'Oops!'
  let details = 'An unexpected error occurred.'
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error'
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details
  } else if (
    process.env.NODE_ENV === 'development' &&
    error &&
    error instanceof Error
  ) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4">
      <div className="container flex items-center justify-center gap-4">
        <h1 className="text-4xl font-bold">{message}</h1>
        <div className="h-12 w-[1px] bg-border" />
        <p>{details}</p>
      </div>
      {stack && (
        <pre className="container max-h-[50dvh] overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}

export function HydrateFallback() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center">
      <Loader2Icon className="animate-spin" />
    </main>
  )
}
