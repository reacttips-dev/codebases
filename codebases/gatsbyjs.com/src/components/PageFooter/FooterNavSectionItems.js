import React from "react"
import { Link } from "gatsby-interface"

import { footerLinkCss } from "../shared/styles"
import { getLinkTargetProp } from "../shared/helpers"

const listCss = ({ theme, isExpanded }) => ({
  display: isExpanded ? `grid` : `none`,
  listStyle: `none`,
  margin: 0,
  padding: 0,
  paddingTop: theme.space[2],
  paddingBottom: theme.space[7],

  [theme.mediaQueries.tablet]: {
    display: `grid`,
    paddingTop: theme.space[6],
  },
})

const itemCss = ({ theme, shifted }) => [
  {
    fontSize: theme.fontSizes[1],
    lineHeight: theme.lineHeights.dense,

    "&:not(:last-of-type)": {
      marginBottom: theme.space[2],
    },
  },
  shifted && {
    marginTop: theme.space[6],
  },
]

const itemIconCss = theme => ({
  fill: theme.colors.grey[50],
  fontSize: `0.9em`,
  marginRight: theme.space[3],
})

export function FooterNavSectionItems({ data, isExpanded, isInverted }) {
  return (
    data && (
      <ul css={theme => listCss({ theme, isExpanded })}>
        {data.map(item => {
          const { text, url, Icon, shifted } = item

          return (
            <li css={theme => itemCss({ theme, shifted })} key={text}>
              <Link
                css={theme => footerLinkCss({ theme, isInverted })}
                variant="SIMPLE"
                {...getLinkTargetProp(url)}
              >
                {Icon && <Icon css={itemIconCss} />} {text}
              </Link>
            </li>
          )
        })}
      </ul>
    )
  )
}
