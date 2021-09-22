/** @jsx jsx */
import { jsx } from "@emotion/core"

import { BaseText, BaseTextProps } from "../BaseText"
import { baseStyle, variantStyles, sizeStyles } from "./Text.helpers"
import { TextTone, TextVariant, TextSize } from "./types"

export type TextProps = BaseTextProps & {
  tone?: TextTone
  variant?: TextVariant
  size?: TextSize
  noMarginTop?: boolean
  noMarginBottom?: boolean
}

function Text({
  tone = `NEUTRAL`,
  variant = `PRIMARY`,
  size = `M`,
  noMarginTop = false,
  noMarginBottom = false,
  ...rest
}: TextProps) {
  return (
    <BaseText
      css={theme => [
        baseStyle(tone)(theme),
        sizeStyles[size](theme),
        variantStyles[variant](theme),
        noMarginTop && {
          marginTop: 0,
        },
        noMarginBottom && {
          marginBottom: 0,
        },
      ]}
      {...rest}
    />
  )
}

export default Text
