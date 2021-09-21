import React from "react"
import { CopyUrl } from "../../shared/components"

const rootCss = theme => ({
  margin: `${theme.space[5]} 0`,
  width: `18rem`,

  button: {
    background: theme.colors.orange[20],
  },

  input: {
    background: theme.colors.orange[5],
  },
})

export function NpmCommand({ onClick }) {
  return (
    <div css={rootCss}>
      <CopyUrl url="npm init gatsby" onClick={onClick} />
    </div>
  )
}
