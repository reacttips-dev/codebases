/** @jsx jsx */
import { jsx } from "@emotion/core"
import { useStaticQuery, graphql, Link } from "gatsby"
import { Badge } from "gatsby-interface"

import ContentBlock from "./content-block"
import { HeaderUtilityNav } from "./PageHeader/HeaderUtilityNav"
import { BannerHeight } from "./shared/constants/layout"

const getColor = (isInverted, theme) => {
  return isInverted
    ? { text: theme.colors.whiteFade[70], link: theme.colors.purple[30] }
    : { text: theme.colors.grey[70], link: theme.colors.purple[50] }
}

const bannerCss = (theme, isInverted) => ({
  alignItems: `center`,
  borderBottomWidth: `1px`,
  borderBottomStyle: "solid",
  borderBottomColor: isInverted
    ? theme.colors.whiteFade[10]
    : theme.colors.grey[20],
  display: `flex`,
  justifyContent: `center`,
  fontSize: theme.fontSizes[0],
  position: `relative`,
  width: "100%",

  [theme.mediaQueries.phablet]: {
    height: BannerHeight,
    marginLeft: 0,
    marginRight: 0,
  },
})

const innerContainerStyles = theme => ({
  display: `flex`,
  alignItems: `center`,
  justifyContent: `center`,
  height: `100%`,
  width: "100%",

  borderBottomLeftRadius: theme.radii[3],
  borderBottomRightRadius: theme.radii[3],

  [theme.mediaQueries.phablet]: {
    whiteSpace: `nowrap`,
    minWidth: 0,
    width: "auto",
  },
})

const contentCss = (theme, isInverted) => ({
  alignItems: `flex-start`,
  color: getColor(isInverted, theme).text,
  display: "flex",
  flexGrow: 1,
  marginLeft: `-${theme.space[6]}`,
  marginRight: `-${theme.space[6]}`,
  paddingLeft: theme.space[6],
  paddingRight: theme.space[6],
  paddingTop: theme.space[4],
  paddingBottom: theme.space[4],
  justifyContent: "center",
  overflowX: `auto`,
  width: "100%",

  maskImage: `linear-gradient(to right, transparent, ${
    theme.colors.purple[`90`]
  } ${theme.space[`6`]}, ${theme.colors.purple[`90`]} 96%, transparent)`,

  p: {
    margin: 0,
  },

  a: {
    color: getColor(isInverted, theme).link,
    fontWeight: theme.fontWeights.semiBold,
    textDecoration: `underline`,
  },

  // sloppy hide the scrollbar
  "::-webkit-scrollbar": {
    width: 0,
    height: 0,
    background: "transparent",
  },

  [theme.mediaQueries.phablet]: {
    alignItems: `center`,
    minWidth: 0,
    flexGrow: 0,
    width: "auto",
    paddingTop: 0,
    paddingBottom: 0,
    marginRight: theme.space[6],
    justifyContent: "flex-start",

    p: {
      paddingRight: theme.space[6],
    },
  },
})

const MarketingBanner = ({ isInverted, isDocs }) => {
  const { bannerContentBlock, latestBlogPost } = useStaticQuery(graphql`
    query MarketingBannerContent {
      bannerContentBlock: contentfulMarkdownContent(
        name: { eq: "Marketing Banner" }
      ) {
        __typename
        heading
        body {
          childMarkdownRemark {
            html
          }
        }
        contentfulid
        updatedAt
      }
      latestBlogPost: allWpPost(
        sort: { fields: date, order: DESC }
        # this regex is needed to speed up previews so this query isn't invalidated on every preview. This will be fixed in gatsby-source-wordpress and then this can be removed
        filter: { slug: { regex: "/^((?!autosave).)*$/" } }
        limit: 1
      ) {
        nodes {
          title
          date
          slug
        }
      }
    }
  `)

  return (
    <aside
      className="banner"
      css={theme => bannerCss(theme, isInverted)}
      aria-label="banner"
    >
      <div css={innerContainerStyles}>
        {bannerContentBlock && (
          <div css={theme => contentCss(theme, isInverted)}>
            {bannerContentBlock.heading ? (
              <Badge
                size="S"
                textVariant="CAPS"
                tone="BRAND"
                variant="STATUS"
                css={theme => ({
                  border: 0,
                  background: theme.colors.purple[10],
                  fontWeight: theme.fontWeights.semiBold,
                  borderRadius: theme.radii[2],
                  marginRight: theme.space[4],
                })}
              >
                {bannerContentBlock.heading}
              </Badge>
            ) : null}
            <ContentBlock contentBlock={bannerContentBlock} />
          </div>
        )}
        {!bannerContentBlock && latestBlogPost && (
          <div css={theme => contentCss(theme, isInverted)}>
            <p css={{ marginBottom: 0 }}>
              From our Blog:{" "}
              <Link to={`/blog/${latestBlogPost.nodes[0].slug}`}>
                {latestBlogPost.nodes[0].title}
              </Link>
            </p>
          </div>
        )}
      </div>
      <HeaderUtilityNav isInverted={isInverted} isDocs={isDocs} />
    </aside>
  )
}

export default MarketingBanner
