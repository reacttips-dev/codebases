import React from "react"
import { ctaBtnCss } from "../../../shared/styles"
import Heading from "components/CustomPageLayout/components/Heading"
import Markdown from "components/CustomPageLayout/components/Markdown"
import Cta from "components/CustomPageLayout/components/Cta"
import Picture from "components/CustomPageLayout/components/Picture"
import FastToRunDisplay from "./FastToRunDisplay"
import { Fallback } from "components/CustomPageLayout/components/Fallback"
import { normalizeContent } from "../../../CustomPageLayout"

const components = { Heading, Markdown, Cta, FastToRunDisplay }

export const articleCss = theme => ({
  alignItems: `center`,
  display: `flex`,
  flexDirection: `column`,
  margin: `${theme.space[10]} 0`,
})

export const numberCss = ({ theme, color }) => ({
  background: theme.colors[color][10],
  borderRadius: theme.radii[6],
  color: theme.colors[color][50],
  alignItems: `center`,
  display: `flex`,
  fontWeight: theme.fontWeights.bold,
  justifyContent: `center`,
  height: theme.space[8],
  width: theme.space[8],
  zIndex: theme.zIndices.base,
})

export const lightHeadingCss = ({ theme }) => ({
  fontSize: theme.fontSizes[2],
  lineHeight: theme.lineHeights.solid,
  letterSpacing: theme.letterSpacings.tracked,
  textAlign: `center`,
  marginTop: theme.space[7],
  zIndex: theme.zIndices.base,

  span: {
    color: theme.colors.purple[60],
    display: `block`,
  },
})

export const emphasizedHeadingCss = ({ theme, color = `purple` }) => ({
  color: theme.colors.grey[90],
  fontSize: theme.fontSizes[8],
  lineHeight: 1.1,
  letterSpacing: theme.letterSpacings.tight,
  maxWidth: `52rem`,
  marginTop: theme.space[7],
  textAlign: `center`,
  zIndex: theme.zIndices.base,

  strong: {
    color: theme.colors[color][50],
    fontWeight: `inherit`,
  },

  span: {
    display: `block`,
  },

  [theme.mediaQueries.desktop]: {
    fontSize: theme.fontSizes[10],
  },
})

export const articleLedeCss = theme => ({
  color: theme.colors.grey[70],
  fontSize: theme.fontSizes[3],
  margin: 0,
  marginTop: theme.space[9],
  maxWidth: `48rem`,
  textAlign: `center`,
  zIndex: theme.zIndices.base,

  p: {
    margin: 0,
  },

  [theme.mediaQueries.desktop]: {
    fontSize: theme.fontSizes[4],
  },
})

export const shortHeadingCss = theme => ({
  fontSize: theme.fontSizes[2],
  lineHeight: theme.lineHeights.solid,
  letterSpacing: theme.letterSpacings.tracked,
  textAlign: `center`,
  marginTop: theme.space[7],
  zIndex: theme.zIndices.base,

  span: {
    color: theme.colors.purple[60],
    display: `block`,
  },
})

export const longHeadingCss = theme => ({
  color: theme.colors.grey[90],
  fontSize: theme.fontSizes[8],
  lineHeight: 1.1,
  letterSpacing: theme.letterSpacings.tight,
  maxWidth: `52rem`,
  marginTop: theme.space[7],
  textAlign: `center`,
  zIndex: theme.zIndices.base,

  strong: {
    color: `var(--accent-color)`,
    fontWeight: `inherit`,
  },

  span: {
    display: `block`,
  },

  [theme.mediaQueries.desktop]: {
    fontSize: theme.fontSizes[10],
  },
})

const secondaryCta = theme => ({
  background: theme.colors.white,
  margin: `${theme.space[10]} auto`,
  zIndex: theme.zIndices.base,
})

const primaryCta = theme => [
  ctaBtnCss({ theme }),
  {
    margin: `${theme.space[10]} auto 0`,
  },
]

const displaysCss = {
  1: theme => ({
    height: `200px`,
    position: `relative`,
    width: `340px`,
    marginBottom: theme.space[8],

    [theme.mediaQueries.mobile]: {
      height: `220px`,
      width: `360px`,
    },

    [theme.mediaQueries.phablet]: {
      height: `325px`,
      width: `550px`,
    },

    [theme.mediaQueries.tablet]: {
      height: `400px`,
      marginBottom: theme.space[10],
      width: `650px`,
    },

    [theme.mediaQueries.desktop]: {
      height: `475px`,
      width: `756px`,
    },
  }),
  3: theme => ({
    height: `50vw`,
    position: `relative`,
    width: `100%`,

    [theme.mediaQueries.desktop]: {
      height: `500px`,
      width: `800px`,
      marginBottom: theme.space[8],
      marginTop: `-${theme.space[7]}`,
    },
  }),
}

const imageCss = _theme => ({
  left: `50%`,
  position: `absolute`,
  top: `50%`,
  transform: `translate(-50%, -50%)`,
})

const contextStyles = {
  Markdown: articleLedeCss,
  Picture: imageCss,
  shortHeading: shortHeadingCss,
  longHeading: longHeadingCss,
  secondaryCta: secondaryCta,
  primaryCta: primaryCta,
}

const contextProps = {
  shortHeading: {
    as: `h4`,
    variant: `LIGHT`,
  },
  longHeading: {
    as: `h2`,
    variant: `EMPHASIZED`,
  },
  secondaryCta: {
    variant: `SECONDARY`,
    size: `L`,
  },
  primaryCta: {
    variant: `PRIMARY`,
  },
}

const AccentColors = [`purple`, `green`, `blue`]

export function GatsbySpeedItem({ data = {}, idx }) {
  const content = normalizeContent(data.content)

  const accentColor = AccentColors[idx - 1]

  return (
    <article
      css={theme => [
        articleCss(theme),
        {
          "--accent-color": theme.colors[accentColor][50],
        },
      ]}
    >
      <span css={theme => numberCss({ theme, color: accentColor })}>{idx}</span>
      {content.map((item, iidx) => {
        const { id, data, componentName } = item
        const Component = components[componentName] || Fallback

        let identifier = componentName

        if (componentName === `Heading`) {
          identifier = iidx === 0 ? `shortHeading` : `longHeading`
        }

        if (componentName === `Cta`) {
          identifier = iidx < content.length - 1 ? `secondaryCta` : `primaryCta`
        }

        return componentName === `Picture` ? (
          <div key={id} css={displaysCss[idx]}>
            <Picture
              key={id}
              data={data}
              css={contextStyles[identifier]}
              {...contextProps[identifier]}
            />
          </div>
        ) : (
          <Component
            key={id}
            data={data}
            css={contextStyles[identifier]}
            {...contextProps[identifier]}
          />
        )
      })}
    </article>
  )
}

export default GatsbySpeedItem
