import { LayoutWidth } from "../constants/layout"

export const contentPositionerCss = ({ theme, isFullWidth }) => ({
  maxWidth: !isFullWidth && `${LayoutWidth}rem`,
  position: `relative`,
  paddingLeft: theme.space[7],
  paddingRight: theme.space[7],
  marginLeft: `auto`,
  marginRight: `auto`,
  width: `100%`,

  [theme.mediaQueries.phablet]: {
    width: !isFullWidth && `90%`,
  },
})

export const displayOnMobileOnly = ({ theme, as = `block` }) => ({
  display: as,

  [theme.mediaQueries.desktop]: {
    display: `none`,
  },
})

export const displayOnDesktopOnly = ({ theme, as = `block` }) => ({
  display: `none`,

  [theme.mediaQueries.desktop]: {
    display: as,
  },
})
