import React from "react"
import { contentPositionerCss } from "../../../shared/styles"

import backgroundA from "../../../../assets/backgrounds/cta-block-hands-a.svg"
import backgroundB from "../../../../assets/backgrounds/cta-block-hands-b.svg"
import backgroundC from "../../../../assets/backgrounds/cta-block-hands-c.svg"
import Heading from "components/CustomPageLayout/components/Heading"
import Markdown from "components/CustomPageLayout/components/Markdown"
import Cta from "components/CustomPageLayout/components/Cta"
import { normalizeData } from "../../../CustomPageLayout"

const rootCss = theme => [
  contentPositionerCss({ theme }),
  {
    padding: 0,

    [theme.mediaQueries.phablet]: {
      width: `100%`,
    },

    [theme.mediaQueries.tablet]: {
      paddingLeft: theme.space[8],
      paddingRight: theme.space[8],
      width: `90%`,
    },
  },
]

const boxCss = theme => ({
  background: `url(${backgroundA}) no-repeat -7rem bottom, url(${backgroundB}) no-repeat right -7rem top,  url(${backgroundC}) no-repeat calc(50% + 8rem) bottom, ${theme.colors.grey[5]}`,
  padding: `7rem ${theme.space[5]}`,
  textAlign: `center`,
  display: `flex`,
  flexDirection: `column`,
  alignItems: `center`,

  [theme.mediaQueries.tablet]: {
    background: `url(${backgroundA}) no-repeat left bottom, url(${backgroundB}) no-repeat right top,  url(${backgroundC}) no-repeat calc(50% + 8rem) bottom, ${theme.colors.grey[5]} `,
    borderRadius: theme.radii[3],
  },
})

const headingCss = theme => ({
  fontSize: theme.fontSizes[8],
})

const ledeCss = theme => ({
  fontSize: theme.fontSizes[3],
  color: theme.colors.grey[90],
  marginBottom: theme.space[7],
})

export function CtaBlock({ data = {} }) {
  const {
    Heading: headerContent,
    Markdown: markdown,
    Cta: ctaContent,
  } = normalizeData(data)
  return (
    <section css={rootCss}>
      <div css={boxCss}>
        <Heading
          data={{ tag: "h2", ...headerContent }}
          css={headingCss}
          variant="EMPHASIZED"
        />
        <Markdown data={markdown} css={ledeCss} />
        <Cta data={ctaContent} />
      </div>
    </section>
  )
}

export default CtaBlock
