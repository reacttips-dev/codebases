import React from "react"
import { Button } from "gatsby-interface"
import { visuallyHiddenCss } from "../../../shared/styles"
import {
  BigChevronLeftIcon,
  BigChevronRightIcon,
} from "../../../shared/icons/BigChevronIcon"

const itemCss = ({ theme, position }) => [
  {
    display: `none`,
    position: `absolute`,
    left: theme.space[8],
    top: `50%`,
    transform: `translateY(-50%)`,

    [theme.mediaQueries.desktop]: {
      display: `block`,
    },
  },
  position === `right` && {
    left: `auto`,
    right: theme.space[8],
  },
]

export function TestimonialsControls({
  prevItem,
  nextItem,
  prevIsDisabled,
  nextIsDisabled,
}) {
  return (
    <div>
      <div css={theme => itemCss({ theme })}>
        <Button variant="GHOST" onClick={prevItem} disabled={prevIsDisabled}>
          <BigChevronLeftIcon aria-hidden="true" />
          <span css={visuallyHiddenCss}>Previous item</span>
        </Button>
      </div>
      <div css={theme => itemCss({ theme, position: `right` })}>
        <Button variant="GHOST" onClick={nextItem} disabled={nextIsDisabled}>
          <BigChevronRightIcon aria-hidden="true" />
          <span css={visuallyHiddenCss}>Next item</span>
        </Button>
      </div>
    </div>
  )
}
