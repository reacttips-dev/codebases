import * as React from "react"
import * as sanitizeHTML from "sanitize-html"
import { Heading, Text } from "gatsby-interface"

import {
  sectionCss,
  heroLedeCss,
  maxSectionWidth,
  sectionTitleCss,
} from "../style-utils"
import { getHtml } from "../utils"
import { ColorSchemeCss } from "../color-schemes"

interface RichTextBlockProps {
  text?: string
  title?: string
}

const containerCss: ColorSchemeCss = theme => [
  sectionCss(theme),
  {
    width: `100%`,
    maxWidth: maxSectionWidth.tablet,
    borderRadius: theme.radii[4],
    boxSizing: `border-box`,
    padding: theme.space[8],
    [theme.mediaQueries.tablet]: {
      padding: `${theme.space[12]} ${theme.space[14]}`,
    },
    [theme.mediaQueries.desktop]: {
      padding: `0 ${theme.space[15]}`,
    },
  },
]

const titleCss: ColorSchemeCss = theme => [
  sectionTitleCss(theme),
  {
    color: theme.colorScheme.dark,
    marginBottom: theme.space[8],
  },
]

export function RichTextBlock({ text, title }: RichTextBlockProps) {
  return (
    <section css={containerCss}>
      {title ? (
        <Heading as="h2" css={titleCss}>
          {title}
        </Heading>
      ) : null}
      {text ? (
        <Text
          as="div"
          css={heroLedeCss}
          dangerouslySetInnerHTML={{
            __html: sanitizeHTML(text, {
              allowedTags: sanitizeHTML.defaults.allowedTags.concat([
                "h2",
                "h3",
              ]),
            }),
          }}
        />
      ) : null}
    </section>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapProps = (entry: any): RichTextBlockProps => {
  const { content: richTextContent = {} } = entry
  const text = getHtml(richTextContent?.description)
  const title = richTextContent?.primaryText

  return {
    text,
    title,
  }
}
