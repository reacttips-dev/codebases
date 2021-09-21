import React from "react"

import { FooterNav } from "./FooterNav"
import { FooterStatements } from "./FooterStatements"
import { FooterCommunity } from "./FooterCommunity"
import { contentPositionerCss } from "../shared/styles"

const rootCss = theme => [
  contentPositionerCss({ theme }),
  {
    display: `flex`,
    flexDirection: `column`,
    position: `relative`,
    marginTop: theme.space[15],
  },
]

export function PageFooter({ isInverted }) {
  return (
    <div css={rootCss}>
      <FooterCommunity isInverted={isInverted} />
      <FooterNav isInverted={isInverted} />
      <FooterStatements isInverted={isInverted} />
    </div>
  )
}
