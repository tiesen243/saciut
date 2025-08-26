import { ErrorBoundary } from '@js/components/error-boundary'
import RootLayout from '@js/root'
import Index from '@js/routes'
import { Loader2Icon } from 'lucide-react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <Index /> },
      { path: '/about', lazy: () => import('@js/routes/about') },
    ],

    errorElement: <ErrorBoundary />,
    hydrateFallbackElement: (
      <main className="flex min-h-dvh flex-col items-center justify-center">
        <Loader2Icon className="animate-spin" />
      </main>
    ),
  },
])

const rootElement = document.getElementById('root')
if (rootElement)
  createRoot(rootElement).render(<RouterProvider router={router} />)
