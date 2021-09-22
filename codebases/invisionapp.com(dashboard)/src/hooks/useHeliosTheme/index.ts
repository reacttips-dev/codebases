import { useEffect, useCallback } from 'react'
import useEventListener from '../useEventListener'
import useLocalStorage from '../useLocalStorage'

interface Options {
  initialTheme: 'light' | 'dark'
  element?: any
}

function useHeliosTheme({
  initialTheme = 'light',
  element = document.body,
}: Options) {
  const matcher = window.matchMedia('(prefers-color-scheme: dark)')
  function getInitialTheme() {
    if (matcher.matches) {
      return matcher.matches ? 'dark' : 'light'
    }
    return initialTheme
  }
  const { value: currentTheme, set: setCurrentTheme } = useLocalStorage<string>(
    {
      key: 'hds-theme',
      initialValue: getInitialTheme(),
    }
  )

  function handleChange() {
    setCurrentTheme(matcher.matches ? 'dark' : 'light')
  }

  useEventListener(matcher, 'change', handleChange)

  useEffect(() => {
    const oldTheme = currentTheme === 'light' ? 'dark' : 'light'
    element.classList.remove(`hds-theme-${oldTheme}`)
    element.classList.add(`hds-theme-${currentTheme}`)
  }, [element, currentTheme])

  return {
    theme: currentTheme,
    toggle: useCallback(() => {
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
      setCurrentTheme(newTheme)
    }, [currentTheme, setCurrentTheme]),
    setDark: useCallback(() => setCurrentTheme('dark'), [setCurrentTheme]),
    setLight: useCallback(() => setCurrentTheme('light'), [setCurrentTheme]),
  }
}

export default useHeliosTheme
