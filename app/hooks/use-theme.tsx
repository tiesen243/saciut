import * as React from 'react'

const STORAGE_KEY = 'theme'

type Theme = 'dark' | 'light' | 'system'

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
}

interface ThemeProviderState {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeProviderContext = React.createContext<ThemeProviderState | null>(
  null,
)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  ...props
}: ThemeProviderProps) {
  const id = React.useId()
  const [theme, setTheme] = React.useState<Theme>(() =>
    typeof window !== 'undefined'
      ? ((localStorage.getItem(STORAGE_KEY) as Theme | undefined) ??
        defaultTheme)
      : defaultTheme,
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
    const restoreAnimation = disableAnimation(id)
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
    restoreAnimation()
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      const restoreAnimation = disableAnimation(id)
      localStorage.setItem(STORAGE_KEY, theme)
      setTheme(theme)
      restoreAnimation()
    },
    toggleTheme: () => {
      const restoreAnimation = disableAnimation(id)
      setTheme((prevTheme) => {
        const newTheme = prevTheme === 'light' ? 'dark' : 'light'
        localStorage.setItem(STORAGE_KEY, newTheme)
        return newTheme
      })
      restoreAnimation()
    },
  }

  return (
    <ThemeProviderContext {...props} value={value}>
      {children}
    </ThemeProviderContext>
  )
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext)
  if (!context) throw new Error('useTheme must be used within a ThemeProvider')
  return context
}
