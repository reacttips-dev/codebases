import colors from "./colors"
import { AtomTone } from "./types"

export type ToneColors = {
  // - Badge.STATUS.background
  // - Notification.SECONDARY.background
  // - Button.GHOST:hover.background
  superLight: string

  // - Badge.STATUS.border
  lighter: string

  // - Button.SECONDARY.border
  light: string

  // - Badge.STATUS.Icon.color
  // - Notification.[PRIMARY | SECONDARY].Icon.color
  // - Notification.PRIMARY.borderLeft
  // - Toggle.Gutter:checked.background
  medium: string

  // - Badge.PILL.Icon.color
  // - Notification.SOLID.Icon.color
  // if it is defined, otherwise its color is `whiteFade[90]`
  mediumInverted?: string

  // - Badge.PILL.background
  // - Notification.SOLID.background
  // - Button.PRIMARY.background
  // - Button.PRIMARY.border
  // - Button.SECONDARY:hover.border
  dark: string

  // - Button.PRIMARY:hover.background
  // - Button.PRIMARY:hover.border
  darker: string

  // Button.[SECONDARY | GHOST]:hover.color
  superDark: string

  // - Badge.STATUS.color — used `darker` before
  // - Button.[SECONDARY | GHOST].color - used `dark` before
  // - Heading.color - used `superDark` before; Heading.LIGHT.color now also uses this (was `dark` before — a bit lighter than the default Heading before)
  // - Text.color — used `darker` before
  text: string

  // - Badge.PILL.color
  // - Notification.SOLID.color
  // if it is defined, otherwise its color is `white`
  textInverted?: string
}

const tones: Record<AtomTone, ToneColors> = {
  BRAND: {
    superLight: colors.purple[5],
    lighter: colors.purple[10],
    light: colors.purple[20],
    medium: colors.purple[40],
    dark: colors.purple[60],
    darker: colors.purple[70],
    superDark: colors.purple[90],
    text: colors.purple[60],
  },
  SUCCESS: {
    superLight: colors.green[5],
    lighter: colors.green[10],
    light: colors.green[20],
    medium: colors.green[50],
    dark: colors.green[80],
    darker: colors.green[90],
    superDark: colors.green[90],
    text: colors.green[80],
  },
  DANGER: {
    superLight: colors.red[5],
    lighter: colors.red[10],
    light: colors.red[20],
    medium: colors.red[50],
    dark: colors.red[70],
    darker: colors.red[80],
    superDark: colors.red[90],
    text: colors.red[70],
  },
  NEUTRAL: {
    superLight: colors.grey[5],
    lighter: colors.grey[10],
    light: colors.grey[20],
    medium: colors.grey[40],
    dark: colors.grey[60],
    darker: colors.grey[70],
    superDark: colors.black,
    text: colors.grey[90],
  },
  WARNING: {
    superLight: colors.orange[5],
    lighter: colors.orange[10],
    light: colors.orange[30],
    medium: colors.orange[50],
    mediumInverted: colors.blackFade[70],
    dark: colors.yellow[50],
    darker: colors.orange[70],
    superDark: colors.yellow[90],
    text: colors.yellow[90],
    textInverted: colors.blackFade[90],
  },
}

export default tones
