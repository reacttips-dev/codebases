import React from "react"
import { MdExpandMore } from "react-icons/md"

const rootCss = ({ theme, isInverted }) => [
  {
    color: theme.colors.grey[90],
    fontSize: theme.fontSizes[0],
    fontFamily: theme.fonts.body,
    margin: 0,
    textTransform: `uppercase`,

    [theme.mediaQueries.tablet]: {
      borderBottom: 0,
    },
  },
  isInverted && {
    color: theme.colors.purple[30],
  },
]

const buttonCss = theme => ({
  all: `inherit`,
  alignItems: `center`,
  background: `none`,
  border: `none`,
  display: `flex`,
  justifyContent: `space-between`,
  padding: `${theme.space[4]} 0`,
  fontSize: `inherit`,
  textTransform: `inherit`,
  width: `100%`,
})

const toggleSignCss = ({ isExpanded, theme }) => ({
  alignItems: `center`,
  display: `flex`,
  justifyContent: `center`,
  height: `24px`,
  width: `24px`,
  borderRadius: theme.radii[1],

  svg: {
    fontSize: theme.fontSizes[5],
    fill: theme.colors.grey[40],
    transition: `transform 0.5s`,
    transform: `rotate(${isExpanded ? `180deg` : `0`})`,
  },

  "button:focus > &": {
    border: `1px solid ${theme.colors.purple[30]}`,

    svg: {
      fill: theme.colors.purple[60],
    },
  },
})

export function FooterNavSectionHeading({
  heading,
  isExpanded,
  setIsExpanded,
  isMobile,
  isInverted,
}) {
  return (
    <h2 css={theme => rootCss({ theme, isInverted })}>
      {isMobile ? (
        <button
          css={buttonCss}
          aria-expanded={isExpanded}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {heading}
          <span
            css={theme => toggleSignCss({ isExpanded, theme })}
            aria-hidden="true"
          >
            <MdExpandMore />
          </span>
        </button>
      ) : (
        <>{heading}</>
      )}
    </h2>
  )
}
