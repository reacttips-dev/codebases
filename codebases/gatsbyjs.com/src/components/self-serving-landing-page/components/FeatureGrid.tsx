import { Heading, Text, ThemeCss } from "gatsby-interface"
import * as sanitizeHTML from "sanitize-html"
import * as React from "react"
import { getHtml, getImage } from "../utils"
import { ColorSchemeCss } from "../color-schemes"
import {
  itemTitleCss,
  sectionCss,
  sectionTitleCss,
  heroLedeCss,
  maxSectionWidth,
  itemCopyCss,
  iconEyebrowHeadingCss,
} from "../style-utils"

const containerCss: ColorSchemeCss = theme => ({
  alignItems: `center`,
  // background: theme.colors.blackFade[5],
  display: `flex`,
  flexDirection: `column`,
  position: `relative`,
  margin: `auto`,
  maxWidth: maxSectionWidth.small,
  textAlign: `center`,
  zIndex: 0,
  gridGap: theme.space[10],

  [theme.mediaQueries.tablet]: {
    maxWidth: maxSectionWidth.tablet,
  },
})

const headingCss: ColorSchemeCss = theme => [
  sectionTitleCss(theme),
  {
    color: theme.colorScheme.dark,
  },
]

const ledeCss: ColorSchemeCss = theme => [
  heroLedeCss(theme),
  {
    [theme.mediaQueries.desktop]: {
      margin: `${theme.space[7]} ${theme.space[15]} ${theme.space[10]} `,
    },
  },
]

const gridCss: ThemeCss = theme => ({
  width: `100%`,
  display: `grid`,
  gridTemplateColumns: `1fr`,
  gridGap: theme.space[10],
  color: theme.colors.grey[90],
  textAlign: `center`,

  [theme.mediaQueries.tablet]: {
    gridTemplateColumns: `1fr 1fr`,
    textAlign: "left",
  },
})

const gridItemCss: ColorSchemeCss = theme => ({
  display: `flex`,
  flexDirection: `column`,
  alignItems: `center`,

  [theme.mediaQueries.tablet]: {
    alignItems: `start`,
  },
})

const gridHeadingCss: ColorSchemeCss = theme => [
  itemTitleCss(theme),
  {
    marginBottom: theme.space[3],

    "em, strong": {
      fontStyle: "normal",
      fontWeight: "inherit",
      color: theme.colorScheme.dark,
    },

    [theme.mediaQueries.desktop]: {
      textAlign: `left`,
    },
  },
]

const iconCss: ColorSchemeCss = theme => ({
  maxHeight: theme.space[13],
  marginBottom: theme.space[5],
})

export interface FeatureGridItem {
  // Heading can contain HTML
  heading: string
  text: string
  icon: string
}

export interface FeatureGridProps {
  heading: string
  lede: string
  items: Array<FeatureGridItem>
}

export function FeatureGrid({
  heading,
  lede,
  items = [],
}: FeatureGridProps): JSX.Element {
  return (
    <section css={sectionCss}>
      <div css={containerCss}>
        <div css={iconEyebrowHeadingCss}>
          {heading ? (
            <Heading as="h1" css={headingCss}>
              {heading}
            </Heading>
          ) : null}
          {lede ? (
            <Text
              size="XL"
              css={ledeCss}
              dangerouslySetInnerHTML={{
                __html: sanitizeHTML(lede, {
                  allowedTags: ["em", "strong"],
                }),
              }}
            ></Text>
          ) : null}
        </div>
        <div css={gridCss}>
          {items.map(item => {
            return (
              <div css={gridItemCss} key={item.heading}>
                {item.icon ? (
                  <div css={iconCss}>
                    <img
                      src={item.icon}
                      alt={`${item.heading} icon`}
                      role="presentation"
                      css={theme => ({
                        marginBottom: 0,
                        maxHeight: theme.space[13],
                      })}
                    />
                  </div>
                ) : null}
                {item.heading ? (
                  <Heading
                    as="h2"
                    css={gridHeadingCss}
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHTML(item.heading, {
                        allowedTags: ["em", "strong"],
                      }),
                    }}
                  />
                ) : null}
                {item.text ? (
                  <Text
                    as="div"
                    css={itemCopyCss}
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHTML(item.text, {
                        allowedTags: ["em", "strong", "a", "p"],
                      }),
                    }}
                  ></Text>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapFeatureGridProps = (entry: any): FeatureGridProps => {
  // Pull the Content, Items, and Appearance blocks out of the Section block that is passed in
  const { content, items: itemList } = entry

  // Normalize the data
  const featureGridContent = content || {}
  const items =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    itemList?.map((item: any) => {
      return {
        heading: item.primaryText,
        text: getHtml(item.description),
        icon: item.images?.length ? null : getImage(item.icon),
        image: item.images?.length ? item.images[0].gatsbyImageData : null,
      }
    }) ?? []

  // Return the props that will be passed to FeatureGrid
  return {
    heading: featureGridContent.primaryText,
    lede: getHtml(featureGridContent.description),
    items,
  }
}
