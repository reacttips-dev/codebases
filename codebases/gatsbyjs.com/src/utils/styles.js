import { rhythm } from "./typography"
import { hexToRGBA } from "gatsby-interface"
import { LayoutWidth } from "../components/shared/constants/layout"

const titleBaseStyles = theme => ({
  WebkitFontSmoothing: `antialiased`,
  textRendering: `optimizelegibility`,
  fontFamily: theme.fonts.heading,
  letterSpacing: theme.letterSpacings.tight,
  lineHeight: 1.125,
})

const titleStyles = theme => ({
  ...titleBaseStyles(theme),
  color: theme.colors.grey[90],
  fontWeight: 800,
  transition: `color ${theme.transitions.speed.default} ${theme.transitions.curve.default}`,
  [theme.mediaQueries.tablet]: {
    fontSize: theme.fontSizes[9],
  },
  [theme.mediaQueries.hd]: {
    fontSize: theme.fontSizes[10],
  },
  "& span": {
    fontWeight: `normal`,
  },
})

const subtitleStyles = theme => ({
  ...titleBaseStyles(theme),
  fontSize: theme.fontSizes[5],
  fontWeight: `normal`,
  [theme.mediaQueries.tablet]: {
    fontSize: theme.fontSizes[6],
  },
})

// gatsby-remark-autolink-headers
const anchorStyles = theme => ({
  "a.anchor": {
    color: `inherit`,
    fill: theme.colors.lilac,
    textDecoration: `none`,
    borderBottom: `0`,
  },
})

const articleStyles = theme => ({
  // Target image captions. This is kind of a fragile selector...
  "img + em": {
    fontSize: theme.fontSizes[1],
    lineHeight: theme.lineHeights.dense,
    marginTop: `-${theme.space[7]}`,
    marginBottom: theme.space[7],
    display: `block`,
    textAlign: `center`,
    color: theme.colors.blackFade[50],
  },
  "img, .gatsby-resp-image-link": {
    boxShadow: theme.shadows.dialog,
    marginTop: theme.space[7],
    marginBottom: theme.space[7],
  },
  "p, ol, ul, h1, h2, h3, h4, h5, h6, .gatsby-resp-iframe-wrapper": {
    maxWidth: rhythm(26),
  },
  h2: {
    marginTop: theme.space[10],
  },
  "h3, h4": {
    marginTop: theme.space[7],
  },
  table: {
    fontSize: theme.fontSizes[1],
    marginTop: theme.space[10],
    marginBottom: theme.space[10],
  },
  ...anchorStyles,
})

const bodyCopy = theme => ({
  color: theme.colors.blackFade[70],
  // lineHeight: lineHeights.loose,
  [theme.mediaQueries.tablet]: {
    fontSize: theme.fontSizes[3],
    maxWidth: rhythm(24),
  },
})

const defaultPaddingHorizontal = theme => ({
  paddingLeft: theme.space[8],
  paddingRight: theme.space[8],
  [theme.mediaQueries.tablet]: {
    paddingLeft: theme.space[8],
    paddingRight: theme.space[8],
  },
})

const howItWorksSVGStyles = theme => ({
  "& svg path": {
    vectorEffect: `non-scaling-stroke`,
  },
  "& .icon-stroke": {
    stroke: theme.colors.blue[90],
    vectorEffect: `non-scaling-stroke`,
  },
  "& .icon-fill": {
    fill: theme.colors.blue[90],
  },
  "& .icon-apps-gradient-1": {
    stroke: `url(#icon-apps-gradient-1-blue)`,
    vectorEffect: `non-scaling-stroke`,
  },
  "& .icon-apps-gradient-2": {
    stroke: `url(#icon-apps-gradient-2-blue)`,
    vectorEffect: `non-scaling-stroke`,
  },
  "& .icon-apps-gradient-3": {
    fill: `url(#icon-apps-gradient-3-blue)`,
  },
  "& .icon-performance-gradient-1": {
    fill: `url(#icon-performance-gradient-1-blue)`,
  },
})

const smallCapsStyles = theme => ({
  color: theme.colors.blackFade[70],
  fontSize: theme.fontSizes[1],
  fontFamily: theme.fonts.heading,
  letterSpacing: theme.letterSpacings.tracked,
  textTransform: `uppercase`,
})

