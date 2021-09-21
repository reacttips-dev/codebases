/** @jsx jsx */
import { jsx } from "@emotion/core"
import { css } from "@emotion/core"
import colors from "../../theme/colors"
import { AvatarSize } from "./types"
import {
  avatarSizeValues,
  placeholderFontSizes,
  borderSizeValues,
} from "./constants"

const baseCss = css({
  background: colors.grey[20],
  borderRadius: "50%",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "space-around",
  flexShrink: 0,
  overflow: "hidden",
  color: colors.grey[60],
})

export type AvatarSkeletonProps = JSX.IntrinsicElements["span"] & {
  size: AvatarSize
  borderColor?: string | null
}

// TODO fit placeholder text to its avatar size for cases like +99
export default function AvatarSkeleton({
  size,
  borderColor,
  ...rest
}: AvatarSkeletonProps) {
  return (
    <span
      css={[
        baseCss,
        css({
          width: avatarSizeValues[size],
          height: avatarSizeValues[size],
          fontSize: placeholderFontSizes[size],
          border: borderColor
            ? `${borderSizeValues[size]}px solid ${borderColor}`
            : undefined,
        }),
      ]}
      {...rest}
    />
  )
}
