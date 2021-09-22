import { ThemeCss, Theme } from "gatsby-interface"
import { ColorSchemeCss } from "./color-schemes"
import { contentPositionerCss } from "../shared/styles"
import { Interpolation } from "@emotion/css"

// layout constants
// naming sucks, but it's a start
// sizes
export const maxSectionWidth = {
  small: "30rem", // 480px
  default: "40rem", // 640px
  tablet: "65rem", // 1040px
}
// maxWidths
// rem 52, 28, 8
// ch 48, 24

export const gap = {
  default: 7, // 24px
  desktop: 10, // 48px
}

export const textLinearGradient = ({
  direction = 0,
  startColor,
  endColor,
}: {
  direction?: number
  startColor: string
  endColor: string
}) => ({
  background: `linear-gradient(${direction}deg, ${startColor}, ${endColor})`,
  WebkitBackgroundClip: `text`,
  WebkitTextFillColor: `transparent`,
  MozBackgroundClip: "text",
  MozTextFillColor: "transparent",
  paddingBottom: `0.1em`, // with condensed line-height like 1.1 text clip cuts the bottom edges
  marginBottom: `-0.1em`, // of letters like "p" or "g", this temporary hack prevents that , but that needs more investigation
})

// styles for the outer container of each SSLP component
// these are shared with the main navigation and footer navigation components
// (and more), and facilitate alignment with those elements

export const sectionCss = (theme: Theme) =>
  [
    contentPositionerCss({ theme, isFullWidth: false }),
    // {
    //   background: theme.colors.blackFade[5],
    //   borderRadius: theme.radii[3],
    // },
  ] as Interpolation

// "universal" ;) eyebrow styles
// maybe should not contain color
export const eyebrowHeadingCss: ColorSchemeCss = theme => ({
  color: theme.colorScheme.dark,
  fontFamily: theme.fonts.heading,
  fontSize: theme.fontSizes[1],
  fontWeight: theme.fontWeights.semiBold,
  letterSpacing: theme.letterSpacings.tracked,
  textTransform: "uppercase",
  // in case we're rendering as e. g. <p>
  margin: 0,

  [theme.mediaQueries.mobile]: {
    fontSize: theme.fontSizes[2],
  },

  [theme.mediaQueries.desktop]: {
    fontSize: theme.fontSizes[3],
  },
})

// hero title — slightly bigger than section
export const heroTitleCss: ColorSchemeCss = theme => [
  {
    color: theme.colors.purple[50],
    fontSize: theme.fontSizes[7],
    fontWeight: theme.fontWeights.extraBold,
    letterSpacing: theme.letterSpacings.tight,
    lineHeight: 1.1, // to-do add token

    [theme.mediaQueries.phablet]: {
      fontSize: theme.fontSizes[10],
    },

    [theme.mediaQueries.desktop]: {
      fontSize: theme.fontSizes[11],
    },

    span: {
      color: theme.colors.black,
    },

    // TODO figure out if (for SSLP)/where this is set
    // (IIUC this is something we did for the homepage hero as a perf optimization)
    ".futura-loading &": {
      letterSpacing: `1px`,
      lineHeight: `1.05`,
      fontSize: `52px`,
      fontWeight: 900,

      [theme.mediaQueries.tablet]: {
        fontSize: theme.fontSizes[12],
      },

      [theme.mediaQueries.hd]: {
        fontSize: theme.fontSizes[13],
      },
    },
  },
  textLinearGradient({
    direction: theme.colorScheme.gradient.direction || 180,
    startColor: theme.colorScheme.gradient.start,
    endColor: theme.colorScheme.gradient.stop,
  }),
]

export const heroLedeCss: ThemeCss = theme => ({
  fontSize: theme.fontSizes[2],
  lineHeight: theme.lineHeights.body,

  [theme.mediaQueries.phablet]: {
    fontSize: theme.fontSizes[4],
  },
})

// section title — slightly smaller than hero font size
export const sectionTitleCss: ThemeCss = theme => ({
  fontSize: theme.fontSizes[6],
  fontWeight: theme.fontWeights.extraBold,
  letterSpacing: theme.letterSpacings.tight,
  lineHeight: 1.1, // to-do add token

  [theme.mediaQueries.phablet]: {
    fontSize: theme.fontSizes[9],
  },

  [theme.mediaQueries.desktop]: {
    fontSize: theme.fontSizes[10],
  },
})

// titles for section items
// currently that's `FeatureGrid` and `FeatureItems`
// suited for 2-3 items/row for phablet and up
export const itemTitleCss: ThemeCss = theme => ({
  fontSize: theme.fontSizes[5],
  fontWeight: theme.fontWeights.bold,
  letterSpacing: theme.letterSpacings.tight,
  lineHeight: 1.1, // to-do add token

  [theme.mediaQueries.tablet]: {
    fontSize: theme.fontSizes[4],
  },

  [theme.mediaQueries.desktop]: {
    fontSize: theme.fontSizes[5],
  },
})

export const itemCopyCss: ThemeCss = theme => ({
  color: theme.colors.grey[70],
  fontSize: theme.fontSizes[2],
})

// container styles for the "Icon / Eyebrow / Title" combo
// we're using in
export const iconEyebrowHeadingCss: ThemeCss = theme => ({
  display: "grid",
  gap: theme.space[3],
})

export const mainContainerCss: ThemeCss = theme => ({
  display: "grid",
  gridGap: theme.space[12],
  marginLeft: "auto",
  marginRight: "auto",
  marginTop: `${theme.space[4]}`,

  [theme.mediaQueries.desktop]: {
    gridGap: theme.space[15],
    marginTop: `${theme.space[10]}`,
  },
})

// used to align an element and its text according to the value set in contentful
export const alignmentCss = (alignment: string) => ({
  textAlign: alignment as "center" | "left" | "right",
  marginLeft: alignment === "left" ? `0` : `auto`,
  marginRight: alignment === "right" ? `0` : `auto`,
})
