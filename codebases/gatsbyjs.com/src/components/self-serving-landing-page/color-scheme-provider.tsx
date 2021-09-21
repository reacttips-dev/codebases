/* eslint-disable  @typescript-eslint/no-explicit-any */
import * as React from "react"
import { ThemeProvider, getTheme } from "gatsby-interface"
import { ColorSchemes, colorSchemes } from "./color-schemes"

export const ColorSchemeProvider = ({
  children,
  colorScheme,
}: {
  children: React.ReactNode
  colorScheme?: ColorSchemes
}) => {
  const interfaceTheme = getTheme()
  colorScheme = colorScheme ?? "DEFAULT"
  return (
    <ThemeProvider
      theme={
        {
          ...interfaceTheme,
          colorScheme: colorSchemes(interfaceTheme)[colorScheme],
        } as any
      }
    >
      {children}
    </ThemeProvider>
  )
}
