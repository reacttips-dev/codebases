import colors, { Colors } from "./colors"
import fonts, { Font } from "./fonts"
import fontWeights, { FontWeightToken } from "./fontWeights"
import fontSizes, { FontSize, FontSizes } from "./fontSizes"
import lineHeights, { LineHeightToken } from "./lineHeights"
import letterSpacings, { LetterSpacingToken } from "./letterSpacings"
import zIndices, { ZIndexToken, ZIndices } from "./zIndices"
import space, { SpaceToken, Space } from "./space"
import radii, { RadiusToken, Radii } from "./radii"
import shadows, { ShadowToken } from "./shadows"
import breakpoints, {
  BreakpointToken,
  Breakpoints,
  BreakpointsList,
  breakpointsList,
} from "./breakpoints"
import transitions, { Transitions } from "./transition"
import { AtomTone } from "./types"
import tones, { ToneColors } from "./tones"
import { Interpolation, InterpolationWithTheme } from "@emotion/core"

/**
 * Colors
 */
type ColorScale = Colors

const themeColors: ColorScale = colors

/**
 * Tones
 */
type ToneScale = Record<AtomTone, ToneColors>

const themeTones: ToneScale = tones

/**
 * Font families
 */
export type ThemeFont = Font

type FontScale = Record<ThemeFont, string>

const themeFonts: FontScale = fonts

/**
 * Font weights
 */
export type ThemeFontWeight = FontWeightToken

type FontWeightScale = Record<ThemeFontWeight, number>

const themeFontWeights: FontWeightScale = fontWeights

/**
 * Font sizes
 */
export type ThemeFontSize = FontSize

type FontSizeScale = FontSizes

const themeFontSizes: FontSizes = fontSizes

/**
 * Line heights
 */
export type ThemeLineHeight = LineHeightToken

type LineHeightScale = Record<ThemeLineHeight, number>

const themeLineHeights: LineHeightScale = lineHeights

/**
 * Letter spacings
 */
export type ThemeLetterSpacing = LetterSpacingToken

type LetterSpacingScale = Record<ThemeLetterSpacing, string>

const themeLetterSpacings: LetterSpacingScale = letterSpacings

/**
 * Space
 */
export type ThemeSpace = SpaceToken

type SpaceScale = Space

const themeSpace: SpaceScale = space

/**
 * Radii
 */
export type ThemeRadius = RadiusToken

type RadiusScale = Radii

const themeRadii: RadiusScale = radii

/**
 * Shadows
 */
export type ThemeShadow = ShadowToken

type ShadowScale = Record<ThemeShadow, string>

const themeShadows: ShadowScale = shadows

/**
 * Z indices
 */
export type ThemeZIndex = ZIndexToken

type ZIndexScale = ZIndices

const themeZIndices: ZIndexScale = zIndices

/**
 * Breakpoints
 */
export type ThemeBreakpoint = BreakpointToken

type BreakpointScale = BreakpointsList

const themeBreakpoints: BreakpointScale = breakpointsList

/**
 * Media breakpoints
 */
export type ThemeMediaBreakpoint = BreakpointToken

type MediaBreakpointScale = Breakpoints

const themeMediaBreakpoints: MediaBreakpointScale = breakpoints

/**
 * Media queries
 */
export type ThemeMediaQuery = BreakpointToken

type MediaQueryScale = Record<ThemeMediaQuery, string>

const themeMediaQueries: MediaQueryScale = Object.entries(breakpoints).reduce(
  (memo, [breakpoint, widthInPx]) => {
    return {
      ...memo,
      [breakpoint]: `@media (min-width: ${widthInPx}px)`,
    }
  },
  {}
) as MediaQueryScale

/**
 * Transitions
 */
const themeTransitions = transitions

/**
 * Cards
 */
export type CardSpaceVariant = "DEFAULT" | "L" | "M"

export type CardStyles = {
  frame: {
    background: string
    borderRadius: string
    boxShadow: string
  }
  space: Record<
    CardSpaceVariant,
    {
      paddingTop: string
      paddingBottom: string
      paddingLeft: string
      paddingRight: string
    }
  >
}

const themeCardStyles: CardStyles = {
  frame: {
    background: colors.primaryBackground,
    borderRadius: radii[2],
    boxShadow: shadows.raised,
  },
  space: {
    DEFAULT: {
      paddingTop: space[6],
      paddingBottom: space[5],
      paddingLeft: space[7],
      paddingRight: space[3],
    },
    M: {
      paddingTop: space[5],
      paddingBottom: space[5],
      paddingLeft: space[9],
      paddingRight: space[9],
    },
    L: {
      paddingTop: space[7],
      paddingBottom: space[8],
      paddingLeft: space[9],
      paddingRight: space[9],
    },
  },
}

export type Theme = {
  colors: Readonly<ColorScale>
  tones: Readonly<ToneScale>
  fonts: Readonly<FontScale>
  fontWeights: Readonly<FontWeightScale>
  fontSizes: Readonly<FontSizeScale>
  lineHeights: Readonly<LineHeightScale>
  letterSpacings: Readonly<LetterSpacingScale>
  space: Readonly<SpaceScale>
  radii: Readonly<RadiusScale>
  shadows: Readonly<ShadowScale>
  zIndices: Readonly<ZIndexScale>
  breakpoints: Readonly<BreakpointScale>
  mediaBreakpoints: Readonly<MediaBreakpointScale>
  mediaQueries: Readonly<MediaQueryScale>
  transitions: Readonly<Transitions>
  cardStyles: Readonly<CardStyles>
}

const defaultTheme: Theme = {
  colors: themeColors,
  tones: themeTones,
  fonts: themeFonts,
  fontWeights: themeFontWeights,
  fontSizes: themeFontSizes,
  lineHeights: themeLineHeights,
  letterSpacings: themeLetterSpacings,
  space: themeSpace,
  radii: themeRadii,
  shadows: themeShadows,
  zIndices: themeZIndices,
  breakpoints: themeBreakpoints,
  mediaBreakpoints: themeMediaBreakpoints,
  mediaQueries: themeMediaQueries,
  transitions: themeTransitions,
  cardStyles: themeCardStyles,
}

export function getTheme(): Theme {
  return defaultTheme
}

export type CustomCss = InterpolationWithTheme<Theme>
export type ThemeCss = (theme: Theme) => Interpolation
