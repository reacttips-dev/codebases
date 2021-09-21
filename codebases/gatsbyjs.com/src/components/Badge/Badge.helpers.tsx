import { ThemeCss } from "../../theme"
import { BadgeTone, BadgeVariant } from "./types"

type GetVariantStylesFn = (tone: BadgeTone) => ThemeCss

const variants: Record<BadgeVariant, GetVariantStylesFn> = {
  STATUS: tone => {
    return theme => [
      {
        background: theme.tones[tone].superLight,
        border: `1px solid ${theme.tones[tone].lighter}`,
        color: theme.tones[tone].text,
      },
    ]
  },
  PILL: tone => {
    return theme => [
      {
        background: theme.tones[tone].dark,
        color: theme.tones[tone].textInverted
          ? theme.tones[tone].textInverted
          : theme.colors.white,
      },
    ]
  },
}

export function getBadgeVariantStyles(variant: BadgeVariant, tone: BadgeTone) {
  return variants[variant](tone)
}
