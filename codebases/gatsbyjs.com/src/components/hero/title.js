import React from "react"
import PropTypes from "prop-types"

import { titleStyles } from "../../utils/styles"

const Title = ({ children, isInverted, ...rest }) => {
  return (
    <h1
      css={theme => [
        titleStyles(theme),
        isInverted && { color: theme.colors.white },
      ]}
      dangerouslySetInnerHTML={{
        __html: children,
      }}
      {...rest}
    />
  )
}

Title.propTypes = {
  isInverted: PropTypes.bool,
}

export default Title
