import React from "react"
import { GatsbyLogo } from "../shared/logos/GatsbyLogo"
import { FooterSocialLinks } from "./FooterSocialLinks"
import { FooterNewsletter } from "./FooterNewsletter"

const rootCss = theme => ({
  display: `flex`,
  flexDirection: `column`,
  justifyContent: `flex-end`,
  marginBottom: theme.space[6],
  marginTop: theme.space[10],
  alignItems: `center`,
  order: 2,

  [theme.mediaQueries.tablet]: {
    flexDirection: `row`,
    justifyContent: `flex-end`,
    alignItems: `flex-end`,
    marginTop: 0,
    marginBottom: theme.space[12],
    order: 1,
  },
})

const aboutCss = theme => ({
  alignItems: `center`,
  display: `flex`,
  flexDirection: `column`,

  [theme.mediaQueries.tablet]: {
    marginRight: `auto`,
    alignItems: `flex-start`,
  },
})

const descriptionCss = ({ theme, isInverted }) => [
  {
    fontSize: theme.fontSizes[0],
    color: theme.colors.grey[50],
    margin: 0,
    marginTop: theme.space[6],
    textAlign: `center`,

    [theme.mediaQueries.tablet]: {
      textAlign: `left`,
    },
  },
  isInverted && {
    color: theme.colors.whiteFade[60],
  },
]

const logoCss = theme => ({
  height: theme.space[7],
  width: `auto`,
})

export function FooterCommunity({ isInverted }) {
  return (
    <aside css={rootCss} aria-label="Gatsby Community">
      <div css={aboutCss}>
        <GatsbyLogo css={logoCss} isInverted={isInverted} />
        <p css={theme => descriptionCss({ theme, isInverted })}>
          Gatsby is powered by the amazing Gatsby
          <br /> community and Gatsby, the company.
        </p>
      </div>
      <FooterSocialLinks isInverted={isInverted} />
      <FooterNewsletter isInverted={isInverted} />
    </aside>
  )
}
