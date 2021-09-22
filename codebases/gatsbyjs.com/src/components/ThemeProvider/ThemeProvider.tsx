import * as React from "react"
import { ThemeProvider as ThemeUiProvider, useThemeUI } from "theme-ui"
import { getTheme, Theme } from "../../theme"

export type ThemeProviderProps = {
  children?: React.ReactNode
  theme?: Theme | ((baseTheme: Theme) => Theme)
}

export default function ThemeProvider({ children, theme }: ThemeProviderProps) {
  const themeValue = React.useMemo(() => {
    const baseTheme = getTheme()

    if (typeof theme === "function") {
      return theme(baseTheme)
    }

    return theme || baseTheme
  }, [theme, getTheme])

  return <ThemeUiProvider<Theme> theme={themeValue}>{children}</ThemeUiProvider>
}

// To distinguish from Theme UI's ThemeProvider
ThemeProvider.displayName = "GatsbyInterfaceThemeProvider"

export function useTheme() {
  // @ts-ignore
  return useThemeUI().theme as Theme
}
