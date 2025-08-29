import { MoonIcon, SunIcon } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { useTheme } from '~/hooks/use-theme'

export function Header() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky inset-0 z-50 bg-popover border-b text-popover-foreground h-14 shadow-xs">
      <div className="container h-full flex items-center justify-between">
        <h1 className="text-xl font-bold">Saciut</h1>

        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </Button>
      </div>
    </header>
  )
}
