import * as React from 'react'

type Theme = 'dark' | 'light' | 'system'

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

interface ThemeProviderState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
}

const ThemeProviderContext = React.createContext<ThemeProviderState | null>(
  initialState,
)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(
    () =>
      (localStorage.getItem(storageKey) as Theme | undefined) ?? defaultTheme,
  )

  const disableAnimation = React.useCallback((nonce: string | null) => {
    const css = document.createElement('style')
    if (nonce) css.setAttribute('nonce', nonce)
    css.appendChild(
      document.createTextNode(
        `*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}`,
      ),
    )
    document.head.appendChild(css)

    return () => {
      ;(() => window.getComputedStyle(document.body))()
      setTimeout(() => {
        document.head.removeChild(css)
      }, 1)
    }
  }, [])

  React.useEffect(() => {
    const restoreAnimation = disableAnimation(
      document.querySelector('style[nonce]')?.getAttribute('nonce') ?? null,
    )

    const root = window.document.documentElement

    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'

      root.classList.add(systemTheme)
      localStorage.setItem(storageKey, systemTheme)
      return
    }

    root.classList.add(theme)

    restoreAnimation()
  }, [disableAnimation, theme])

  const value = React.useMemo(
    () => ({
      theme,
      setTheme: (theme: Theme) => {
        const restoreAnimation = disableAnimation(
          document.querySelector('style[nonce]')?.getAttribute('nonce') ?? null,
        )
        localStorage.setItem(storageKey, theme)
        setTheme(theme)
        restoreAnimation()
      },
    }),
    [theme, disableAnimation, storageKey],
  )

  return (
    <ThemeProviderContext {...props} value={value}>
      {children}
    </ThemeProviderContext>
  )
}

export const useTheme = () => {
  const context = React.use(ThemeProviderContext)
  if (!context) throw new Error('useTheme must be used within a ThemeProvider')
  return context
}
