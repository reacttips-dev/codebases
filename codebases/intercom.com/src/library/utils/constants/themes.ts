/* eslint-disable no-console */

import { Color } from './colors'

// -- Theme Definitions --
// Types that define specific color-sets, used to type a component's `theme` or `bgColor` prop

/* Standard set of light background color themes */
export type LightThemeColor =
  | Color.LightBlue
  | Color.LightGray
  | Color.LightOrange
  | Color.LightPurple
  | Color.LightTeal
  | Color.LightYellow
  | Color.White
  | Color.Teal

export type AllColors =
  | Color.Black
  | Color.Blue
  | Color.Gray
  | Color.LightBlue
  | Color.LightGray
  | Color.LightOrange
  | Color.LightPurple
  | Color.LightTeal
  | Color.LightYellow
  | Color.Orange
  | Color.Purple
  | Color.Teal
  | Color.White
  | Color.Yellow

/* Special set of background color themes for use with attention-grabbing elements */
export type SpecialThemeColor = Color

/* Expanded set of all background color themes */
export type ExpandedThemeColor = LightThemeColor | SpecialThemeColor

export enum CTATheme {
  BlackFill,
  BlackOutline,
  WhiteOutline,
  LinkOnlyBlack,
  LinkOnlyWhite,
  TealFill,
  BlackFillTransparentHover,
}

// -- Structured Theme Information Getters --

/*
  Structure of theme information returned by the main `getColorTheme` utility
  This shared structure should be limited to just the most commonly shared properties.
  Components that want additional custom fields should extend this interface locally.
 */
export interface ITheme {
  backgroundColor: string
  textColor: string
  ctaTheme: CTATheme
}

/*
  CTA Theme Reverse Lookup
  Interpeters can use this to convert and cast a CMS string (e.g. "Black Fill") to a specifically-typed
  `Color` value, for example a `SpecialThemeColor`. (Looking up the value is possible because
  under the hood, the Color enum is compiled to a plain object containing "Blue": "BLUE".)
  `component.theme = getTypedThemeColor<SpecialThemeColor>(stringFromCMS)`
*/
export function getTypedCtaTheme<T>(colorStr: string): T {
  // @ts-ignore
  if (CTATheme[colorStr] === undefined) {
    console.warn(`Color string not recognized: ${colorStr}`)
  }

  // @ts-ignore
  return CTATheme[colorStr] as T
}

// -- Color Options for Stories --

export const LIGHT_THEME_OPTIONS = {
  LightBlue: Color.LightBlue as LightThemeColor,
  LightGray: Color.LightGray as LightThemeColor,
  LightOrange: Color.LightOrange as LightThemeColor,
  LightPurple: Color.LightPurple as LightThemeColor,
  LightTeal: Color.LightTeal as LightThemeColor,
  LightYellow: Color.LightYellow as LightThemeColor,
  White: Color.White as LightThemeColor,
}

export const LIGHT_THEME_OPTIONS_NO_WHITE = {
  LightBlue: Color.LightBlue as LightThemeColor,
  LightGray: Color.LightGray as LightThemeColor,
  LightOrange: Color.LightOrange as LightThemeColor,
  LightPurple: Color.LightPurple as LightThemeColor,
  LightTeal: Color.LightTeal as LightThemeColor,
  LightYellow: Color.LightYellow as LightThemeColor,
  White: Color.White as LightThemeColor,
}

export const SPECIAL_THEME_OPTIONS = {
  UIError: Color.UIError as SpecialThemeColor,
  UIGray: Color.UIGray as SpecialThemeColor,
  UISuccess: Color.UISuccess as SpecialThemeColor,
  UIWarning: Color.UIWarning as SpecialThemeColor,
}

export const EXPANDED_THEME_OPTIONS = {
  LightBlue: Color.LightBlue as ExpandedThemeColor,
  LightGray: Color.LightGray as ExpandedThemeColor,
  LightOrange: Color.LightOrange as ExpandedThemeColor,
  LightPurple: Color.LightPurple as ExpandedThemeColor,
  LightTeal: Color.LightTeal as ExpandedThemeColor,
  LightYellow: Color.LightYellow as ExpandedThemeColor,
  White: Color.White as ExpandedThemeColor,
  UIError: Color.UIError as ExpandedThemeColor,
  UIGray: Color.UIGray as ExpandedThemeColor,
  UISuccess: Color.UISuccess as ExpandedThemeColor,
  UIWarning: Color.UIWarning as ExpandedThemeColor,
}

export const THEME_OPTIONS: { [key: string]: LightThemeColor } = {
  LightBlue: Color.LightBlue,
  LightGray: Color.LightGray,
  LightOrange: Color.LightOrange,
  LightPurple: Color.LightPurple,
  LightTeal: Color.LightTeal,
  LightYellow: Color.LightYellow,
  White: Color.White,
}
