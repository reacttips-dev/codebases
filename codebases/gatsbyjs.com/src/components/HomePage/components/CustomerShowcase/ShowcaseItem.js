import React from "react"
import Heading from "components/CustomPageLayout/components/Heading"
import Picture from "components/CustomPageLayout/components/Picture"
import { normalizeData } from "../../../CustomPageLayout"
import { Link } from "gatsby-interface"

const rootCss = theme => ({
  display: `grid`,
  gap: theme.space[5],
})

const siteInfoCss = {
  width: `fit-content`,
  "&:hover > *": {
    color: `#7026B9`,
  },
}

const sitePictureCss = theme => ({
  borderRadius: theme.radii[2],
  filter: `drop-shadow(0px 4px 8px rgba(137, 84, 168, 0.16)) drop-shadow(0px 2px 4px rgba(102, 51, 153, 0.08))`,
})

const headingCss = theme => ({
  color: theme.colors.grey[50],
  fontSize: theme.fontSizes[0],
  fontWeight: theme.fontWeights.bold,
  textTransform: `uppercase`,
  lineHeight: `15px`,
  marginBottom: `-4px`,
})

const linkCss = theme => ({
  fontSize: theme.fontSizes[0],
  color: theme.colors.grey[70],
})

export function ShowcaseItem({ data = {}, imageOnTop = true }) {
  const {
    Heading: headerContent,
    Picture: sitePicture,
    Cta: siteLink,
  } = normalizeData(data)
  return (
    <article css={rootCss}>
      <Picture
        data={sitePicture}
        css={theme => [
          sitePictureCss(theme),
          {
            order: imageOnTop ? 0 : 1,
            [theme.mediaQueries.tablet]: {
              order: 0,
            },
          },
        ]}
      />
      <div css={siteInfoCss}>
        <Heading data={headerContent} css={headingCss} />
        <Link href={siteLink.href} css={linkCss}>
          {siteLink.anchorText}
        </Link>
      </div>
    </article>
  )
}

export default ShowcaseItem
