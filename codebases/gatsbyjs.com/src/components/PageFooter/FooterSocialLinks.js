import React from "react"
import { Link } from "gatsby-interface"

import { socialNetworks } from "./data"

const rootCss = theme => ({
  marginTop: theme.space[6],

  [theme.mediaQueries.tablet]: {
    marginTop: 0,
  },
})

const listCss = theme => ({
  display: `flex`,
  listStyle: `none`,
  margin: 0,
  transform: `translateY(${theme.space[2]})`,

  [theme.mediaQueries.tablet]: {
    marginRight: theme.space[8],
  },
})

const listItemCss = theme => ({
  margin: 0,

  "&:not(:last-of-type)": {
    marginRight: theme.space[2],
  },
})

const linkCss = ({ theme, isInverted }) => [
  {
    alignItems: `center`,
    borderRadius: theme.radii[6],
    display: `flex`,
    justifyContent: `center`,
    height: theme.space[9],
    width: theme.space[9],
    transition: `background ${theme.transitions.speed.slow} ${theme.transitions.curve.default}`,

    svg: {
      fill: theme.colors.grey[40],
      transition: `fill ${theme.transitions.speed.slow} ${theme.transitions.curve.default}`,
    },

    "&:hover": {
      background: theme.colors.purple[10],

      svg: {
        fill: theme.colors.grey[60],
      },
    },
  },
  isInverted && {
    "&:hover": {
      background: theme.colors.purple[70],

      svg: {
        fill: theme.colors.white,
      },
    },
  },
]

export function FooterSocialLinks({ isInverted }) {
  return (
    <div css={rootCss}>
      <ul css={listCss}>
        {socialNetworks.map(item => {
          const { name, icon: Icon, url } = item

          return (
            <li css={listItemCss} key={name}>
              <Link css={theme => linkCss({ theme, isInverted })} href={url}>
                <Icon title={`Gatsby ${name}`} />
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
