import React from "react"
import { Link as ILink } from "gatsby-interface"
import { footerLinkCss } from "../shared/styles"

const rootCss = ({ theme, isInverted }) => [
  {
    alignItems: `center`,
    display: `flex`,
    color: theme.colors.grey[50],
    flexDirection: `column`,
    fontSize: theme.fontSizes[1],
    marginBottom: theme.space[10],
    marginTop: theme.space[7],
    order: 3,

    [theme.mediaQueries.tablet]: {
      borderTop: `1px solid ${theme.colors.grey[20]}`,
      justifyContent: `space-between`,
      flexDirection: `row`,
      paddingTop: theme.space[10],
    },
  },
  isInverted && {
    [theme.mediaQueries.tablet]: {
      borderColor: theme.colors.whiteFade[20],
    },
  },
]

const groupCss = theme => ({
  display: `inline-flex`,
  marginBottom: theme.space[3],

  "& > a:not(:last-of-type)": {
    marginRight: theme.space[7],
  },

  [theme.mediaQueries.tablet]: {
    marginBottom: 0,
  },
})

const copyrightCss = ({ theme, isInverted }) => [
  {
    fontSize: theme.fontSizes[0],
    marginTop: theme.space[4],
    order: 2,

    [theme.mediaQueries.tablet]: {
      marginTop: 0,
      order: 0,
    },
  },
  isInverted && {
    color: theme.colors.whiteFade[60],
  },
]

const Link = ({ isInverted, ...rest }) => (
  <ILink
    variant="SIMPLE"
    css={theme => footerLinkCss({ theme, isInverted })}
    {...rest}
  />
)

export function FooterStatements({ isInverted }) {
  return (
    <footer css={theme => rootCss({ theme, isInverted })}>
      <div css={theme => copyrightCss({ theme, isInverted })}>
        © {new Date().getFullYear()} Gatsby, Inc.
      </div>
      <div css={groupCss}>
        <Link to="/accessibility-statement" isInverted={isInverted}>
          Accessibility Statement
        </Link>
        <Link to="/guidelines/logo" isInverted={isInverted}>
          Brand Guidelines
        </Link>
      </div>
      <div css={groupCss}>
        <Link to="/terms-of-use" isInverted={isInverted}>
          Terms of Use
        </Link>
        <Link to="/privacy-policy" isInverted={isInverted}>
          Privacy Policy
        </Link>
      </div>
    </footer>
  )
}
