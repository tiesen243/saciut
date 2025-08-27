import {
  BellIcon,
  CreditCardIcon,
  LaptopIcon,
  LogOutIcon,
  MoonIcon,
  ShieldIcon,
  SunIcon,
  SunMoonIcon,
  UserIcon,
} from 'lucide-react'
import { Link } from 'react-router'

import { Avatar, AvatarFallback } from '@client/components/ui/avatar'
import { Button } from '@client/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@client/components/ui/dropdown-menu'
import { useSession } from '@client/hooks/use-session'
import { useTheme } from '@client/hooks/use-theme'

export function UserButton() {
  const { theme, setTheme } = useTheme()
  const { status, user, signOut } = useSession()

  if (status === 'pending')
    return <div className="size-9 rounded-full bg-muted" />
  if (status === 'error')
    return (
      <Button asChild>
        <Link to="/login">Sign In</Link>
      </Button>
    )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="size-9 cursor-pointer">
          <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <span className="sr-only">Open user menu</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-60">
        <DropdownMenuLabel className="flex flex-col">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {userNavItems.map((item) => (
            <DropdownMenuItem key={item.label} asChild>
              <a href={item.href}>
                <item.icon /> {item.label}
                <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
              </a>
            </DropdownMenuItem>
          ))}

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground">
              <SunMoonIcon /> Apperance
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  className={
                    theme === 'light'
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  }
                  onClick={() => {
                    setTheme('light')
                  }}
                >
                  <SunIcon /> Light mode
                  <DropdownMenuShortcut>⌘L</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={
                    theme === 'dark'
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  }
                  onClick={() => {
                    setTheme('dark')
                  }}
                >
                  <MoonIcon /> Dark mode
                  <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={
                    theme === 'system'
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  }
                  onClick={() => {
                    setTheme('system')
                  }}
                >
                  <LaptopIcon /> System
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem onClick={signOut}>
            <LogOutIcon /> Sign out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const userNavItems = [
  {
    href: '/#profile',
    label: 'Profile',
    icon: UserIcon,
    shortcut: '⌘P',
  },
  {
    href: '/#billing',
    label: 'Billing',
    icon: CreditCardIcon,
    shortcut: '⌘B',
  },
  {
    href: '/#notifications',
    label: 'Notifications',
    icon: BellIcon,
    shortcut: '⌘N',
  },
  {
    href: '/#security',
    label: 'Security',
    icon: ShieldIcon,
    shortcut: '⌘⇧S',
  },
]
