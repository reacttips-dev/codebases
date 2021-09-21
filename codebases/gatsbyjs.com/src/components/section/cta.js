import React from "react"
import PropTypes from "prop-types"

import Title from "../hero/title"
import FeaturesCTA from "../features/cta"
import { rhythm } from "../../utils/typography"
import { bodyCopy } from "../../utils/styles"

const FullWidthCentered = ({
  title,
  text,
  associatedPage,
  associatedLandingPage,
  linkText,
}) => (
  <div
    css={{
      textAlign: `center`,
      padding: `80px 0`,
    }}
  >
    {title && (
      <Title
        css={theme => ({
          color: theme.colors.gatsby,
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth: rhythm(20),
        })}
      >
        {title}
      </Title>
    )}
    {text && (
      <div
        css={theme => ({
          ...bodyCopy(theme),
          maxWidth: rhythm(24),
          marginLeft: `auto`,
          marginRight: `auto`,
        })}
        dangerouslySetInnerHTML={{
          __html: text.childMarkdownRemark.html,
        }}
      />
    )}
    <FeaturesCTA
      associatedPage={associatedPage}
      associatedLandingPage={associatedLandingPage}
      linkText={linkText}
    />
  </div>
)

FullWidthCentered.propTypes = {
  body: PropTypes.object,
  title: PropTypes.string,
  associatedPage: PropTypes.object,
  associatedLandingPage: PropTypes.object,
  linkText: PropTypes.string,
  text: PropTypes.object,
}

export default FullWidthCentered
