/** @jsx jsx */
import React from "react"
import { jsx } from "@emotion/core"
import { css } from "@emotion/core"
import AvatarSkeleton from "./AvatarSkeleton"
import { DEFAULT_SIZE, placeholderFontSizes } from "./constants"
import { fitText } from "./Avatar.helpers"

const imageCss = css({
  objectFit: "cover",
  width: "100%",
  height: "100%",
  padding: 0,
  margin: 0,
})

const maxFallbackTextWidth: Record<AvatarSize, number> = {
  XS: 0.9,
  S: 0.9,
  M: 0.9,
  L: 0.8,
  XL: 0.8,
  XXL: 0.8,
}

export type AvatarSize = "XS" | "S" | "M" | "L" | "XL" | "XXL"

export type AvatarProps = {
  src: string
  label: string
  fallback?: React.ReactNode
  size?: AvatarSize
  borderColor?: string | null
  fitTextFallback?: boolean
  className?: string
  style?: React.CSSProperties
}

export default function Avatar({
  src,
  fallback,
  label,
  size = DEFAULT_SIZE,
  borderColor = null,
  className,
  style,
}: AvatarProps) {
  const textFitter = fitText<HTMLSpanElement>({
    maxWidth: maxFallbackTextWidth[size],
    minFontSizeInRem: parseFloat(placeholderFontSizes.XS),
    maxFontSizeInRem: parseFloat(placeholderFontSizes[size]),
  })

  return (
    <AvatarSkeleton
      size={size}
      borderColor={borderColor}
      className={className}
      style={style}
      title={label}
    >
      {src ? (
        <img css={imageCss} src={src} alt={label} />
      ) : (
        <span aria-label={label} ref={textFitter}>
          {fallback}
        </span>
      )}
    </AvatarSkeleton>
  )
}
