import React from "react"
import { contentPositionerCss } from "../../../shared/styles"
import Heading from "components/CustomPageLayout/components/Heading"
import Markdown from "components/CustomPageLayout/components/Markdown"
import FeatureItem from "./FeatureItem"
import { normalizeData } from "../../../CustomPageLayout"
import backgroundImage from "../../../../assets/backgrounds/home_dots.svg"

const rootCss = theme => ({
  background: `url(${backgroundImage}) repeat-x center bottom`,
  display: `flex`,
  flexDirection: `column`,
  paddingBottom: theme.space[10],
  marginBottom: `-${theme.space[10]}`,
})

const innerCss = theme => contentPositionerCss({ theme })

const headerCss = _theme => ({
  textAlign: `center`,
})

const headingCss = theme => ({
  fontSize: theme.fontSizes[10],
  letterSpacing: theme.letterSpacings.tight,
  lineHeight: theme.lineHeights.solid,
  margin: 0,

  span: {
    color: theme.colors.purple[60],
  },
})

const ledeCss = theme => ({
  margin: `0 auto`,
  marginTop: theme.space[7],
  maxWidth: `50rem`,
  textAlign: "center",
  fontSize: theme.fontSizes[4],
})

const gridCss = theme => ({
  display: `grid`,
  gridRowGap: theme.space[10],
  margin: `${theme.space[10]} 0`,

  [theme.mediaQueries.desktop]: {
    gridTemplateColumns: `1fr 1fr`,
    gridColumnGap: theme.space[15],
    margin: `${theme.space[15]} ${theme.space[9]}`,
    padding: `0 ${theme.space[9]}`,
  },
})

export function GatsbyFeatures({ data = {} }) {
  const {
    Heading: headerContent,
    Markdown: markdown,
    FeatureItem: items,
  } = normalizeData(data)
  return (
    <section css={rootCss}>
      <div css={innerCss}>
        <header css={headerCss}>
          <Heading
            data={{ tag: "h2", ...headerContent }}
            css={headingCss}
            variant="EMPHASIZED"
          />
        </header>
        <Markdown data={markdown} css={ledeCss} />
        <div css={gridCss}>
          {items.map(({ data, id }) => (
            <FeatureItem data={data} key={id} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default GatsbyFeatures
