import React from "react"

import { HeaderNavItem } from "./HeaderNavItem"

const rootCss = theme => ({
  [theme.mediaQueries.desktop]: {
    paddingBottom: theme.space[2],

    "&:last-of-type": {
      // we secure place for the SearchWidget icon
      paddingRight: theme.space[10],
    },
  },
})

const listCss = theme => ({
  display: `flex`,
  flexDirection: `column`,

  [theme.mediaQueries.desktop]: {
    flexDirection: `row`,
    alignItems: `center`,
  },
})

export function HeaderNavSection({
  data = [],
  isInverted,
  mobileNavIsOpen,
  setMobileNavIsOpen,
  location,
  activeIndex,
  windowWidth,
}) {
  if (!data.length) {
    return null
  }

  return (
    <li css={rootCss}>
      <ul css={listCss}>
        {data.map((item, idx) => (
          <HeaderNavItem
            data={item}
            key={idx}
            isInverted={isInverted}
            mobileNavIsOpen={mobileNavIsOpen}
            setMobileNavIsOpen={setMobileNavIsOpen}
            location={location}
            active={idx === activeIndex}
            windowWidth={windowWidth}
          />
        ))}
      </ul>
    </li>
  )
}
