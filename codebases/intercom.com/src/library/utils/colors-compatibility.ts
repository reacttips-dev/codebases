import { Color } from './constants/colors'
import { CTATheme } from './constants/themes'

export type AllSystemColors = Color

export type ColorTheme = {
  id: AllSystemColors
  backgroundColor: AllSystemColors
  textColor: AllSystemColors
  CTATheme: CTATheme
  focus?: AllSystemColors
}

export const AllColorValues = {
  Black: Color.Black,
  Blue: Color.Blue,
  Gray: Color.Gray,
  LightBlue: Color.LightBlue,
  LightGray: Color.LightGray,
  LightOrange: Color.LightOrange,
  LightPurple: Color.LightPurple,
  LightTeal: Color.LightTeal,
  LightYellow: Color.LightYellow,
  Orange: Color.Orange,
  Purple: Color.Purple,
  Teal: Color.Teal,
  UIGray: Color.UIGray,
  UIError: Color.UIError,
  UISuccess: Color.UISuccess,
  UIWarning: Color.UIWarning,
  White: Color.White,
  Yellow: Color.Yellow,
}

export const ThemesPerBrand = {
  default: Array.from(Object.keys(Color)),
}

export const AllThemeOptions = [...ThemesPerBrand.default]

export function getThemeForDefaultBrand(themeColor: Color): ColorTheme {
  switch (themeColor) {
    case Color.LightBlue:
      return {
        id: Color.LightBlue,
        backgroundColor: Color.LightBlue,
        textColor: Color.Black,
        CTATheme: CTATheme.BlackFill,
        focus: Color.LightBlue,
      }

    case Color.LightGray:
      return {
        id: Color.LightGray,
        backgroundColor: Color.LightGray,
        textColor: Color.Black,
        CTATheme: CTATheme.BlackFill,
        focus: Color.LightGray,
      }

    case Color.LightOrange:
      return {
        id: Color.LightOrange,
        backgroundColor: Color.LightOrange,
        textColor: Color.Black,
        CTATheme: CTATheme.BlackFill,
        focus: Color.LightOrange,
      }

    case Color.LightPurple:
      return {
        id: Color.LightPurple,
        backgroundColor: Color.LightPurple,
        textColor: Color.Black,
        CTATheme: CTATheme.BlackFill,
        focus: Color.LightPurple,
      }

    case Color.LightTeal:
      return {
        id: Color.LightTeal,
        backgroundColor: Color.LightTeal,
        textColor: Color.Black,
        CTATheme: CTATheme.BlackFill,
        focus: Color.LightTeal,
      }

    case Color.LightYellow:
      return {
        id: Color.LightYellow,
        backgroundColor: Color.LightYellow,
        textColor: Color.Black,
        CTATheme: CTATheme.BlackFill,
        focus: Color.LightYellow,
      }

    case Color.Blue:
      return {
        id: Color.Blue,
        backgroundColor: Color.Blue,
        textColor: Color.White,
        CTATheme: CTATheme.BlackFill,
        focus: Color.Blue,
      }

    case Color.Gray:
      return {
        id: Color.Gray,
        backgroundColor: Color.Gray,
        textColor: Color.Black,
        CTATheme: CTATheme.BlackFill,
        focus: Color.Gray,
      }

    case Color.Orange:
      return {
        id: Color.Orange,
        backgroundColor: Color.Orange,
        textColor: Color.White,
        CTATheme: CTATheme.BlackFill,
        focus: Color.Orange,
      }

    case Color.Purple:
      return {
        id: Color.Purple,
        backgroundColor: Color.Purple,
        textColor: Color.White,
        CTATheme: CTATheme.BlackFill,
        focus: Color.Purple,
      }

    case Color.Teal:
      return {
        id: Color.Teal,
        backgroundColor: Color.Teal,
        textColor: Color.Black,
        CTATheme: CTATheme.BlackFill,
        focus: Color.Teal,
      }

    case Color.Yellow:
      return {
        id: Color.Yellow,
        backgroundColor: Color.Yellow,
        textColor: Color.Black,
        CTATheme: CTATheme.BlackFill,
        focus: Color.Yellow,
      }

    case Color.Black:
      return {
        id: Color.Black,
        backgroundColor: Color.Black,
        textColor: Color.White,
        CTATheme: CTATheme.TealFill,
        focus: Color.Black,
      }

    case Color.UIError:
      return {
        id: Color.UIError,
        backgroundColor: Color.UIError,
        textColor: Color.Black,
        CTATheme: CTATheme.WhiteOutline,
        focus: Color.UIError,
      }

    case Color.UIGray:
      return {
        id: Color.UIGray,
        backgroundColor: Color.UIGray,
        textColor: Color.White,
        CTATheme: CTATheme.WhiteOutline,
        focus: Color.UIGray,
      }

    case Color.UISuccess:
      return {
        id: Color.UISuccess,
        backgroundColor: Color.UISuccess,
        textColor: Color.Black,
        CTATheme: CTATheme.WhiteOutline,
        focus: Color.UISuccess,
      }

    case Color.UIWarning:
      return {
        id: Color.UIWarning,
        backgroundColor: Color.UIWarning,
        textColor: Color.Black,
        CTATheme: CTATheme.WhiteOutline,
        focus: Color.UIWarning,
      }

    case Color.White:
      return {
        id: Color.White,
        backgroundColor: Color.White,
        textColor: Color.Black,
        CTATheme: CTATheme.LinkOnlyBlack,
        focus: Color.White,
      }

    case Color.Red:
      return {
        id: Color.Red,
        backgroundColor: Color.Red,
        textColor: Color.Black,
        CTATheme: CTATheme.LinkOnlyBlack,
        focus: Color.White,
      }

    case Color.Transparent:
      return {
        id: Color.Transparent,
        backgroundColor: Color.Transparent,
        textColor: Color.Black,
        CTATheme: CTATheme.LinkOnlyBlack,
        focus: Color.White,
      }

    default:
      return {
        id: Color.White,
        backgroundColor: Color.White,
        textColor: Color.Black,
        CTATheme: CTATheme.LinkOnlyBlack,
        focus: Color.White,
      }
  }
}