const howItWorksSVGHoverStyles = theme => ({
  "& svg path": {
    vectorEffect: `non-scaling-stroke`,
  },
  "& .icon-stroke": {
    stroke: theme.colors.gatsby,
    vectorEffect: `non-scaling-stroke`,
  },
  "& .icon-fill": {
    fill: theme.colors.gatsby,
  },
  "& .icon-apps-gradient-1": {
    stroke: `url(#icon-apps-gradient-1)`,
    vectorEffect: `non-scaling-stroke`,
  },
  "& .icon-apps-gradient-2": {
    stroke: `url(#icon-apps-gradient-2)`,
    vectorEffect: `non-scaling-stroke`,
  },
  "& .icon-apps-gradient-3": {
    fill: `url(#icon-apps-gradient-3)`,
  },
  "& .icon-performance-gradient-1": {
    fill: `url(#icon-performance-gradient-1)`,
  },
})

const linkStyles = theme => ({
  position: `relative`,
  fontWeight: 500,
  textDecoration: `none`,
  borderBottom: `1px solid ${theme.colors.lilac}`,
  transition: `all ${theme.transitions.speed.default} ${theme.transitions.curve.default}`,
  "&:hover": {
    borderBottomColor: `transparent`,
  },
})

const guideContentBlockStyles = theme => ({
  marginTop: theme.space[13],
  marginBottom: theme.space[13],
  [theme.mediaQueries.phablet]: {
    "& ul, & ol": {
      marginLeft: 0,
    },
  },
  "& a": {
    color: theme.colors.gatsby,
    fontWeight: 400,
    ...linkStyles(theme),
  },
})

const guideContainer = theme => ({
  marginLeft: `auto`,
  marginRight: `auto`,
  [theme.mediaQueries.phablet]: {
    width: `90%`,
    maxWidth: rhythm(26),
  },
  [theme.mediaQueries.desktop]: {
    maxWidth: rhythm(28),
  },
  ...defaultPaddingHorizontal(theme),
})

const defaultPadding = theme => ({
  paddingBottom: theme.space[7],
  paddingLeft: rhythm(8),
})

const guidePaddingBottom = theme => ({
  paddingBottom: theme.space[10],
  [theme.mediaQueries.phablet]: {
    paddingBottom: theme.space[15],
  },
})

const gridBackground = theme => ({
  background: hexToRGBA(theme.colors.blue[10], 0.5, true),
})

const withHowItWorksGridBorder = theme => ({
  position: `relative`,
  "&:after": [
    gridBackground(theme),
    {
      content: `" "`,
      display: `block`,
      height: 1,
      left: `-100vw`,
      right: `-100vw`,
      bottom: 0,
      position: `absolute`,
    },
  ],
})

const primaryButtonHoverStyle = theme => ({
  background: theme.colors.gatsby,
})

const primaryButtonDefaultStyles = theme => ({
  background: theme.colors.gatsby,
  ":hover": {
    ...primaryButtonHoverStyle(theme),
  },
  ":focus": {
    outline: 0,
  },
})

const container = theme => ({
  position: `relative`,
  zIndex: 1,
  margin: `0 auto`,
  width: `100%`,
  maxWidth: `${LayoutWidth}rem`,
  ...defaultPaddingHorizontal(theme),
  [theme.mediaQueries.phablet]: {
    width: `90%`,
  },
})

const visuallyHidden = {
  // include `px` so we can use it with `sx`
  border: 0,
  clip: `rect(0, 0, 0, 0)`,
  height: `1px`,
  margin: `-1px`,
  overflow: `hidden`,
  padding: 0,
  position: `absolute`,
  whiteSpace: `nowrap`,
  width: `1px`,
}

export {
  linkStyles,
  howItWorksSVGStyles,
  howItWorksSVGHoverStyles,
  titleStyles,
  subtitleStyles,
  guideContentBlockStyles,
  guideContainer,
  guidePaddingBottom,
  defaultPadding,
  defaultPaddingHorizontal,
  withHowItWorksGridBorder,
  bodyCopy,
  primaryButtonDefaultStyles,
  primaryButtonHoverStyle,
  gridBackground,
  anchorStyles,
  articleStyles,
  smallCapsStyles,
  container,
  visuallyHidden,
}
