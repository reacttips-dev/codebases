import React from "react"
import { CopyButton } from "gatsby-interface"

const baseCss = theme => ({
  display: "flex",
  background: theme.colors.grey[5],
  border: `1px solid ${theme.colors.grey[20]}`,
  borderRadius: theme.radii[2],
  width: "100%",
})

const urlCss = theme => ({
  textAlign: "center",
  background: theme.colors.grey[5],
  border: `1px solid ${theme.colors.grey[20]}`,
  borderRight: "0",
  borderRadius: theme.radii[2],
  fontFamily: theme.fonts.monospace,
  fontSize: theme.fontSizes[1],
  display: "block",
  overflowX: "scroll",
  paddingBottom: 0,
  paddingTop: 0,
  paddingLeft: theme.space[3],
  paddingRight: theme.space[3],
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  width: "100%",
  WebkitAppearance: "none",
  MozAppearance: "none",
})

export default function CopyUrl({
  url,
  urlDisplay = url,
  "data-cy-name": cyName,
  "aria-describedby": describedBy,
  onClick,
}) {
  return (
    <div css={baseCss}>
      <input
        type="text"
        readOnly
        value={urlDisplay}
        data-cy={cyName}
        css={urlCss}
        aria-label="Webhook endpoint"
        aria-describedby={describedBy}
      />
      <CopyButton
        content={url}
        data-cy={cyName ? `${cyName}-button` : undefined}
        aria-label="Copy webhook endpoint"
        onClick={onClick}
      />
    </div>
  )
}
