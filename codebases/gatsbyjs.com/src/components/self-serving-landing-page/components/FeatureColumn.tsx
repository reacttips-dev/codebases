import * as React from "react"
import { Heading, Text, Theme } from "gatsby-interface"
import * as sanitizeHTML from "sanitize-html"
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image"
import { Interpolation } from "@emotion/serialize"
import { getCtas } from "../utils"
import { Buttons, Ctas } from "./Ctas"

import { getHtml, getImage } from "../utils"
import {
  textLinearGradient,
  sectionCss,
  eyebrowHeadingCss,
  sectionTitleCss,
  maxSectionWidth,
  gap,
  iconEyebrowHeadingCss,
} from "../style-utils"
import { ColorSchemeCss } from "../color-schemes"

export interface FeatureColumnProps {
  title: string
  eyebrow: string
  description: string
  image: IGatsbyImageData | string
  icon?: string
  alignment: string
  primaryCta?: Ctas
  secondaryCta?: Ctas
}

const containerCss = (theme: Theme, alignment: string): Interpolation => ({
  display: `grid`,
  maxWidth: maxSectionWidth.default,
  margin: `auto`,
  alignItems: `center`,
  gridGap: theme.space[gap.default],
  gridTemplate: `"content"
                 "image"`,

  [theme.mediaQueries.desktop]: {
    gridGap: theme.space[gap.desktop],
    gridTemplate:
      alignment === "RIGHT"
        ? `"image content" / 2fr 1.3fr`
        : `"content image" / 1.3fr 2fr`,
    maxWidth: "none",
  },
})

const imageColumnCss: ColorSchemeCss = _ => ({
  gridArea: `image`,
})

const contentColumnCss: ColorSchemeCss = theme => ({
  display: `flex`,
  flexDirection: `column`,
  justifyContent: `center`,
  alignItems: `center`,
  textAlign: `center`,
  gridArea: `content`,
  gridGap: theme.space[gap.default],

  [theme.mediaQueries.desktop]: {
    alignItems: `flex-start`,
    textAlign: `left`,
    order: 2,
  },
})

const iconCss: ColorSchemeCss = theme => ({
  maxHeight: theme.space[13], // 72px
  margin: 0,
  marginLeft: "auto",
  marginRight: "auto",

  [theme.mediaQueries.desktop]: {
    marginLeft: 0,
  },
})

const titleCss: ColorSchemeCss = theme => [
  sectionTitleCss(theme),
  textLinearGradient({
    direction: 180,
    startColor: theme.colorScheme.gradient.start,
    endColor: theme.colorScheme.gradient.stop,
  }),
  {
    [theme.mediaQueries.desktop]: {
      fontSize: theme.fontSizes[8],
    },
  },
]

const descriptionCss: ColorSchemeCss = theme => ({
  margin: 0,
  fontSize: theme.fontSizes[3],
  color: theme.colors.grey[70],
  whiteSpace: `pre-wrap`,

  "& a": {
    color: theme.colorScheme.dark,
    fontWeight: theme.fontWeights.bold,
    textDecoration: `none`,
    borderBottom: `1px solid ${theme.colorScheme.base}`,
  },

  [theme.mediaQueries.desktop]: {
    fontSize: theme.fontSizes[3],
  },
})

export function FeatureColumn({
  title,
  eyebrow,
  description,
  image,
  icon,
  alignment,
  primaryCta,
  secondaryCta,
}: FeatureColumnProps) {
  const sanitizedText = sanitizeHTML(description, {
    allowedTags: ["em", "strong", "a", "p", "br"],
  })

  return (
    <section css={sectionCss}>
      <div css={theme => containerCss(theme, alignment)}>
        <div css={imageColumnCss}>
          {typeof image === "string" ? (
            <img
              css={_theme => ({
                width: `fit-content`,
                maxWidth: `100%`,
                margin: `0 auto`,
              })}
              src={image}
              alt={title}
            />
          ) : (
            <GatsbyImage image={image} alt={title} />
          )}
        </div>
        <div css={contentColumnCss}>
          <div css={iconEyebrowHeadingCss}>
            {icon ? <img src={icon} css={iconCss} alt="" /> : null}
            {eyebrow ? (
              <Heading as="h3" css={eyebrowHeadingCss}>
                {eyebrow}
              </Heading>
            ) : null}
            {title ? (
              <Heading as="h2" css={titleCss}>
                {title}
              </Heading>
            ) : null}
          </div>
          {description ? (
            <Text
              size="L"
              as="div"
              css={descriptionCss}
              dangerouslySetInnerHTML={{
                __html: sanitizedText,
              }}
            ></Text>
          ) : null}
          <Buttons primaryCta={primaryCta} secondaryCta={secondaryCta} />
        </div>
      </div>
    </section>
  )
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapFeatureColumnProps = (entry: any): FeatureColumnProps => {
  // Pull the Content and Appearance blocks out of the Section block that is passed in
  const { content, alignment = "LEFT" } = entry

  // Normalize the data
  const featureColumnContent = content || {}
  const icon = getImage(featureColumnContent?.icon)
  const { primaryCta, secondaryCta } = getCtas(featureColumnContent)

  const image = featureColumnContent?.images
    ? featureColumnContent.images[0]
    : {}
  // Return the props that will be passed to Hero
  return {
    icon,
    image: image.constrained || getImage(image),
    title: featureColumnContent?.primaryText,
    eyebrow: featureColumnContent?.secondaryText,
    description: getHtml(featureColumnContent?.description),
    alignment,
    primaryCta,
    secondaryCta,
  }
}
