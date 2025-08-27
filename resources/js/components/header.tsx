import { Link } from 'react-router'

import { UserButton } from '@client/components/user-button'

export function Header() {
  return (
    <header className="sticky inset-0 z-50 flex h-14 items-center border-b bg-background/70 backdrop-blur-xl backdrop-saturate-150">
      <div className="container inline-flex items-center justify-between gap-4">
        <Link to="/" className="text-lg font-bold">
          Saciut
        </Link>

        <nav className="inline-flex flex-1 items-center gap-2"></nav>

        <UserButton />
      </div>
    </header>
  )
}
