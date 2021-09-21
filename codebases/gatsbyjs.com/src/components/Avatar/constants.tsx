import fontSizes from "../../theme/fontSizes"
import { AvatarSize } from "./types"

export const DEFAULT_SIZE: AvatarSize = "M"

export const avatarSizeValues: Record<AvatarSize, string> = {
  XS: "20px",
  S: "24px",
  M: "32px",
  L: "48px",
  XL: "64px",
  XXL: "128px",
}

export const borderSizeValues: Record<AvatarSize, number> = {
  XS: 0.5,
  S: 1,
  M: 2,
  L: 3,
  XL: 4,
  XXL: 8,
}

export const placeholderFontSizes: Record<AvatarSize, string> = {
  XS: `0.5rem`,
  S: fontSizes[0],
  M: fontSizes[1],
  L: fontSizes[4],
  XL: fontSizes[6],
  XXL: fontSizes[12],
}
