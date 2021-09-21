import React from "react"
import withData from "./Markdown.withData"

function Markdown({ html, isInverted, ...rest }) {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
      css={theme => ({
        color: isInverted ? theme.colors.white : undefined,
        margin: 0,
        whiteSpace: `pre-wrap`,

        a: {
          color: isInverted ? theme.colors.purple[30] : undefined,
        },

        "p:last-of-type": {
          marginBottom: 0,
        },
      })}
      {...rest}
    />
  )
}

export default withData(Markdown)
