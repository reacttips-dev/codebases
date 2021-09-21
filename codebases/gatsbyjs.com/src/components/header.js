import React from "react"
import PropTypes from "prop-types"

import { PageHeader } from "./PageHeader"

const Header = ({
  isInverted,
  isAbsolute,
  isFullWidth = false,
  isFixed,
  docType,
  location,
}) => {
  return (
    <PageHeader
      isAbsolute={isAbsolute}
      isInverted={isInverted}
      isFullWidth={isFullWidth}
      isFixed={isFixed}
      docType={docType}
      location={location}
    />
  )
}

Header.propTypes = {
  isInverted: PropTypes.bool,
  isAbsolute: PropTypes.bool,
  isFullWitdh: PropTypes.bool,
  isFixed: PropTypes.bool,
  docType: PropTypes.string,
  location: PropTypes.string,
}

Header.defaultProps = {
  isMobileNavOpen: false,
}

export default Header
