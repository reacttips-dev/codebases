import React from "react"

const withData = Target => ({ data = {}, ...rest }) => {
  const src = data.image?.file?.url
  const alt = data.alternateText || ``
  const content = data.image?.svg?.content

  const result = { src, content, alt }

  return <Target {...result} {...rest} />
}

export default withData
