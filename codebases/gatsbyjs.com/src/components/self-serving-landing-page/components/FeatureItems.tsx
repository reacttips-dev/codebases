import * as React from "react"
import { Heading, ThemeCss } from "gatsby-interface"
import { IGatsbyImageData } from "gatsby-plugin-image"
import { getCtas, getHtml, getImage } from "../utils"
import { ContentfulSelfServicePageContent } from "../constants"
import { ColorSchemeCss } from "../color-schemes"
import { FeatureItem, FeatureItemProps } from "./FeatureItem"
import { sectionCss, sectionTitleCss, maxSectionWidth } from "../style-utils"

export interface FeatureItemsProps {
  heading: string
  items: Array<FeatureItemProps> & { images?: Array<IGatsbyImageData> }
}

const containerCss: ColorSchemeCss = theme => ({
  alignItems: `center`,
  // background: theme.colors.blackFade[5],
  display: `flex`,
  flexDirection: `column`,
  position: `relative`,
  margin: `auto`,
  maxWidth: maxSectionWidth.default,
  gridGap: theme.space[10],
  textAlign: `center`,
  zIndex: 0,

  [theme.mediaQueries.desktop]: {
    maxWidth: maxSectionWidth.tablet,
  },
})

const headingCss: ColorSchemeCss = theme => [
  sectionTitleCss(theme),
  {
    color: theme.colorScheme.dark,
  },
]

const flexCss: ThemeCss = theme => ({
  width: `100%`,
  display: `flex`,
  flexWrap: `wrap`,
  justifyContent: `space-around`,
  gap: theme.space[10],
  color: theme.colors.grey[90],

  [theme.mediaQueries.tablet]: {
    "& > *": {
      flex: `0 1 34%`,
    },
  },
  [theme.mediaQueries.desktop]: {
    gap: theme.space[12],
    "& > *": {
      flex: `0 1 26%`,
    },
  },
})

export function FeatureItems({
  heading,
  items = [],
}: FeatureItemsProps): JSX.Element {
  return (
    <section css={sectionCss}>
      <div css={containerCss}>
        {heading ? (
          <Heading as="h2" css={headingCss}>
            {heading}
          </Heading>
        ) : null}
        <div css={flexCss}>
          {items.map((item, idx) => (
            <FeatureItem key={idx} feature={item} breakTitle={true} />
          ))}
        </div>
      </div>
    </section>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapFeatureItemsProps = (entry: any): FeatureItemsProps => {
  // Pull the Content, Items, and Appearance blocks out of the Section block that is passed in
  const { content, items: itemList } = entry

  // Normalize the data
  const featureItemsContent = content || {}
  const items =
    itemList?.map(
      (item: ContentfulSelfServicePageContent): FeatureItemProps => {
        const { primaryCta } = getCtas(item)
        return {
          icon:
            Array.isArray(item.images) && item.images.length
              ? null
              : getImage(item.icon),
          image:
            Array.isArray(item.images) && item.images.length
              ? item.images[0].gatsbyImageData
              : null,
          title: item.primaryText,
          emTitle: item.secondaryText,
          text: getHtml(item.description),
          link: primaryCta.to,
        }
      }
    ) ?? []

  // Return the props that will be passed to FeatureGrid
  return {
    heading: featureItemsContent?.primaryText,
    items,
  }
}
