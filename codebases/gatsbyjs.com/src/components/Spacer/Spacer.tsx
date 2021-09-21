/** @jsx jsx */
import { jsx, Interpolation } from "@emotion/core"
import { ThemeSpace, ThemeMediaBreakpoint, ThemeCss } from "../../theme"
import { useTheme } from "../ThemeProvider"

const verticalCss: ThemeCss = _theme => ({
  display: `block`,
  width: `unset`,
})

const horizontalCss: ThemeCss = _theme => ({
  display: `inline-block`,
  height: `unset`,
})

export type SpacerSize = ThemeSpace
export type SpacerDirection = `horizontal` | `vertical`

export type SpacerProps = {
  size: SpacerSize
  responsiveSize?: Partial<
    {
      [MediaBreakpoint in ThemeMediaBreakpoint]: SpacerSize
    }
  >
  direction?: SpacerDirection
  responsiveDirection?: Partial<
    {
      [MediaBreakpoint in ThemeMediaBreakpoint]: SpacerDirection
    }
  >
  className?: string
}

export function Spacer({
  size,
  direction = `vertical`,
  responsiveSize = {},
  responsiveDirection = {},
  className,
}: SpacerProps) {
  const theme = useTheme()
  const breakpoints = Object.keys(theme.mediaQueries) as ThemeMediaBreakpoint[]

  const responsiveStyles: Interpolation = {}

  for (const breakpoint of breakpoints) {
    const sizeForBreakpoint = responsiveSize[breakpoint] || size
    const directionForBreakpoint = responsiveDirection[breakpoint] || direction
    const sizePropertyForBreakpoint =
      directionForBreakpoint === `horizontal` ? `width` : `height`

    const mediaQuery = theme.mediaQueries[breakpoint]
    responsiveStyles[mediaQuery] = [
      {
        [sizePropertyForBreakpoint]: theme.space[sizeForBreakpoint],
      },
      directionForBreakpoint === `horizontal`
        ? horizontalCss(theme)
        : verticalCss(theme),
    ]
  }

  const defaultSizeProperty = direction === `horizontal` ? `width` : `height`

  return (
    <div
      css={[
        { [defaultSizeProperty]: theme.space[size] },
        direction === `horizontal` ? horizontalCss(theme) : verticalCss(theme),
        responsiveStyles,
      ]}
      aria-hidden
      className={className}
    />
  )
}
