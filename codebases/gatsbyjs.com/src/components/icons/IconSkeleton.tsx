import * as React from "react"
import { IconSize, IconSkeletonProps } from "./types"

export const iconHeightBySize: Record<IconSize, string> = {
  inherit: `1em`,
  xxsmall: `16px`,
  xsmall: `20px`,
  small: `24px`,
  medium: `32px`,
  large: `40px`,
}

export default function IconSkeleton({
  iconName,
  size = `small`,
  style,
  applyColorToStroke = true,
  ...rest
}: IconSkeletonProps) {
  return (
    <svg
      preserveAspectRatio="xMidYMid meet"
      height={iconHeightBySize[size]}
      width={iconHeightBySize[size]}
      viewBox="0 0 24 24"
      fill={applyColorToStroke ? `none` : `currentColor`}
      stroke={applyColorToStroke ? `currentColor` : `none`}
      strokeWidth="1"
      fillRule="evenodd"
      data-testid={`icon-${iconName}`}
      style={{
        verticalAlign: `middle`,
        ...(style || {}),
      }}
      aria-hidden
      {...rest}
    />
  )
}
