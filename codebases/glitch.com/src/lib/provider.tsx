import React from 'react'
import { ThemeProvider as UIThemeProvider, merge } from 'theme-ui'

import Fonts from './fonts'
import { theme } from './theme'

function convertLegacyColors(legacyColors: Record<string, unknown>): Record<string, unknown> {
  const remapping = {
    text: 'primary',
    background: 'background',
  }

  const { colors } = theme

  return Object.fromEntries(Object.entries(colors).map(([key, value]) => {
    // Are we mapping this value?
    const remapKey = remapping[key]
    if (!remapKey) {
      return [key, value]
    }
    const mappedValue = legacyColors[remapKey] || value

    return [key, mappedValue]
  }))
}

// Send down our theme provider
export const ThemeProvider = ({
  children,
  legacyTheme,
}: {
  children: JSX.Element,
  legacyTheme: Record<string, unknown>
}): JSX.Element => {
  if (legacyTheme) {
    // We have two themes in the editor that are not mapped to our new values
    // We do not intend to have the editor using those themes for long
    // so this is a (temporary) bandaid
    theme.colors = convertLegacyColors(legacyTheme.colors)
  }

  return (
    <UIThemeProvider theme={theme}>
      <Fonts />
      {children}
    </UIThemeProvider>
  )
}
