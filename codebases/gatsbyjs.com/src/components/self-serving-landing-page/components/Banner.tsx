import * as React from "react"
import * as sanitizeHtml from "sanitize-html"
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image"
import { Heading, Text, ThemeCss } from "gatsby-interface"
import VideoEmbed from "./VideoEmbed"
import { Buttons, Ctas } from "./Ctas"
import { getCtas, getHtml, getImage } from "../utils"
import { ColorSchemeCss } from "../color-schemes"
import {
  sectionCss,
  eyebrowHeadingCss,
  sectionTitleCss,
  maxSectionWidth,
  iconEyebrowHeadingCss,
  alignmentCss,
} from "../style-utils"

export interface BannerProps {
  title: string
  eyebrow: string
  description: string
  iconSrc?: string
  videoEmbedId?: string
  bannerImage?: IGatsbyImageData
  alignment?: "left" | "right" | "center"
  leftBackgroundSrc?: string
  rightBackgroundSrc?: string
  primaryCta: Ctas
  secondaryCta: Ctas
}

const containerCss: ThemeCss = () => ({
  position: "relative",
})

const wrapperCss: ThemeCss = theme => ({
  display: `grid`,
  gap: theme.space[7],
  position: `relative`,
  zIndex: 2,

  [theme.mediaQueries.desktop]: {
    width: `52rem`,
  },
})

const titleCss: ColorSchemeCss = theme => [
  sectionTitleCss(theme),
  {
    color: theme.colors.grey[90],

    strong: {
      color: theme.colorScheme.dark,
      fontWeight: `inherit`,
    },

    span: {
      display: `block`,
    },
  },
]

const contentCss: ThemeCss = theme => ({
  color: theme.colors.grey[70],
  margin: 0,
  maxWidth: maxSectionWidth.default,
  zIndex: theme.zIndices.base,
  whiteSpace: `pre-wrap`,

  p: {
    margin: 0,
  },
})

const iconCss: ThemeCss = theme => ({
  maxHeight: theme.space[13], // 72px
})

const leftImageCss: ThemeCss = _ => ({
  position: "absolute",
  left: 0,
  top: 0,
  bottom: 0,
})

const rightImageCss: ThemeCss = _ => ({
  position: "absolute",
  right: 0,
  top: 0,
  bottom: 0,
})

const bannerImgWrapperCss: ThemeCss = _ => ({
  width: `80%`,
})

export function Banner({
  title,
  eyebrow,
  iconSrc,
  bannerImage,
  alignment = "center",
  rightBackgroundSrc,
  leftBackgroundSrc,
  description,
  primaryCta,
  secondaryCta,
  videoEmbedId,
}: BannerProps) {
  return (
    <section css={sectionCss}>
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
        <div css={theme => [wrapperCss(theme), alignmentCss(alignment)]}>
          <div css={iconEyebrowHeadingCss}>
            {iconSrc ? (
              <div css={theme => [iconCss(theme), alignmentCss(alignment)]}>
                <img src={iconSrc} aria-hidden={true} alt="" />
              </div>
            ) : null}
            {eyebrow ? <Text css={eyebrowHeadingCss}>{eyebrow}</Text> : null}
            {title ? (
              <Heading
                as="h2"
                css={titleCss}
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(title, {
                    allowedTags: ["em", "strong"],
                  }),
                }}
              />
            ) : null}
          </div>
          {bannerImage ? (
            <div
              css={theme => [
                bannerImgWrapperCss(theme),
                alignmentCss(alignment),
              ]}
            >
              <GatsbyImage image={bannerImage} alt="" />
            </div>
          ) : null}
          {description ? (
            <Text
              as="div"
              size="L"
              css={theme => [contentCss(theme), alignmentCss(alignment)]}
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(description, {
                  allowedTags: ["em", "strong", "a", "p"],
                }),
              }}
            />
          ) : null}
          {videoEmbedId ? (
            <VideoEmbed title={title} embedId={videoEmbedId} />
          ) : null}
          <Buttons
            primaryCta={primaryCta}
            secondaryCta={secondaryCta}
            alignment={alignment}
          />
        </div>
      </div>
    </section>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapBannerProps = (entry: any): BannerProps => {
  // Pull the Content and Appearance blocks out of the Section block that is passed in
  const { content, appearance, alignment = "center" } = entry

  // Normalize the data
  const bannerContent = content || {}
  const bannerImage = bannerContent?.images?.[0] || {}
  const videoEmbedId = bannerContent?.videoEmbedId || ""
  const backgroundImages = appearance?.backgroundImages || []
  const { primaryCta, secondaryCta } = getCtas(bannerContent)
  const iconSrc = getImage(bannerContent.icon)
  const leftBackgroundSrc = getImage(backgroundImages[0])
  const rightBackgroundSrc = getImage(backgroundImages[1])

  // Pass these props to Banner
  return {
    iconSrc,
    rightBackgroundSrc,
    leftBackgroundSrc,
    bannerImage: bannerImage?.constrained,
    title: bannerContent?.primaryText,
    eyebrow: bannerContent?.secondaryText,
    description: getHtml(bannerContent?.description),
    primaryCta,
    secondaryCta,
    videoEmbedId,
    alignment,
  }
}
