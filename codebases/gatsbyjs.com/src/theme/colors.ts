import {
  colors as baseColors,
  Colors as DesignColors,
} from "gatsby-design-tokens"

export type Colors = DesignColors & {
  primaryBackground: string
  secondaryBackground: string
  standardLine: string
}

const defaultColors = {
  primaryBackground: baseColors.white,
  secondaryBackground: baseColors.grey[5],
  standardLine: baseColors.grey[20],
}

const colors: Colors = {
  ...baseColors,
  ...defaultColors,
}

export default colors
