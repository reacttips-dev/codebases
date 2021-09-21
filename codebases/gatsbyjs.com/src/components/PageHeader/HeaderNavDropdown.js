import React from "react"

import { HeaderNavDropdownItem } from "./HeaderNavDropdownItem"

const VIEWPORT_EDGE_MIN_MARGIN = 50

const rootCss = ({
  theme,
  isExpanded,
  isMeasuring,
  rootOffset,
  dropdownWidth,
}) => [
  {
    [theme.mediaQueries.desktop]: {
      display: `none`,
      left: `50%`,
      paddingTop: theme.space[4],
      position: `absolute`,
      top: `100%`,
      visibility: `visible`,
      zIndex: theme.zIndices.dropdowns,
      transform: `translateX(calc(-50% + ${rootOffset}px))`,
      width: dropdownWidth || `32.5rem`,

      // dropdown arrow
      ":after": {
        position: `absolute`,
        top: theme.space[2],
        left: `50%`,
        width: theme.space[5],
        height: theme.space[5],
        content: `" "`,
        transform: `translateX(calc(-50% - ${rootOffset}px)) rotate(45deg)`,
        borderTopLeftRadius: theme.radii[2],
        background: theme.colors.white,
        willChange: `transform`,
        transitionProperty: `transform`,
      },
    },
  },
  isExpanded && {
    [theme.mediaQueries.desktop]: {
      display: `grid`,
    },
  },
  isMeasuring && {
    [theme.mediaQueries.desktop]: {
      visibility: `hidden`,
      display: `grid`,
      transform: `translateX(-50%)`,
    },
  },
]

const listCss = theme => [
  {
    [theme.mediaQueries.desktop]: {
      background: theme.colors.white,
      borderRadius: theme.radii[3],
      boxShadow: theme.shadows.dialog,
    },
  },
]

export function HeaderNavDropdown({
  items,
  bgColor,
  isExpanded,
  setIsExpanded,
  blurHandler,
  id,
  mobileNavIsOpen,
  setMobileNavIsOpen,
  windowWidth,
  dropdownWidth,
}) {
  const rootRef = React.useRef(null)
  const [isMeasuring, setIsMeasuring] = React.useState(false)
  const [rootOffset, setRootOffset] = React.useState(0)

  React.useEffect(() => {
    if (windowWidth) {
      setIsMeasuring(true)
    }
  }, [windowWidth])

  React.useLayoutEffect(() => {
    if (rootRef.current && windowWidth && isMeasuring) {
      requestAnimationFrame(() => {
        const { left, right } = rootRef.current.getBoundingClientRect()
        const leftFit = left >= VIEWPORT_EDGE_MIN_MARGIN
        const rightFit = right <= windowWidth - VIEWPORT_EDGE_MIN_MARGIN
        const offset = !leftFit
          ? (left - VIEWPORT_EDGE_MIN_MARGIN) * -1
          : !rightFit
          ? windowWidth - (right + VIEWPORT_EDGE_MIN_MARGIN)
          : 0

        setRootOffset(offset)
        setIsMeasuring(false)
      })
    }
  }, [isMeasuring])

  let firstColoredFound = false

  return (
    <div
      id={id}
      ref={rootRef}
      css={theme => [
        rootCss({ theme, isExpanded, isMeasuring, rootOffset, dropdownWidth }),
      ]}
    >
      <ul css={listCss}>
        {items.map((item, idx) => {
          const isFirst = idx === 0
          const isLast = idx === items.length - 1
          const isFirstColored = item.colored && firstColoredFound === false

          firstColoredFound = item.colored ? true : firstColoredFound

          return (
            <HeaderNavDropdownItem
              data={item}
              key={idx}
              blurHandler={blurHandler}
              isExpanded={isExpanded}
              setIsExpanded={setIsExpanded}
              isFirst={isFirst}
              isLast={isLast}
              isFirstColored={isFirstColored}
              bgColor={bgColor}
              mobileNavIsOpen={mobileNavIsOpen}
              setMobileNavIsOpen={setMobileNavIsOpen}
            />
          )
        })}
      </ul>
    </div>
  )
}
