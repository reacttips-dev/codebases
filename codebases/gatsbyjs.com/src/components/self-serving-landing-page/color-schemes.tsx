import { Theme } from "gatsby-interface"
import { Interpolation } from "@emotion/core"

export type ColorScheme = Theme & {
  colorScheme: {
    base: string
    dark: string
    light: string
    hover: string
    gradient: {
      start: string
      stop: string
      direction?: number
    }
  }
}

export const COLOR_SCHEMES = {
  Default: `DEFAULT`,
  Gatsby: `GATSBY`,
  Magenta: `MAGENTA`,
  Red: `RED`,
  Orange: `ORANGE`,
  Yellow: `YELLOW`,
  Green: `GREEN`,
  Teal: `TEAL`,
  Blue: `BLUE`,
  Neutral: `NEUTRAL`,
}

export type ColorSchemeCss = (theme: ColorScheme) => Interpolation

export type ColorSchemes =
  | `DEFAULT`
  | `GATSBY`
  | `MAGENTA`
  | `RED`
  | `ORANGE`
  | `YELLOW`
  | `GREEN`
  | `TEAL`
  | `BLUE`
  | `NEUTRAL`

export const colorSchemes = (interfaceTheme: Theme) => ({
  DEFAULT: {
    base: interfaceTheme.colors.purple[50],
    dark: interfaceTheme.colors.purple[60],
    hover: interfaceTheme.colors.purple[70],
    light: interfaceTheme.colors.purple[5],
    gradient: {
      start: interfaceTheme.colors.purple[50],
      stop: interfaceTheme.colors.purple[60],
    },
  },
  GATSBY: {
    base: interfaceTheme.colors.purple[50],
    dark: interfaceTheme.colors.purple[60],
    hover: interfaceTheme.colors.purple[70],
    light: interfaceTheme.colors.purple[5],
    gradient: {
      start: interfaceTheme.colors.purple[50],
      stop: interfaceTheme.colors.purple[60],
    },
  },
  MAGENTA: {
    base: interfaceTheme.colors.magenta[50],
    dark: interfaceTheme.colors.magenta[50],
    hover: interfaceTheme.colors.magenta[60],
    light: interfaceTheme.colors.magenta[5],
    gradient: {
      start: interfaceTheme.colors.magenta[50],
      stop: interfaceTheme.colors.purple[60],
    },
  },
  BLUE: {
    base: interfaceTheme.colors.blue[50],
    dark: interfaceTheme.colors.blue[80],
    hover: interfaceTheme.colors.blue[90],
    light: interfaceTheme.colors.blue[5],
    gradient: {
      start: interfaceTheme.colors.blue[50],
      stop: interfaceTheme.colors.purple[60],
    },
  },
  GREEN: {
    base: interfaceTheme.colors.green[50],
    dark: `#088413`,
    hover: interfaceTheme.colors.green[90],
    light: interfaceTheme.colors.green[5],
    // one-off gradients for Shopify theme, we will iron these out after launch
    gradient: {
      start: `#10A39E`,
      stop: `#2CA72C`,
      direction: 90,
    },
  },
  ORANGE: {
    base: interfaceTheme.colors.orange[60],
    hover: interfaceTheme.colors.orange[90],
    dark: `#cc3b00`,
    light: interfaceTheme.colors.orange[5],
    gradient: {
      start: interfaceTheme.colors.orange[70],
      stop: interfaceTheme.colors.purple[60],
    },
  },
  YELLOW: {
    base: `#e3a617`,
    dark: `#8A6534`,
    light: interfaceTheme.colors.yellow[5],
    hover: interfaceTheme.colors.yellow[90],
    gradient: {
      start: interfaceTheme.colors.yellow[60],
      stop: interfaceTheme.colors.purple[60],
    },
  },
  TEAL: {
    base: interfaceTheme.colors.teal[60],
    dark: `#00756a`,
    hover: interfaceTheme.colors.teal[90],
    light: interfaceTheme.colors.teal[5],
    gradient: {
      start: `#10A39E`,
      stop: interfaceTheme.colors.purple[60],
    },
  },
  NEUTRAL: {
    base: interfaceTheme.colors.grey[60],
    dark: interfaceTheme.colors.grey[80],
    hover: interfaceTheme.colors.grey[90],
    light: interfaceTheme.colors.grey[5],
    gradient: {
      start: interfaceTheme.colors.grey[50],
      stop: interfaceTheme.colors.purple[60],
    },
  },
  RED: {
    base: interfaceTheme.colors.red[60],
    dark: interfaceTheme.colors.red[70],
    hover: interfaceTheme.colors.red[80],
    light: interfaceTheme.colors.red[5],
    gradient: {
      start: interfaceTheme.colors.red[60],
      stop: interfaceTheme.colors.purple[60],
    },
  },
})
