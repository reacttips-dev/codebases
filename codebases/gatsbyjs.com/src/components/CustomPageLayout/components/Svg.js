import React from "react"
import withData from "./Svg.withData"

const rootCss = _theme => ({
  margin: 0,
})

function Svg({
  content,
  asImg = false,
  src,
  alt,
  width,
  height,
  componentName: _,
  ...rest
}) {
  if ((!src && asImg) || !content) {
    return null
  }

  if (asImg && (!width || !height)) {
    const matches = content.match(/viewBox="0 0 (\d+) (\d+)"/)
    if (matches) {
      width = width || parseInt(matches[1])
      height = height || parseInt(matches[2])
    }
  }

  return asImg ? (
    <img
      src={src}
      alt={alt}
      css={rootCss}
      loading="lazy"
      width={width}
      height={height}
      {...rest}
    />
  ) : (
    <span dangerouslySetInnerHTML={{ __html: content }} {...rest} />
  )
}

export default withData(Svg)
