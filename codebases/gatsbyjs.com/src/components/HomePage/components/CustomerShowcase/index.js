import React from "react"
import { contentPositionerCss } from "../../../shared/styles"
import Heading from "components/CustomPageLayout/components/Heading"
import Markdown from "components/CustomPageLayout/components/Markdown"
import Svg from "../../../CustomPageLayout/components/Svg"
import ShowcaseItem from "./ShowcaseItem"
import { normalizeData } from "../../../CustomPageLayout"
import { Link } from "gatsby-interface"
import { MdArrowForward } from "react-icons/md"
import { BackgroundLoop } from "./background-loop"

const rootCss = theme => ({
  marginBottom: `-${theme.space[10]}`,
  paddingBottom: theme.space[10],
})

const backgroundLoopCss = theme => ({
  position: `absolute`,
  left: `100%`,
  top: `-10%`,
  display: `none`,
  [theme.mediaQueries.desktop]: {
    display: `block`,
  },
})
const innerCss = theme => [
  contentPositionerCss({ theme }),
  {
    display: `grid`,
    gap: theme.space[10],
    [theme.mediaQueries.desktop]: {
      gridTemplateColumns: `3fr 7fr`,
      gap: theme.space[13],
    },
  },
]

const headingCss = theme => ({
  fontSize: theme.fontSizes[7],
  fontWeight: theme.fontWeights.extraBold,
  marginBottom: theme.space[7],
  letterSpacing: `-0.01em`,
  strong: {
    color: `#7026B9`,
    fontWeight: `inherit`,
  },

  [theme.mediaQueries.desktop]: {
    letterSpacing: `-0.02em`,
  },
})

const descriptionCss = theme => ({
  marginBottom: theme.space[7],
  maxWidth: `560px`,
})

const iconCss = theme => ({
  background: theme.colors.purple[10],
  borderRadius: theme.radii[6],
  marginBottom: theme.space[5],
  display: `none`,
  [theme.mediaQueries.desktop]: {
    display: `block`,
  },
})

const linkCss = theme => ({
  border: `none`,
  fontWeight: theme.fontWeights.semiBold,
  textDecoration: `underline`,
})

const arrowForwardCss = theme => ({
  marginLeft: theme.space[2],
})

const showcaseContainerCss = theme => ({
  display: `grid`,
  isolation: `isolate`,
  gap: theme.space[7],
  gridTemplateColumns: `repeat(2, 1fr)`,

  [theme.mediaQueries.tablet]: {
    gap: theme.space[10],
    gridTemplateColumns: `repeat(4, 1fr)`,
  },
})

const showcaseBackgroundCss = theme => ({
  background: theme.colors.magenta[10],
  borderRadius: theme.radii[4],
  height: `75%`,
  left: `65px`,
  opacity: `0.5`,
  position: `absolute`,
  top: `65px`,
  width: `85%`,
  display: `none`,
  [theme.mediaQueries.desktop]: {
    display: `block`,
  },
})

const desktopHeightStagger = [72, 0, 144, 72]

export function CustomerShowcase({ data = {} }) {
  const {
    Heading: headerContent,
    Markdown: description,
    Svg: icon,
    Cta: cta,
    ShowcaseItem: showcaseItems,
  } = normalizeData(data)
  return (
    <section css={rootCss}>
      <div css={innerCss}>
        <div css={{ position: `relative` }}>
          <BackgroundLoop css={backgroundLoopCss} />
          <Svg data={icon} asImg={true} height={32} width={32} css={iconCss} />
          <div>
            <Heading tag={"h2"} data={headerContent} css={headingCss} />{" "}
            <Markdown data={description} css={descriptionCss} />
            <Link to={cta.href} variant="SIMPLE" css={linkCss}>
              {cta.anchorText}
              <MdArrowForward css={arrowForwardCss} />
            </Link>
          </div>
        </div>
        <div
          css={{
            position: `relative`,
          }}
        >
          <div css={showcaseBackgroundCss}></div>
          <div css={showcaseContainerCss}>
            {showcaseItems.map(({ data, id }, idx) => (
              <div
                key={id}
                css={theme => ({
                  [theme.mediaQueries.desktop]: {
                    marginTop: desktopHeightStagger[idx],
                  },
                })}
              >
                <ShowcaseItem data={data} imageOnTop={idx % 2 === 0} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CustomerShowcase
