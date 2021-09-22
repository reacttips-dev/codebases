import React from "react"
import { navData } from "./data"
import { FooterNavSection } from "./FooterNavSection"

const rootCss = theme => ({
  order: 1,

  [theme.mediaQueries.tablet]: {
    order: 2,
  },
})

const listCss = theme => ({
  borderTop: `1px  solid ${theme.colors.grey[20]}`,
  display: `grid`,
  gridColumnGap: theme.space[9],
  listStyle: `none`,
  margin: 0,
  padding: 0,

  [theme.mediaQueries.tablet]: {
    borderTop: 0,
    gridTemplateColumns: `repeat(auto-fill, minmax(10rem, 1fr))`,
  },
})

export function FooterNav({ isInverted }) {
  return (
    <nav css={rootCss} aria-label="Site">
      <ul css={listCss}>
        {navData.map((section, idx) => {
          const heading = section.heading?.text
          const items = section.items

          return (
            <FooterNavSection
              key={idx}
              heading={heading}
              items={items}
              isInverted={isInverted}
            />
          )
        })}
      </ul>
    </nav>
  )
}
