import React from "react"
import Img from "gatsby-image"
import withData from "./Picture.withData"

const rootCss = _theme => ({
  img: {
    margin: 0,
  },
})

function Picture({ fluid, alt, ...rest }) {
  if (!fluid) {
    return null
  }

  return <Img fluid={fluid} alt={alt} css={rootCss} {...rest} />
}

export default withData(Picture)
