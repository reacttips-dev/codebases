import React from "react"
import { Button } from "gatsby-interface"
import { visuallyHiddenCss } from "../../../shared/styles"

const rootCss = _theme => ({
  display: `flex`,
  justifyContent: `center`,
  listStyle: `none`,
  margin: 0,
})

const itemCss = _theme => ({
  margin: 0,
})

const btnCss = theme => ({
  padding: theme.space[4],

  [theme.mediaQueries.desktop]: {
    padding: theme.space[4],
  },
})

const indicatorCss = ({ theme, isActive }) => [
  {
    width: theme.space[7],
    height: theme.space[7],
    border: `3px solid ${theme.colors.white}`,
    borderRadius: theme.radii[6],
    position: `relative`,

    "&:before": {
      background: theme.colors.grey[30],
      borderRadius: theme.radii[6],
      content: `""`,
      height: theme.space[4],
      left: `50%`,
      position: `absolute`,
      top: `50%`,
      transform: `translate(-50%, -50%)`,
      width: theme.space[4],
    },
  },
  isActive && {
    borderColor: theme.colors.purple[30],

    "&:before": {
      background: theme.colors.purple[50],
    },
  },
]

export function TestimonialsNav({ items, activeItem, onClickItem }) {
  return (
    <ul css={rootCss}>
      {items.map((item, idx) => {
        return (
          <li key={idx} css={itemCss}>
            <Button
              size="L"
              variant="GHOST"
              css={btnCss}
              onClick={() => onClickItem(idx)}
            >
              <span css={visuallyHiddenCss}>Testimonial {idx + 1}</span>
              <span
                aria-hidden="true"
                css={theme =>
                  indicatorCss({ theme, isActive: idx === activeItem })
                }
              ></span>
            </Button>
          </li>
        )
      })}
    </ul>
  )
}
