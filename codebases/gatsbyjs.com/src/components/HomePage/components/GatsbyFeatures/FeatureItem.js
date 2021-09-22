import React from "react"
import Heading from "components/CustomPageLayout/components/Heading"
import Markdown from "components/CustomPageLayout/components/Markdown"
import Svg from "components/CustomPageLayout/components/Svg"
import { normalizeData } from "../../../CustomPageLayout"

const rootCss = _theme => ({
  display: `grid`,
})

const iconCss = theme => ({
  marginBottom: theme.space[2],
})

const headingCss = theme => ({
  fontSize: theme.fontSizes[5],
  color: theme.colors.grey[70],
  marginTop: theme.space[2],
  width: `100%`,

  strong: {
    fontWeight: `inherit`,
    color: theme.colors.purple[60],
  },
})

const descriptionCss = theme => ({
  color: theme.colors.grey[70],
  margin: 0,
  marginTop: theme.space[4],
})

export function FeatureItem({ data = {} }) {
  const {
    Heading: headerContent,
    Markdown: markdown,
    Svg: svgContent,
  } = normalizeData(data)
  return (
    <article css={rootCss}>
      <Svg data={svgContent} css={iconCss} asImg={true} />
      <Heading data={headerContent} css={headingCss} variant="EMPHASIZED" />
      <Markdown data={markdown} css={descriptionCss} />
    </article>
  )
}

export default FeatureItem
