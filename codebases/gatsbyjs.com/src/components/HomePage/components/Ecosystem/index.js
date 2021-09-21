import React from "react"
import Img from "gatsby-image"
import Heading from "components/CustomPageLayout/components/Heading"
import EcosystemItem from "./EcosystemItem"
import { contentPositionerCss } from "../../../shared/styles"
import Markdown from "components/CustomPageLayout/components/Markdown"
import { normalizeData } from "../../../CustomPageLayout"

const rootCss = theme => [contentPositionerCss({ theme })]

const headerCss = theme => ({
  display: `grid`,
  gap: theme.space[6],
  textAlign: `center`,
})

const headingCss = theme => ({
  fontSize: theme.fontSizes[10],
  letterSpacing: theme.letterSpacings.tight,
  lineHeight: theme.lineHeights.solid,
})

const ledeCss = theme => ({
  margin: `0 auto`,
  maxWidth: `50rem`,
  textAlign: "center",
  fontSize: theme.fontSizes[4],
})

const frameCss = theme => ({
  position: `relative`,
  marginTop: theme.space[10],
  maxWidth: `1400px`,
  margin: `${theme.space[10]} auto 0`,

  [theme.mediaQueries.desktop]: {
    minHeight: `625px`,
  },
})

const accordionCss = theme => ({
  display: `flex`,
  flexDirection: `column`,
  justifyContent: `center`,

  [theme.mediaQueries.tablet]: {
    width: `50%`,
    minHeight: `625px`,
  },

  [theme.mediaQueries.desktop]: {
    paddingRight: theme.space[9],
    paddingLeft: theme.space[9],
  },
})

const displayCss = theme => ({
  display: `none`,
  position: `absolute`,
  height: `625px`,
  minWidth: `700px`,
  width: `50%`,
  left: `50%`,
  top: `50%`,
  transform: `translateY(-50%)`,

  [theme.mediaQueries.tablet]: {
    display: `block`,
  },
})

export function Ecosystem({ data = {} }) {
  const {
    Heading: headerContent,
    Markdown: markdown,
    EcosystemItem: items,
  } = normalizeData(data)

  const pictures = items.map(item => {
    const itemContent = item.data?.content || []
    const itemPicture = itemContent.find(
      contentItem => contentItem.image?.fluid
    ).image?.fluid

    return itemPicture
  })

  const [activeItem, setActiveItem] = React.useState(0)

  return (
    <section css={theme => rootCss(theme)}>
      <header css={headerCss}>
        <Heading
          data={{ tag: "h2", ...headerContent }}
          css={headingCss}
          variant="EMPHASIZED"
        />
        <Markdown data={markdown} css={ledeCss} />
      </header>
      <div css={frameCss}>
        <div css={accordionCss}>
          {items.map((item, idx) => {
            const { id, componentName, data } = item
            return (
              <EcosystemItem
                key={id}
                data={data}
                componentName={componentName}
                activeItem={activeItem}
                setActiveItem={setActiveItem}
                isExpanded={idx === activeItem}
                expand={() => setActiveItem(idx)}
              />
            )
          })}
        </div>
        <div css={displayCss}>
          <Img fluid={pictures[activeItem]} alt="" />
        </div>
      </div>
    </section>
  )
}

export default Ecosystem
