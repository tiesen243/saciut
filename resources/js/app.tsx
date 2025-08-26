import * as React from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  unstable_createContext,
} from 'react-router'

import RootLayout, { ErrorBoundary, HydrateFallback } from '@client/root'
import Index from '@client/routes'

export const queryContext = unstable_createContext()

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <Index /> },
      { path: '/about', lazy: () => import('@client/routes/about') },
    ],

    ErrorBoundary,
    HydrateFallback,
  },
])

const rootElement = document.getElementById('root') as HTMLElement & {
  _reactRootContainer?: ReturnType<typeof createRoot>
}
rootElement._reactRootContainer ??= createRoot(rootElement)
rootElement._reactRootContainer.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
