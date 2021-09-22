/** @jsx jsx */
import { jsx } from "@emotion/core"
import { graphql } from "gatsby"
import Img from "gatsby-image"
import { Fragment } from "react"
import propTypes from "prop-types"
import get from "lodash/get"

import Profiles from "../components/profiles"
import Job from "../components/job"
import CTASection from "../components/section/cta"
import { subtitleStyles } from "../utils/styles"

const gridPaddingHorizontal = theme => theme.space[7]

const styles = {
  grid: theme => ({
    [theme.mediaQueries.phablet]: {
      alignItems: `stretch`,
      display: `flex`,
      justifyContent: `space-between`,
      marginLeft: `-${gridPaddingHorizontal(theme)}`,
      marginRight: `-${gridPaddingHorizontal(theme)}`,
    },
  }),
}

/* Text Content Block */
const TextBlock = ({ text, textStyles }) => <p css={textStyles}>{text}</p>

TextBlock.propTypes = {
  text: propTypes.string.isRequired,
  textStyles: propTypes.object.isRequired,
}
/* Text Content Block */

/* Markdown Content Block */
const MarkdownBlock = ({ title, html, className }) => (
  <Fragment>
    {!!title && <h3>{title}</h3>}
    <div dangerouslySetInnerHTML={{ __html: html }} css={className} />
  </Fragment>
)

MarkdownBlock.propTypes = {
  html: propTypes.string,
  title: propTypes.string,
}
/* Markdown Content Block */

/* Grid Content Block */
const GridBlock = ({ title, columns, contentBlocks }) => (
  <Fragment>
    {!!title && <h3>{title}</h3>}
    <div css={styles.grid}>
      {contentBlocks.map(cb => (
        <div
          key={cb.id}
          css={theme => ({
            [theme.mediaQueries.phablet]: {
              width: `calc(100% / ${columns})`,
              paddingLeft: gridPaddingHorizontal(theme),
              paddingRight: gridPaddingHorizontal(theme),
            },
          })}
        >
          <ContentBlock contentBlock={cb} />
        </div>
      ))}
    </div>
  </Fragment>
)

GridBlock.propTypes = {
  contentBlocks: propTypes.arrayOf(propTypes.object).isRequired,
  columns: propTypes.number.isRequired,
  title: propTypes.string,
}
/* Grid Content Block */

/* Asset Content Block */
const AssetBlock = ({ asset, maxWidth = 1280 }) => (
  <Fragment>
    <div
      css={theme => ({
        margin: `auto`,
        marginLeft: `calc(50% - 45w)`,
        marginRight: `calc(50% - 45vw)`,

        [theme.mediaQueries.phablet]: {
          marginLeft: `calc(50% - 40vw)`,
          marginRight: `calc(50% - 40vw)`,
        },
        [theme.mediaQueries.hd]: {
          marginLeft: `calc(50% - 30vw)`,
          marginRight: `calc(50% - 30vw)`,
        },
      })}
    >
      <div css={{ maxWidth: maxWidth, margin: `0 auto` }}>
        <Img fluid={asset} />
      </div>
    </div>
  </Fragment>
)
/* Asset Content Block */

/* Asset with mobile fallback Content Block */
const AssetBlockWithMobileFallback = ({ contentBlock }) => (
  <Fragment>
    <div
      css={theme => ({
        display: `none`,
        [theme.mediaQueries.tablet]: { display: `block` },
      })}
    >
      {contentBlock.mediaLarge && (
        <AssetBlock asset={contentBlock.mediaLarge.fluid} />
      )}
    </div>
    <div
      css={theme => ({
        display: `block`,
        [theme.mediaQueries.tablet]: { display: `none` },
      })}
    >
      {contentBlock.mediaSmall && (
        <AssetBlock asset={contentBlock.mediaSmall.fluid} maxWidth={400} />
      )}
    </div>
  </Fragment>
)
/* Asset with mobile fallback Content Block */

/* CTA Content Block */
const CtaBlock = ({
  title,
  body,
  associatedPage,
  associatedLandingPage,
  linkText,
}) => (
  <CTASection
    associatedPage={associatedPage}
    associatedLandingPage={associatedLandingPage}
    title={title}
    text={body}
    linkText={linkText}
  />
)

CtaBlock.propTypes = {
  body: propTypes.object,
  title: propTypes.string,
  associatedPage: propTypes.object,
  associatedLandingPage: propTypes.object,
  linkText: propTypes.string,
}
/* CTA Content Block */

/* Profiles Content Block */
const ProfilesBlock = ({ title, contentBlocks }) => (
  <Fragment>
    {!!title && (
      <h3
        css={theme => [
          subtitleStyles(theme),
          {
            color: theme.colors.gatsby,
            fontWeight: 800,
            paddingBottom: theme.space[5],
            "& span": {
              fontWeight: `normal`,
            },
          },
        ]}
        dangerouslySetInnerHTML={{
          __html: title,
        }}
      />
    )}
    <div
      css={theme => ({
        display: `flex`,
        flexWrap: `wrap`,
        maxWidth: `100%`,
        margin: `auto`,
        [theme.mediaQueries.tablet]: {
          justifyContent: `space-between`,
        },
      })}
    >
      {contentBlocks &&
        contentBlocks.map((cb, i) => <Profiles profiles={[cb]} key={i} />)}
    </div>
  </Fragment>
)

