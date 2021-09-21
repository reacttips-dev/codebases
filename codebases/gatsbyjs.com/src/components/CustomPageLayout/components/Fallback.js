import React from "react"
import { MdError } from "react-icons/md"
import { contentPositionerCss } from "../../shared/styles"

const rootCss = theme => [
  contentPositionerCss({ theme }),
  {
    background: theme.colors.white,
    border: `2px dashed ${theme.colors.red[80]}`,
    color: theme.colors.red[80],
    padding: theme.space[6],
    textAlign: `center`,
    fontSize: theme.fontSizes[3],

    svg: {
      verticalAlign: `text-bottom`,
      marginRight: theme.space[2],
      height: `1.2em`,
      width: `auto`,
    },
  },
]

export function Fallback({ componentName }) {
  return (
    <div css={rootCss}>
      <MdError />
      <span>
        {`There is no a corresponding component to value: "${componentName}"`}
      </span>
    </div>
  )
}
