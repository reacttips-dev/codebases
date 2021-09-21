/** @jsx jsx */
import { jsx } from "@emotion/core"
import { ThemeCss, Theme } from "../../theme"
import { getBadgeVariantStyles } from "./Badge.helpers"
import { BadgeTextVariant, BadgeTone, BadgeVariant, BadgeSize } from "./types"
import { iconHeightBySize } from "../icons/IconSkeleton"

const baseCss: ThemeCss = theme => ({
  alignItems: `center`,
  borderRadius: theme.radii[1],
  display: `inline-flex`,
  fontFamily: theme.fonts.body,
  fontSize: theme.fontSizes[0],
  lineHeight: theme.lineHeights.solid,
  padding: `${theme.space[1]} ${theme.space[3]}`,
  minHeight: theme.space[7],
})

export type BadgeProps = Omit<JSX.IntrinsicElements["span"], "ref"> & {
  children?: React.ReactNode
  Icon?: React.ComponentType<any>
  variant?: BadgeVariant
  textVariant?: BadgeTextVariant
  tone?: BadgeTone
  size?: BadgeSize
}

export function Badge({
  children,
  Icon,
  variant = `STATUS`,
  textVariant = `CAPS`,
  tone = `BRAND`,
  size = `S`,
  ...rest
}: BadgeProps) {
  const iconSize =
    size === `S` ? iconHeightBySize.xxsmall : iconHeightBySize.xsmall

  return (
    <span
      css={(theme: Theme) => [
        baseCss(theme),
        textVariant === "CAPS" && {
          textTransform: `uppercase`,
          fontWeight: 500,
          letterSpacing: theme.letterSpacings.tracked,
        },
        size === "M" && {
          borderRadius: theme.radii[2],
          fontSize: theme.fontSizes[1],
          minHeight: `calc(${theme.space[2]} * 7)`,
          padding: `${theme.space[1]} ${theme.space[4]}`,
        },
        size === "M" &&
          textVariant === "CAPS" && {
            fontSize: theme.fontSizes[0],
          },
        getBadgeVariantStyles(variant, tone)(theme),
      ]}
      {...rest}
    >
      {Icon && (
        <Icon
          css={(theme: Theme) => [
            {
              marginRight: size === "S" ? theme.space[2] : theme.space[3],
              color: theme.tones[tone].medium,
              flexShrink: 0,
              width: iconSize,
              height: iconSize,
            },
            variant === `PILL` && {
              color: theme.tones[tone].mediumInverted
                ? theme.tones[tone].mediumInverted
                : theme.colors.whiteFade[90],
            },
          ]}
        />
      )}
      {children}
    </span>
  )
}
