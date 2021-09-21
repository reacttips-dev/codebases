import * as React from "react"
import * as sanitizeHTML from "sanitize-html"
import { Heading, ThemeCss } from "gatsby-interface"
import { Buttons, Ctas } from "./Ctas"
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image"
import {
  sectionCss,
  eyebrowHeadingCss,
  heroTitleCss,
  heroLedeCss,
  iconEyebrowHeadingCss,
  maxSectionWidth,
  gap,
} from "../style-utils"
import { getHtml, getCtas } from "../utils"
import { ColorSchemeCss } from "../color-schemes"

export interface TwoColumnHeroProps {
  title: string
  eyebrow?: string
  lede: string
  heroImage: IGatsbyImageData
  primaryCta?: Ctas
  secondaryCta?: Ctas
}

const headerCss: ThemeCss = theme => [
  {
    alignItems: "center",
    display: `flex`,
    flexDirection: `column`,
    position: "relative",
    justifyContent: "center",
    textAlign: "center",
    gap: theme.space[gap.default],

    [theme.mediaQueries.desktop]: {
      flexDirection: "row",
      textAlign: "left",
      gap: theme.space[gap.desktop],
    },
  },
]

const mediaCss: ThemeCss = theme => ({
  width: "100%",
  maxWidth: "28rem",

  [theme.mediaQueries.desktop]: {
    maxWidth: "none",
    maxHeight: 520,
    width: "45%",
  },
})

const contentCss: ThemeCss = theme => ({
  color: theme.colors.grey[70],
  display: "grid",
  gap: theme.space[gap.default],
  maxWidth: maxSectionWidth.default,

  [theme.mediaQueries.desktop]: {
    maxWidth: "none",
    width: "55%",
    justifyItems: "flex-start",
  },
})

const ledeCss: ColorSchemeCss = theme => [
  heroLedeCss(theme),
  {
    whiteSpace: `pre-wrap`,
    color: theme.colors.grey[70],
    fontFamily: theme.fonts.body,
  },
]

export function TwoColumnHero({
  title,
  eyebrow,
  lede,
  heroImage,
  primaryCta,
  secondaryCta,
}: TwoColumnHeroProps) {
  return (
    <div css={sectionCss}>
      <header css={headerCss}>
        <div css={contentCss}>
          <div css={iconEyebrowHeadingCss}>
            {eyebrow ? (
              <Heading css={eyebrowHeadingCss} as="h2">
                {eyebrow}
              </Heading>
            ) : null}
            {title ? (
              <Heading as="h1" css={heroTitleCss}>
                {title}
              </Heading>
            ) : null}
          </div>
          {lede ? (
            <div
              css={ledeCss}
              dangerouslySetInnerHTML={{
                __html: sanitizeHTML(lede, {
                  allowedTags: ["em", "strong"],
                }),
              }}
            />
          ) : null}
          <Buttons primaryCta={primaryCta} secondaryCta={secondaryCta} />
        </div>
        <div css={mediaCss}>
          {heroImage ? <GatsbyImage image={heroImage} alt="" /> : null}
        </div>
      </header>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapTwoColumnHeroProps = (entry: any): TwoColumnHeroProps => {
  // Pull the Content and Appearance blocks out of the Section block that is passed in
  const { content } = entry

  // Normalize the data
  const twoColumnheroContent = content || {}
  const heroImage = twoColumnheroContent.images?.[0] || {}
  const { primaryCta, secondaryCta } = getCtas(twoColumnheroContent)

  // Return the props that will be passed to twoColumnHero
  return {
    title: twoColumnheroContent?.primaryText,
    eyebrow: twoColumnheroContent?.secondaryText,
    lede: getHtml(twoColumnheroContent?.description),
    heroImage: heroImage?.constrained,
    primaryCta,
    secondaryCta,
  }
}