ProfilesBlock.propTypes = {
  contentBlocks: propTypes.arrayOf(propTypes.object),
  title: propTypes.string,
}
/* Profiles Content Block */

/* Jobs Content Block */
const JobsBlock = ({ contentBlocks }) => (
  <Fragment>
    {contentBlocks &&
      contentBlocks.map((cb, i) => <Job job={cb} key={i} idx={i} />)}
  </Fragment>
)

JobsBlock.propTypes = {
  contentBlocks: propTypes.arrayOf(propTypes.object),
}
/* Jobs Content Block */

/* Content Block */
const graphQLTypeToBlockType = {
  ContentfulLongFormBlock: `markdown`,
  ContentfulMarkdownContent: `markdown`,
  ContentfulTextBlock: `text`,
  ContentfulGridBlock: `grid`,
  ContentfulProfilesBlock: `profiles`,
  ContentfulJobsBlock: `jobs`,
  ContentfulCtaBlock: `cta`,
  ContentfulAssetBlock: `asset`,
  ContentfulAssetBlockWithMobileFallback: `asset-mobile`,
}

const getBlockType = contentBlock =>
  graphQLTypeToBlockType[contentBlock.__typename]

const ContentBlock = ({ contentBlock, className }) => {
  const type = getBlockType(contentBlock)

  if (type === `text`) {
    return (
      <TextBlock
        text={contentBlock.childContentfulTextBlockTextTextNode.text}
        textStyles={JSON.parse(
          contentBlock.childContentfulTextBlockCssJsonNode.internal.content
        )}
      />
    )
  }

  if (type === `markdown`) {
    const html = get(contentBlock.body, `childMarkdownRemark.html`)
    return (
      <MarkdownBlock
        title={contentBlock.title}
        html={html}
        className={className}
      />
    )
  }

  if (type === `grid`) {
    return (
      <GridBlock
        title={contentBlock.title}
        columns={contentBlock.columns}
        contentBlocks={contentBlock.contentBlocks}
      />
    )
  }

  if (type === `profiles`) {
    return (
      <ProfilesBlock
        contentBlocks={contentBlock.contentBlocks}
        title={contentBlock.title}
      />
    )
  }

  if (type === `jobs`) {
    return <JobsBlock contentBlocks={contentBlock.jobBlocks} />
  }

  if (type === `asset`) {
    return <AssetBlock asset={contentBlock.asset.fluid} />
  }

  if (type === `asset-mobile`) {
    return <AssetBlockWithMobileFallback contentBlock={contentBlock} />
  }

  if (type === `cta`) {
    return (
      <CtaBlock
        title={contentBlock.title}
        body={contentBlock.body}
        associatedPage={contentBlock.associatedPage}
        associatedLandingPage={contentBlock.associatedLandingPage}
        linkText={contentBlock.linkText}
      />
    )
  }

  return null
}

ContentBlock.propTypes = {
  contentBlock: propTypes.object.isRequired,
  className: propTypes.string,
}

/* Content Block */

export const contentBlocksFragment = graphql`
  fragment ContentBlocks on ContentfulPage {
    contentBlocks {
      __typename
      ... on ContentfulRichContentBlock {
        contentfulid
        title
        subtitle
        badge
        actions {
          displayTitle
          url
        }
        content {
          ... on ContentfulMarkdownContent {
            childContentfulMarkdownContentBodyTextNode {
              childMarkdownRemark {
                html
              }
            }
            contentfulid
          }
        }
      }
      ... on ContentfulGridBlock {
        id
        title
        columns
        contentBlocks {
          __typename
          ... on ContentfulLongFormBlock {
            id
            title
            body {
              childMarkdownRemark {
                html
              }
            }
          }
        }
      }
      ... on ContentfulTextBlock {
        id
        childContentfulTextBlockTextTextNode {
          text
        }
        childContentfulTextBlockCssJsonNode {
          internal {
            content
          }
        }
      }
      ... on ContentfulLongFormBlock {
        id
        title
        subtitle
        contentfulid
        body {
          childMarkdownRemark {
            html
          }
        }
      }
      ... on ContentfulCtaBlock {
        title
        body {
          childMarkdownRemark {
            html
          }
        }
        linkText
        associatedPage {
          name
          slug
          parentPage {
            name
            slug
          }
        }
        associatedLandingPage {
          name
          slug
        }
      }
      ... on ContentfulProfilesBlock {
        id
        title
        contentBlocks {
          __typename
          ... on ContentfulProfile {
            ...ProfilesFragment
          }
        }
      }
      ... on ContentfulAssetBlockWithMobileFallback {
        mediaLarge {
          fluid(maxWidth: 1280) {
            ...GatsbyContentfulFluid
          }
        }
        mediaSmall {
          fluid(maxWidth: 400) {
            ...GatsbyContentfulFluid
          }
        }
      }
      ... on ContentfulJobsBlock {
        id
        jobBlocks {
          __typename
          ... on ContentfulJob {
            jobTitle
            jobPage {
              slug
              parentPage {
                slug
              }
            }
            externalLink
            jobDescription {
              id
              childMarkdownRemark {
                html
              }
            }
          }
        }
      }
    }
  }
`

export default ContentBlock
