import React from "react"
import PropTypes from "prop-types"
import { Button } from "../../components/core/button"
import { getLink } from "../../utils/navigation"

const FeaturesCTA = ({ linkText, associatedPage, associatedLandingPage }) => {
  if (!associatedPage && !associatedLandingPage) {
    return null
  }

  return (
    <p
      css={theme => ({
        marginTop: theme.space[10],
        paddingBottom: theme.space[7],
        position: `relative`,
        textAlign: `center`,
        zIndex: 1,
      })}
    >
      <Button
        to={
          associatedLandingPage
            ? associatedLandingPage.slug
            : getLink(associatedPage)
        }
        buttonStyle="primary"
        ariaLabel={`Find out about: ${
          associatedLandingPage
            ? associatedLandingPage.name
            : associatedPage.name
        }`}
      >
        {linkText}
      </Button>
    </p>
  )
}

FeaturesCTA.propTypes = {
  associatedPage: PropTypes.object,
  associatedLandingPage: PropTypes.object,
  linkText: PropTypes.string,
}

export default FeaturesCTA
