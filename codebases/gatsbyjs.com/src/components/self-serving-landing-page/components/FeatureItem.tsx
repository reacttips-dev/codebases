import * as React from "react"
import * as sanitizeHTML from "sanitize-html"
import { Heading, LinkButton, Text } from "gatsby-interface"
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image"
import { itemCopyCss, itemTitleCss } from "../style-utils"
import { ColorSchemeCss } from "../color-schemes"

export interface FeatureItemProps {
  icon?: string
  image?: IGatsbyImageData
  title: string
  emTitle: string | undefined
  text: string
  link: string
}

const rootCss: ColorSchemeCss = theme => ({
  display: `flex`,
  flexDirection: `column`,
  alignItems: `center`,
  gap: theme.space[3],
})

const emTitleCss: ColorSchemeCss = theme => ({
  color: theme.colorScheme.dark,
})

const titleCss: ColorSchemeCss = theme => [
  itemTitleCss(theme),
  {
    color: theme.colors.grey[90],
    marginBottom: theme.space[2],
  },
]

const iconCss: ColorSchemeCss = theme => ({
  display: "block",
  marginBottom: theme.space[5],
  marginLeft: "auto",
  marginRight: "auto",
})

const learnMoreCss: ColorSchemeCss = theme => ({
  marginTop: `auto`,
  background: theme.colorScheme.dark,
  borderColor: theme.colorScheme.dark,

  "&:hover": {
    background: theme.colorScheme.hover,
    borderColor: theme.colorScheme.hover,
  },
})

export function FeatureItem({
  feature,
  breakTitle = false,
}: {
  feature: FeatureItemProps
  breakTitle: boolean
}): JSX.Element {
  const { icon, image, title, emTitle, text, link } = feature

  return (
    <div css={rootCss}>
      <div>
        {icon ? (
          <img
            src={icon}
            alt={`${title} ${emTitle} icon`}
            css={iconCss}
            role="presentation"
          />
        ) : null}
        {image ? (
          <GatsbyImage
            image={image}
            alt={`${title} ${emTitle} icon`}
            css={iconCss}
          />
        ) : null}
        {title || emTitle ? (
          <Heading css={titleCss} as="h3">
            {title} {breakTitle && <br />}{" "}
            <span css={emTitleCss}>{emTitle}</span>
          </Heading>
        ) : null}
      </div>
      {text ? (
        <Text
          as="div"
          css={itemCopyCss}
          dangerouslySetInnerHTML={{
            __html: sanitizeHTML(text, {
              allowedTags: ["em", "strong", "a", "p"],
            }),
          }}
        />
      ) : null}

      {link ? (
        <LinkButton to={link} size="M" css={learnMoreCss}>
          Learn More
        </LinkButton>
      ) : null}
    </div>
  )
}
