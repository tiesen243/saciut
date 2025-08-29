import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router'

import type { Route } from './+types/root'
import { Header } from '~/components/header'
import globalsCss from '~/globals.css?url'
import { ThemeProvider } from '~/hooks/use-theme'

// prettier-ignore
export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&family=Geist:wght@100..900&display=swap' },
  { rel: 'stylesheet', href: globalsCss },
]

// prettier-ignore
export const meta: Route.MetaFunction = () => [
  { title: 'Saciut' },
  { name: 'description', content: 'A full stack app with Express and React Router' },
]

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />

        <script>{`
          // Fix FOUC when using dark mode
          ;(function () {
            const theme = localStorage.getItem('theme') ?? 'light'
            if (theme === 'dark') document.documentElement.classList.add('dark')
          })()
        `}</script>
      </head>
      <body className="font-sans flex flex-col min-h-dvh antialiased">
        <ThemeProvider>{children}</ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!'
  let details = 'An unexpected error occurred.'
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error'
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}
