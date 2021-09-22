import React from "react"
import PropTypes from "prop-types"
import Image from "gatsby-image"

// Img.js (a gatsby-image wrapper)
// @see https://github.com/gatsbyjs/gatsby/issues/4021#issuecomment-388376004

const Img = ({ objFit = `cover`, objPosition = `50% 50%`, ...props }) => (
  <Image
    {...props}
    imgStyle={{
      objectFit: objFit,
      objectPosition: objPosition,
      fontFamily: `"object-fit: ${objFit}; object-position: ${objPosition}"`,
    }}
  />
)

Img.propTypes = {
  objFit: PropTypes.string,
  objPosition: PropTypes.string,
}

export default Img
