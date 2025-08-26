import { ThemeProvider } from '@js/hooks/use-theme'
import { Outlet } from 'react-router'

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Outlet />
    </ThemeProvider>
  )
}
