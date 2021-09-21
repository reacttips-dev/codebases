import React from "react"

import { HeaderNavItem } from "./HeaderNavItem"
import { docsTopLineData, topLineData } from "./data"

const rootCss = theme => ({
  justifyContent: `space-between`,
  display: "none",

  // reset ul and li styles for all list nested in dropdown
  ul: {
    margin: 0,
    listStyle: `none`,
  },
  li: {
    margin: 0,
  },

  [theme.mediaQueries.desktop]: {
    display: "flex",
    flexShrink: 0,
    marginLeft: "auto",
  },
})

const listCss = theme => ({
  display: `flex`,
  flexDirection: `column`,

  [theme.mediaQueries.desktop]: {
    flexDirection: `row`,
  },
})

export function HeaderUtilityNav({
  isInverted,
  isDocs,
  mobileNavIsOpen,
  setMobileNavIsOpen,
  location,
  windowWidth,
}) {
  const data = isDocs ? docsTopLineData : topLineData
  return (
    <nav css={rootCss}>
      <ul css={listCss}>
        {data.map((item, idx) => (
          <HeaderNavItem
            data={item}
            key={idx}
            isInverted={isInverted}
            mobileNavIsOpen={mobileNavIsOpen}
            setMobileNavIsOpen={setMobileNavIsOpen}
            location={location}
            windowWidth={windowWidth}
            buttonSize={item.buttonSize}
          />
        ))}
      </ul>
    </nav>
  )
}