export function getFocusColor(backgroundColor?: AllSystemColors) {
  return backgroundColor === Color.LightGray ? Color.White : Color.LightGray
}

export const ColorName = {
  [Color.Black]: 'black',
  [Color.Blue]: 'blue',
  [Color.Gray]: 'gray',
  [Color.LightBlue]: 'light-blue',
  [Color.LightGray]: 'light-gray',
  [Color.LightOrange]: 'light-orange',
  [Color.LightPurple]: 'light-purple',
  [Color.LightTeal]: 'light-teal',
  [Color.LightYellow]: 'light-yellow',
  [Color.Orange]: 'orange',
  [Color.Purple]: 'purple',
  [Color.Teal]: 'teal',
  [Color.UIError]: 'ui-error',
  [Color.UIGray]: 'ui-gray',
  [Color.UISuccess]: 'ui-success',
  [Color.UIWarning]: 'ui-warning',
  [Color.White]: 'white',
  [Color.Yellow]: 'yellow',
  [Color.Red]: 'red',
  [Color.Transparent]: 'transparent',
}

const defaultColor = Color.White

const getLegacyColorFallback = (color: string) => {
  if (color.match(/coral|tan/i)) {
    return Color.LightGray
  }
  if (color.match(/indigo|violet/i)) {
    return Color.LightBlue
  }
  if (color.match(/lightest/i)) {
    return Color.Gray
  }
  return undefined
}

export const getHexColorFromName = (color: string) =>
  AllColorValues[color as keyof typeof AllColorValues] ||
  getLegacyColorFallback(color) ||
  defaultColor
