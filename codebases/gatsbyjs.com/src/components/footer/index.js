import React from "react"
import PropTypes from "prop-types"

import { PageFooter } from "../PageFooter"

const Footer = ({ isInverted }) => {
  return <PageFooter isInverted={isInverted} />
}

Footer.propTypes = {
  isInverted: PropTypes.bool,
}

export default Footer
