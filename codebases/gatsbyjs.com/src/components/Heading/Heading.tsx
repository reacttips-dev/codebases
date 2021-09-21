/** @jsx jsx */
import { jsx, Interpolation } from "@emotion/core"
import { BaseHeading, BaseHeadingProps } from "../BaseHeading"
import { showCustomCssDeprecationMessage } from "../../utils/maintenance/deprecationMessages"
import { ThemeCss, Theme } from "../../theme"
import { HeadingTone, HeadingVariant, HeadingFontVariant } from "./types"

const baseCss: ThemeCss = theme => ({
  margin: 0,
  lineHeight: theme.lineHeights.heading, // Ask Flo about this
})

const fontVariantCss: Record<HeadingFontVariant, ThemeCss> = {
  DISPLAY: theme => ({
    fontFamily: theme.fonts.heading,
  }),
  UI: theme => ({
    fontFamily: theme.fonts.headingUI,
  }),
}

const modifiedCss: (variant: HeadingVariant, tone: HeadingTone) => ThemeCss = (
  variant,
  tone
) => theme => [
  {
    color: theme.tones[tone].text,
  },
  variant === `PRIMARY` && {
    fontWeight: theme.fontWeights.bold,
  },
  variant === `EMPHASIZED` && {
    fontWeight: theme.fontWeights.extraBold,
  },
  variant === `LIGHT` && {
    fontWeight: 100,
    textTransform: `uppercase`,
  },
]

export type HeadingProps = BaseHeadingProps & {
  tone?: HeadingTone
  variant?: HeadingVariant
  fontVariant?: HeadingFontVariant
  customCss?: Interpolation
}

export function Heading({
  tone = `NEUTRAL`,
  variant = `PRIMARY`,
  fontVariant = `DISPLAY`,
  as = `h2`,
  customCss,
  ...rest
}: HeadingProps) {
  showCustomCssDeprecationMessage(customCss)

  return (
    <BaseHeading
      as={as}
      css={(theme: Theme) => [
        baseCss(theme),
        modifiedCss(variant, tone)(theme),
        fontVariantCss[fontVariant](theme),
        customCss,
      ]}
      {...rest}
    />
  )
}
