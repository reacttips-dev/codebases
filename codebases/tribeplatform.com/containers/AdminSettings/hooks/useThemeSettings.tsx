import React, { FC, useState, useCallback } from 'react'

import merge from 'lodash.merge'

import { ThemeTokens as GeneratedThemeTokens } from 'tribe-api/interfaces'
import { ThemeToken } from 'tribe-components'

import useGetNetwork from 'containers/Network/useGetNetwork'

import { setGlobalTribeSettings } from 'lib/dom/window'

export type ThemeTokens = {
  breakpoints?: ThemeToken[] | null
  colors?: ThemeToken[] | null
  fontSizes?: ThemeToken[] | null
  fontWeights?: ThemeToken[] | null
  opacity?: ThemeToken[] | null
  shadows?: ThemeToken[] | null
  sizes?: ThemeToken[] | null
  textStyles?: ThemeToken[] | null
  zIndices?: ThemeToken[] | null
}

const DEFAULT_THEME_SETTINGS: ThemeTokens = {
  colors: [
    {
      key: 'accent.base',
      value: '#2D9F6F',
    },
    {
      key: 'bg.base',
      value: '#FFFFFF',
    },
    {
      key: 'bg.secondary',
      value: '#F4F4F6',
    },
    {
      key: 'label.primary',
      value: '#27282B',
    },
  ],
}

export type ThemeSettingsContextProps = {
  themeSettings: ThemeTokens | GeneratedThemeTokens
  updateThemeSettings?: (newThemeSettings: ThemeTokens) => void
  mergeThemeSettings?: (
    currentTheme: GeneratedThemeTokens | ThemeTokens,
    newTheme: ThemeTokens,
  ) => ThemeTokens
}
export const ThemeSettingsContext = React.createContext<
  ThemeSettingsContextProps | undefined
>(undefined)

export const ThemeSettingsContextProvider: FC = ({ children }) => {
  const { network } = useGetNetwork()
  const defaultTheme =
    network?.themes != null
      ? removeTypename(network.themes.active.tokens)
      : DEFAULT_THEME_SETTINGS
  const [themeSettings, setThemeSettings] = useState<ThemeTokens>(defaultTheme)

  const updateThemeSettings = useCallback((newThemeSettings: ThemeTokens) => {
    setThemeSettings(newThemeSettings)
    setGlobalTribeSettings('themeSettings', newThemeSettings)
  }, [])

  return (
    <ThemeSettingsContext.Provider
      value={{
        themeSettings,
        updateThemeSettings,
        mergeThemeSettings,
      }}
    >
      {children}
    </ThemeSettingsContext.Provider>
  )
}

const removeTypename = (
  theme: GeneratedThemeTokens | ThemeTokens,
): ThemeTokens => {
  const themeCopy: ThemeTokens = {}
  Object.entries(theme).forEach(([key, themeToken]) => {
    if (typeof themeToken !== 'string') {
      themeCopy[key] = themeToken?.map(themeToken => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { __typename, ...rest } = themeToken
        return rest
      }) as ThemeToken[]
    }
  })

  return themeCopy
}

export const mergeThemeSettings = (
  currentTheme: GeneratedThemeTokens | ThemeTokens,
  newTheme: ThemeTokens,
): ThemeTokens => {
  const formattedTheme = removeTypename(currentTheme)
  return merge(formattedTheme, newTheme)
}

const useThemeSettings = (): ThemeSettingsContextProps => {
  const context = React.useContext(ThemeSettingsContext)
  const { network } = useGetNetwork()

  return (
    context ?? {
      themeSettings: network?.themes?.active?.tokens ?? DEFAULT_THEME_SETTINGS,
    }
  )
}

export default useThemeSettings
