import React from "react"
import { Heading } from "gatsby-interface"

const headerCss = theme => ({
  textAlign: `center`,
  marginBottom: theme.space[12],
})

const lightHeadingCss = theme => ({
  color: theme.colors.grey[50],
  fontSize: theme.fontSizes[2],
  letterSpacing: theme.letterSpacings.tracked,
  marginBottom: theme.space[3],
})

export const emphasizedHeadingCss = theme => ({
  fontSize: theme.fontSizes[8],
  lineHeight: theme.lineHeights.dense,

  span: {
    color: theme.colors.purple[60],
    display: `block`,
  },

  [theme.mediaQueries.desktop]: {
    fontSize: theme.fontSizes[8],
  },
})

export function PageHeader() {
  return (
    <header css={headerCss}>
      <Heading as="h1" variant="LIGHT" css={lightHeadingCss}>
        Begin building your Gatsby experience
      </Heading>
      <Heading as="h2" variant="EMPHASIZED" css={emphasizedHeadingCss}>
        <span>Get started with Gatsby Cloud </span>or install locally
      </Heading>
    </header>
  )
}
