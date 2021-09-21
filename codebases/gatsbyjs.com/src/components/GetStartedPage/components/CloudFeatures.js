import React from "react"
import { cloudFeatures as data } from "./data"

const rootCss = theme => ({
  display: `grid`,
  gridColumnGap: theme.space[10],
  gridRowGap: theme.space[1],
  listStyle: `none`,
  margin: 0,

  [theme.mediaQueries.phablet]: {
    gridTemplateColumns: `auto auto`,
  },
})

const itemCss = theme => ({
  paddingLeft: theme.space[10],
  position: `relative`,
})

const emphesizedCss = theme => ({
  display: `block`,
  fontStyle: `normal`,
  color: theme.colors.blue[80],
})

const iconCss = theme => ({
  alignItems: `center`,
  background: theme.colors.blue[10],
  borderRadius: theme.radii[6],
  display: `flex`,
  height: theme.space[8],
  justifyContent: `center`,
  left: 0,
  top: theme.space[2],
  position: `absolute`,
  width: theme.space[8],
})

const svgCss = theme => ({
  fill: theme.colors.blue[50],
})

export function CloudFeatures() {
  return (
    <ul css={rootCss}>
      {data.map((item, idx) => {
        const { emText, text, Icon } = item

        return (
          <li key={idx} css={itemCss}>
            {Icon && (
              <span css={iconCss}>
                <Icon css={svgCss} />
              </span>
            )}
            <em css={emphesizedCss}>{emText}</em>
            {text}
          </li>
        )
      })}
    </ul>
  )
}
