import React from "react"
import { contentPositionerCss } from "../../../shared/styles"
import { GatsbyCloudLogo } from "../../../shared/logos/GatsbyCloudLogo"

import topBackground from "../../../../assets/backgrounds/cloud-dots-top.svg"
import bottomBackground from "../../../../assets/backgrounds/cloud-dots-bottom.svg"
import Heading from "components/CustomPageLayout/components/Heading"
import Cta from "components/CustomPageLayout/components/Cta"
import CloudItem from "./CloudItem"
import Markdown from "components/CustomPageLayout/components/Markdown"
import { normalizeData } from "../../../CustomPageLayout"

const rootCss = theme => [contentPositionerCss({ theme })]

const frameCss = theme => ({
  background: `url(${topBackground}) repeat-x center top, url(${bottomBackground}) repeat-x center bottom`,
  border: `1px solid ${theme.colors.blue[10]}`,
  borderRadius: theme.radii[4],
  display: `flex`,
  flexDirection: `column`,
  justifyContent: `center`,
  alignItems: `center`,
  padding: `${theme.space[11]} ${theme.space[6]}`,

  [theme.mediaQueries.desktop]: {
    padding: `${theme.space[15]}`,
  },
})

const headerCss = _theme => ({
  alignItems: `center`,
  display: `flex`,
  flexDirection: `column`,
  textAlign: `center`,
})

const headingCss = theme => ({
  fontSize: theme.fontSizes[10],
  letterSpacing: theme.letterSpacings.tight,
  lineHeight: theme.lineHeights.solid,

  span: {
    color: theme.colors.blue[70],
    background: `linear-gradient(0deg,${theme.colors.purple[60]},  ${theme.colors.blue[60]} )`,
    WebkitBackgroundClip: `text`,
    WebkitTextFillColor: `transparent`,
  },

  [theme.mediaQueries.desktop]: {
    fontSize: theme.fontSizes[11],
  },
})

const ledeCss = theme => ({
  color: theme.colors.grey[90],
  fontSize: theme.fontSizes[2],
  maxWidth: `40rem`,
  margin: `0 auto`,
  marginTop: theme.space[5],

  [theme.mediaQueries.desktop]: {
    fontSize: theme.fontSizes[4],
  },
})

const gridCss = theme => ({
  display: `grid`,
  gridRowGap: theme.space[10],
  margin: `${theme.space[10]} 0`,

  [theme.mediaQueries.desktop]: {
    gridTemplateColumns: `1fr 1fr`,
    gridRowGap: theme.space[15],
    gridColumnGap: theme.space[15],
    margin: `${theme.space[15]} 0`,
  },
})

const ctaCss = theme => ({
  span: {
    display: `none`,
  },

  [theme.mediaQueries.desktop]: {
    span: {
      display: `inline`,
    },
  },
})

const contextStyles = {
  Heading: headingCss,
  Markdown: ledeCss,
  Cta: ctaCss,
}

const contextProps = {
  Heading: {
    as: `h2`,
    variant: `EMPHASIZED`,
  },
}

export function GatsbyCloud({ data = {} }) {
  const {
    CloudItem: items,
    Heading: headingContent,
    Markdown: markdown,
    Cta: ctaContent,
  } = normalizeData(data)
  return (
    <section css={theme => rootCss(theme)}>
      <div css={frameCss}>
        <header css={headerCss}>
          <GatsbyCloudLogo />
          <Heading
            data={{ tag: "h2", ...headingContent }}
            css={headingCss}
            variant="EMPHASIZED"
          />
          <Markdown data={markdown} css={ledeCss} />
        </header>
        <div css={gridCss}>
          {items &&
            items.map(({ data, id }) => <CloudItem data={data} key={id} />)}
        </div>
        <Cta
          data={ctaContent}
          contextStyles={contextStyles}
          contextProps={contextProps}
        />
      </div>
    </section>
  )
}

export default GatsbyCloud
