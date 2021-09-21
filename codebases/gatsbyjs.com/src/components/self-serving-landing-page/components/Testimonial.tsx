import * as React from "react"
import * as sanitizeHTML from "sanitize-html"
import { Text, Avatar, Spacer, ThemeCss } from "gatsby-interface"
import { ColorSchemeCss } from "../color-schemes"
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image"
import { getHtml, getImage } from "../utils"
import { maxSectionWidth } from "../style-utils"

export interface TestimonialProps {
  text: string
  person: {
    avatar: string
    name: string
    title: string
  }
  icon: string
  backgroundImage?: IGatsbyImageData
}

const wrapperStyles: ThemeCss = theme => ({
  color: theme.colors.white,
  display: `flex`,
  flexDirection: `column`,
  alignItems: `center`,
  textAlign: `center`,
  margin: `0 auto`,
  width: `100%`,
  maxWidth: maxSectionWidth.tablet,
  borderRadius: theme.radii[4],
  position: `relative`,
  boxSizing: `border-box`,
  padding: theme.space[8],
  isolation: `isolate`,
  [theme.mediaQueries.tablet]: {
    padding: `${theme.space[12]} ${theme.space[14]}`,
  },
  [theme.mediaQueries.desktop]: {
    padding: theme.space[15],
  },
})

const overlayStyles: ColorSchemeCss = theme => ({
  width: `100%`,
  height: `100%`,
  position: `absolute`,
  top: 0,
  left: 0,
  backgroundColor: theme.colors.white,
  opacity: `95%`,

  [theme.mediaQueries.desktop]: {
    borderRadius: theme.radii[4],
  },
})

const quoteStyles: ColorSchemeCss = theme => ({
  color: theme.colors.grey[70],
  zIndex: 1,
  fontSize: theme.fontSizes[4],
})

const nameStyles: ColorSchemeCss = theme => ({
  margin: 0,
  color: theme.colors.grey[90],
  zIndex: 1,
})

const titleStyles: ColorSchemeCss = theme => ({
  margin: 0,
  color: theme.colors.grey[50],
  whiteSpace: `pre-wrap`,
  zIndex: 1,
})

const backgroundImageStyles: ColorSchemeCss = theme => ({
  width: `100%`,
  height: `100%`,
  position: `absolute`,
  top: 0,
  left: 0,
  borderRadius: theme.radii[4],
})

const iconCss: ColorSchemeCss = theme => ({
  maxHeight: theme.space[13], // 72px
  zIndex: 1,
})

const avatarWrapperCss = {
  display: `flex`,
  justifyContent: `center`,
}

const avatarInfoCss: ColorSchemeCss = theme => ({
  textAlign: `left`,
  display: `flex`,
  flexDirection: `column`,
  justifyContent: `center`,
  maxWidth: `8rem`,
  [theme.mediaQueries.desktop]: {
    maxWidth: `none`,
  },
})

export function Testimonial({
  text,
  person,
  icon,
  backgroundImage,
}: TestimonialProps) {
  return (
    <div css={wrapperStyles}>
      {backgroundImage ? (
        <GatsbyImage
          alt=""
          css={backgroundImageStyles}
          image={backgroundImage}
        />
      ) : null}
      <div css={overlayStyles} />
      {icon ? (
        <>
          <img css={iconCss} src={icon} alt="" />
          <Spacer responsiveSize={{ desktop: 10, mobile: 5 }} size={5} />{" "}
        </>
      ) : null}
      {text ? (
        <>
          <blockquote css={quoteStyles}>
            <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(text) }} />
          </blockquote>
          <Spacer responsiveSize={{ desktop: 10, mobile: 5 }} size={5} />
        </>
      ) : null}
      <div css={avatarWrapperCss}>
        {person.avatar ? (
          <Avatar
            label={`${person.name}'s avatar`}
            src={person.avatar}
            size="XL"
            css={{
              zIndex: 1,
            }}
          />
        ) : null}
        <Spacer direction="horizontal" size={5} />
        <div css={avatarInfoCss}>
          {person.name ? (
            <Text size="L" css={nameStyles}>
              {person.name}
            </Text>
          ) : null}
          {person.title ? (
            <Text size="S" css={titleStyles}>
              {person.title}
            </Text>
          ) : null}
        </div>
      </div>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapTestimonialProps = (entry: any): TestimonialProps => {
  const { content, appearance } = entry
  // Normalize the data
  const testimonialContent = content || {}

  const icon = getImage(testimonialContent?.icon)
  const backgroundImage = appearance?.backgroundImages?.[0].gatsbyImageData
  const avatarImage =
    testimonialContent?.images?.[0]?.fixed?.images?.fallback?.src

  return {
    text: getHtml(testimonialContent?.description),
    person: {
      avatar: avatarImage,
      name: testimonialContent?.primaryText,
      title: testimonialContent?.secondaryText,
    },
    icon,
    backgroundImage,
  }
}
