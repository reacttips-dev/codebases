import React from "react"
import { Heading as GIHeading } from "gatsby-interface"
import withData from "./Heading.withData"
import { visuallyHiddenCss } from "../../shared/styles/a11y"

function Heading({
  htmlText,
  tag,
  visuallyHidden,
  isInverted,
  componentName: _,
  ...rest
}) {
  return (
    <GIHeading
      dangerouslySetInnerHTML={{ __html: htmlText }}
      as={tag}
      css={theme => [
        {
          position: `relative`,
        },
        visuallyHidden && visuallyHiddenCss,
        isInverted && {
          color: theme.colors.white,
        },
      ]}
      {...rest}
    />
  )
}

export default withData(Heading)
