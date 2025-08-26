import { MoonIcon, SunIcon } from 'lucide-react'
import { Link } from 'react-router'

import { Button } from '@client/components/ui/button'
import { useTheme } from '@client/hooks/use-theme'

export function Header() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky inset-0 z-50 flex h-14 items-center border-b bg-background/70 backdrop-blur-xl backdrop-saturate-150">
      <div className="container inline-flex items-center justify-between gap-4">
        <Link to="/" className="text-lg font-bold">
          Saciut
        </Link>

        <Button onClick={toggleTheme} variant="ghost" size="icon">
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </Button>
      </div>
    </header>
  )
}
