import { useEffect, useState } from 'react'

const THEME_KEY = 'phase-admin-theme'

function getInitialTheme() {
  return localStorage.getItem(THEME_KEY) || 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  return {
    theme,
    toggleTheme: () => setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light')),
  }
}
