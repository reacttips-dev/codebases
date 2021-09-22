import React from "react"
import Heading from "components/CustomPageLayout/components/Heading"
import Markdown from "components/CustomPageLayout/components/Markdown"
import Svg from "components/CustomPageLayout/components/Svg"
import { normalizeData } from "../../../CustomPageLayout"

const rootCss = _theme => ({
  alignItems: `center`,
  display: `flex`,
  flexDirection: `column`,
})

const iconCss = theme => ({
  alignItems: `center`,
  background: theme.colors.blue[10],
  borderRadius: theme.radii[6],
  display: `flex`,
  height: theme.space[8],
  justifyContent: `center`,
  width: theme.space[8],

  svg: { fill: theme.colors.blue[60], height: theme.space[6], width: `auto` },
})

const headingCss = theme => ({
  fontSize: theme.fontSizes[5],
  margin: `${theme.space[4]} 0  ${theme.space[7]}`,
  textAlign: `center`,
})

const descriptionCss = theme => ({
  color: theme.colors.grey[60],
  fontSize: theme.fontSizes[2],
  margin: 0,
  textAlign: `center`,

  [theme.mediaQueries.desktop]: {
    fontSize: theme.fontSizes[2],
  },
})

export function CloudItem({ data = {} }) {
  const {
    Heading: headerContent,
    Markdown: markdown,
    Svg: svgContent,
  } = normalizeData(data)
  return (
    <div css={rootCss}>
      <Svg data={svgContent} css={iconCss} />
      <Heading data={headerContent} css={headingCss} />
      <Markdown data={markdown} css={descriptionCss} />
    </div>
  )
}

export default CloudItem
