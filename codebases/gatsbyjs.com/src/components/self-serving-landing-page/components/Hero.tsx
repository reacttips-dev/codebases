import * as React from "react"
import * as sanitizeHTML from "sanitize-html"
import { Heading, Text, ThemeCss } from "gatsby-interface"

import { Buttons, Ctas } from "./Ctas"
import {
  sectionCss,
  heroTitleCss,
  eyebrowHeadingCss,
  heroLedeCss,
  iconEyebrowHeadingCss,
  maxSectionWidth,
} from "../style-utils"
import { getHtml, getImage, getCtas } from "../utils"
import { ColorSchemeCss } from "../color-schemes"

export interface HeroProps {
  title: string
  eyebrow?: string
  lede: string
  iconSrc?: string
  leftBackgroundSrc?: string
  rightBackgroundSrc?: string
  primaryCta?: Ctas
  secondaryCta?: Ctas
}

const containerCss: ThemeCss = theme => [
  sectionCss(theme),
  {
    paddingTop: theme.space[4],
    paddingBottom: theme.space[4],
    position: "relative",

    [theme.mediaQueries.desktop]: {
      paddingTop: theme.space[10],
      paddingBottom: theme.space[10],
    },
  },
]

const wrapperCss: ThemeCss = theme => ({
  // background: theme.colors.blackFade[5],
  display: `grid`,
  gap: theme.space[7],
  position: "relative",
  zIndex: 2,
  textAlign: "center",

  [theme.mediaQueries.desktop]: {
    width: "52rem",
    margin: `0 auto`,
  },
})

const titleCss: ColorSchemeCss = theme => [
  heroTitleCss(theme),
  {
    maxWidth: "24ch",
    marginLeft: "auto",
    marginRight: "auto",
  },
]

const contentCss: ThemeCss = theme => [
  heroLedeCss(theme),
  {
    color: theme.colors.grey[70],
    margin: `0 auto`,
    maxWidth: maxSectionWidth.default,
    whiteSpace: `pre-wrap`,
  },
]

const iconCss: ColorSchemeCss = theme => ({
  maxHeight: theme.space[13], // 72px
  textAlign: "center",
  color: theme.colorScheme.base,
})

const leftImageCss: ThemeCss = _ => ({
  position: "absolute",
  left: 0,
  top: 0,
  bottom: 0,
  margin: 0,
  maxHeight: "100%",
})

const rightImageCss: ThemeCss = _ => ({
  position: "absolute",
  right: 0,
  top: 0,
  bottom: 0,
  margin: 0,
  maxHeight: "100%",
})

export function Hero({
  title,
  eyebrow,
  iconSrc,
  rightBackgroundSrc,
  leftBackgroundSrc,
  lede,
  primaryCta,
  secondaryCta,
}: HeroProps) {
  return (
    <div css={containerCss}>
      {leftBackgroundSrc ? (
        <img
          src={leftBackgroundSrc}
          aria-hidden={true}
          alt=""
          css={leftImageCss}
        />
      ) : null}
      {rightBackgroundSrc ? (
        <img
          src={rightBackgroundSrc}
          aria-hidden={true}
          alt=""
          css={rightImageCss}
        />
      ) : null}

      <div css={wrapperCss}>
        <div css={iconEyebrowHeadingCss}>
          {iconSrc ? (
            <div css={iconCss}>
              <img src={iconSrc} aria-hidden={true} alt="" />
            </div>
          ) : null}
          {eyebrow ? <Text css={eyebrowHeadingCss}>{eyebrow}</Text> : null}
          {title ? (
            <Heading as="h1" css={titleCss}>
              {title}
            </Heading>
          ) : null}
        </div>
        {lede ? (
          <Text
            as="div"
            css={contentCss}
            dangerouslySetInnerHTML={{
              __html: sanitizeHTML(lede, {
                allowedTags: ["em", "strong"],
              }),
            }}
          />
        ) : null}
        <Buttons primaryCta={primaryCta} secondaryCta={secondaryCta} />
      </div>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapHeroProps = (entry: any): HeroProps => {
  // Pull the Content and Appearance blocks out of the Section block that is passed in
  const { content, appearance } = entry

  // Normalize the data
  const heroContent = content || {}
  const backgroundImages = appearance?.backgroundImages || []
  const { primaryCta, secondaryCta } = getCtas(heroContent)
  const iconSrc = getImage(heroContent?.icon)
  const leftBackgroundSrc = getImage(backgroundImages[0])
  const rightBackgroundSrc = getImage(backgroundImages[1])

  // Return the props that will be passed to Hero
  return {
    iconSrc,
    rightBackgroundSrc,
    leftBackgroundSrc,
    title: heroContent?.primaryText,
    eyebrow: heroContent?.secondaryText,
    lede: getHtml(heroContent?.description),
    primaryCta,
    secondaryCta,
  }
}
