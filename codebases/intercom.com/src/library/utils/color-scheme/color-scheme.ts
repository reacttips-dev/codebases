import { getThemeForDefaultBrand, AllSystemColors, ColorTheme } from '../colors-compatibility'
import { Color } from 'marketing-site/src/library/utils'

export const getColorTheme = (color: AllSystemColors): ColorTheme => {
  return getThemeForDefaultBrand(color)
}

export const getColor = (color: AllSystemColors) => getColorTheme(color).id

export const getActiveColor = (backgroundColor: Color) => {
  switch (backgroundColor) {
    case Color.Black: {
      return Color.LightGray
    }
    case Color.Blue:
    case Color.White: {
      return Color.LightBlue
    }
    default: {
      return Color.White
    }
  }
}
