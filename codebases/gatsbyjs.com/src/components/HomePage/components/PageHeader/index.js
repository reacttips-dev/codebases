import React from "react"
import { Heading, Spacer, LinkButton } from "gatsby-interface"
import Image from "gatsby-image"
import { MdArrowForward } from "react-icons/md"
import { contentPositionerCss } from "../../../shared/styles"
import { normalizeContent } from "../../../CustomPageLayout"

const rootCss = theme => [contentPositionerCss({ theme })]

const headerCss = theme => ({
  alignItems: "center",
  display: `flex`,
  flexDirection: `column`,
  gap: theme.space[10],
  position: "relative",
  textAlign: "center",

  [theme.mediaQueries.desktop]: {
    flexDirection: "row",
    minHeight: "70vh",
    textAlign: "left",
  },
})

const contentCss = theme => ({
  flexBasis: "50%",
  maxWidth: 640,

  [theme.mediaQueries.desktop]: {
    minWidth: 420,
  },
})

const mediaCss = {
  flexBasis: "50%",
  width: "100%",

  ".gatsby-image-wrapper": {
    margin: "auto",
    maxWidth: 520,
  },

  img: {
    marginBottom: "0 !important",
  },
}

const headingCss = theme => ({
  color: `#7026B9`,
  fontSize: theme.fontSizes[9],
  fontWeight: theme.fontWeights.extraBold,
  letterSpacing: theme.letterSpacings.tight,
  lineHeight: 1.1,
  paddingTop: theme.space[8],

  [theme.mediaQueries.tablet]: {
    fontSize: theme.fontSizes[10],
    paddingTop: theme.space[10],
  },

  [theme.mediaQueries.hd]: {
    fontSize: theme.fontSizes[11],
    paddingTop: theme.space[12],
  },

  ".futura-loading &": {
    fontSize: `52px`,
    fontWeight: 900,
    letterSpacing: `1px`,
    lineHeight: `1.05`,
  },

  span: {
    color: theme.colors.black,
  },
})

const ctasCss = theme => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  marginTop: theme.space[6],
  zIndex: 1,

  [theme.mediaQueries.tablet]: {
    flexDirection: "row",
  },

  [theme.mediaQueries.desktop]: {
    justifyContent: "flex-start",
    marginTop: theme.space[8],
  },
})

const ctaBlockCss = theme => ({
  display: "block",
  [theme.mediaQueries.tablet]: {
    paddingRight: `${theme.space[6]}`,
  },
})

const subtitleCss = theme => ({
  color: theme.colors.grey[80],
  fontSize: theme.fontSizes[3],
  marginTop: theme.space[8],

  p: { margin: 0 },

  [theme.mediaQueries.tablet]: {
    fontSize: theme.fontSizes[4],
  },
})

const primaryButtonCss = theme => ({
  alignSelf: "center",
  background: `#7026B9`,
  borderRadius: theme.radii[3],
  marginTop: "auto",
})

const secondaryButtonCss = theme => ({
  ...primaryButtonCss(theme),
  background: "transparent",
  border: 0,
  color: `#7026B9`,

  "&:hover": {
    background: theme.colors.purple[5],
    border: 0,
  },
})

const ctaTitleCss = theme => ({
  color: theme.colors.grey[90],
  fontSize: theme.fontSizes[2],
  fontWeight: theme.fontWeights.body,
  letterSpacing: theme.letterSpacings.tracked,
  textTransform: "uppercase",
  marginBottom: theme.space[2],
})

const subtitlePrimaryCss = theme => ({
  color: theme.colors.purple[60],
  fontWeight: theme.fontWeights.extraBold,
  fontSize: theme.fontSizes[5],
  letterSpacing: theme.letterSpacings.tight,
  lineHeight: theme.lineHeights.solid,
})

const subtitleSkyCss = theme => ({
  color: theme.colors.blue[50],
})

const variantCssByComponentName = theme => ({
  PageHeaderCtaPrimary: subtitlePrimaryCss(theme),
  PageHeaderCtaSky: subtitleSkyCss(theme),
})

const buttonCssByComponentName = {
  PageHeaderCtaPrimary: primaryButtonCss,
  PageHeaderCtaSky: secondaryButtonCss,
}

const ctaContentCss = theme => ({
  fontSize: theme.fontSizes[2],

  [theme.mediaQueries.hd]: {
    fontSize: theme.fontSizes[3],
  },
})

const CtaBlock = ({ Title, Product, Content, Action, ...props }) => {
  return (
    <div css={ctaBlockCss} {...props}>
      {Title}
      {Product}
      <Spacer size={5} />
      <div>{Content}</div>
      {Action}
    </div>
  )
}

export const PageHeader = ({ data = {} }) => {
  const content = normalizeContent(data.content)

  const heading = content.find(item => item.componentName === "Heading")

  const catchphrase = content.find(item => item.componentName === "Markdown")
  const image = content.find(item => item.componentName === "Picture")

  const ctas = content
    .filter(
      item =>
        item.componentName === "PageHeaderCtaSky" ||
        item.componentName === "PageHeaderCtaPrimary"
    )
    .map(rawCta => {
      const rawFields = rawCta.data.content
      const link = rawFields.find(field => field.name.includes("Link"))

      return {
        link: link.href,
        linkText: link.anchorText,
        variant: rawCta.componentName,
      }
    })
  return (
    <div css={rootCss}>
      <header css={headerCss}>
        <div css={contentCss}>
          <Heading
            as="h1"
            id="page-header-title"
            css={headingCss}
            dangerouslySetInnerHTML={{ __html: heading?.data?.text?.text }}
          />

          <div
            id="page-subtitle"
            css={subtitleCss}
            dangerouslySetInnerHTML={{
              __html: catchphrase?.data?.body?.childMarkdownRemark?.html,
            }}
          />

          <div css={ctasCss}>
            {ctas.map(cta => (
              <CtaBlock
                id={`page-header-cta-${cta.title}`}
                key={`page-header-cta-${cta.title}`}
                Title={
                  <Heading as="h2" css={ctaTitleCss}>
                    {cta.title}
                  </Heading>
                }
                Product={
                  <Heading
                    as="h3"
                    css={theme => [
                      variantCssByComponentName(theme).PageHeaderCtaPrimary,
                      variantCssByComponentName(theme)[cta.variant],
                    ]}
                  >
                    {cta.subtitle}
                  </Heading>
                }
                Content={
                  <div
                    id={`page-header-cta-${cta.title}-content`}
                    css={ctaContentCss}
                    dangerouslySetInnerHTML={{ __html: cta.content }}
                  />
                }
                Action={
                  <LinkButton
                    rightIcon={<MdArrowForward />}
                    css={
                      buttonCssByComponentName[cta.variant] ||
                      buttonCssByComponentName.primaryButtonCss
                    }
                    to={cta.link}
                    size="XL"
                  >
                    {cta.linkText}
                  </LinkButton>
                }
              />
            ))}
          </div>
        </div>
        <div css={mediaCss}>
          <Image fluid={image?.data?.image.fluid} />
        </div>
      </header>
    </div>
  )
}

export default PageHeader
