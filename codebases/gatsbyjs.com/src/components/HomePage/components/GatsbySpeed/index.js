import React from "react"
import { contentPositionerCss } from "../../../shared/styles"
import { emphasizedHeadingCss } from "./styles.js"
import backgroundImage from "../../../../assets/backgrounds/home_dots.svg"
import Heading from "components/CustomPageLayout/components/Heading"
import GatsbySpeedItem from "./GatsbySpeedItem"
import { normalizeData } from "../../../CustomPageLayout"

const rootCss = _theme => ({
  background: `url(${backgroundImage}) repeat-x center top`,
  paddingTop: `7rem`,
  marginTop: `-9rem`,
})

const innerCss = theme => [
  contentPositionerCss({ theme }),
  {
    display: `flex`,
    flexDirection: `column`,
    alignItems: `center`,
  },
]

const headingCss = theme => [
  emphasizedHeadingCss({ theme }),
  {
    fontSize: theme.fontSizes[6],
    justifyContent: `center`,
    margin: `4rem auto 4rem`,
    whiteSpace: `pre-wrap`,

    [theme.mediaQueries.desktop]: {
      fontSize: theme.fontSizes[8],
    },
  },
]

export function GatsbySpeed({ data = {} }) {
  const {
    Heading: headerContent,
    GatsbySpeedItem: speedContent,
  } = normalizeData(data)
  return (
    <section css={rootCss} id="gatsby-is-fast">
      <div css={innerCss}>
        <Heading
          data={{ tag: "h4", ...headerContent }}
          css={headingCss}
          variant="EMPHASIZED"
        />
        {speedContent.map(({ data, id }, idx) => (
          <GatsbySpeedItem data={data} key={id} idx={idx + 1} />
        ))}
      </div>
    </section>
  )
}

export default GatsbySpeed
