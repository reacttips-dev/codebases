import React from "react"
import { Link } from "gatsby-interface"

import { getLinkTargetProp } from "../shared/helpers"
import { headerNavSimpleLinkCss } from "../shared/styles"

const listCss = ({ _theme, layout }) => ({
  display: `flex`,
  flexDirection: layout === `row` ? `row` : `column`,
})

const listItemCss = ({ theme, layout }) => [
  {
    margin: 0,
  },
  layout === `row` && {
    "&&": {
      marginRight: theme.space[6],
    },
  },
]

const headingCss = theme => ({
  fontFamily: theme.fonts.body,
  fontSize: theme.fontSizes[0],
  color: theme.colors.blackFade[90],
  textTransform: `uppercase`,
  fontWeight: theme.fontWeights.semiBold,
  letterSpacing: theme.letterSpacings.tracked,
  margin: 0,
  marginBottom: theme.space[3],
})

const iconCss = theme => ({
  verticalAlign: `baseline`,
  transform: `translateY(.1em)`,
  marginRight: theme.space[2],
})

export function HeaderNavDropdownItemDetailsPresenter({
  data = {},
  layout = `column`,
}) {
  const items = data.items
  const heading = data.heading?.text

  return (
    <React.Fragment>
      {heading && <h3 css={headingCss}>{heading}</h3>}
      <ul css={theme => listCss({ theme, layout })}>
        {items.map((item, idx) => {
          const { text, url, Icon } = item

          return (
            <li
              css={theme => listItemCss({ theme, layout })}
              key={`detailsItem${idx}`}
            >
              <Link
                variant="SIMPLE"
                {...getLinkTargetProp(url)}
                css={theme => headerNavSimpleLinkCss({ theme })}
              >
                {Icon && <Icon css={iconCss} />} {text}
              </Link>
            </li>
          )
        })}
      </ul>
    </React.Fragment>
  )
}
