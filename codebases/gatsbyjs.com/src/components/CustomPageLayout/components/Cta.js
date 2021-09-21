import React from "react"
import { LinkButton, AnchorButton } from "gatsby-interface"
import withData from "./Cta.withData"
import { MdArrowForward, MdArrowDownward } from "react-icons/md"
import { ctaBtnCss } from "../../shared/styles"

const Icons = {
  forward: MdArrowForward,
  downward: MdArrowDownward,
}

// todo: create inverted variants of gatsby-interface buttons
const invertedCss = theme => ({
  color: theme.colors.purple[60],
  background: theme.colors.white,
  borderColor: theme.colors.purple[20],

  ":hover": {
    color: theme.colors.purple[70],
    background: theme.colors.white,
    borderColor: theme.colors.purple[60],
  },
})

function Cta({
  anchorText,
  href,
  to,
  size = `XL`,
  variant = `PRIMARY`,
  target,
  isInverted,
  icon = `forward`,
  ...rest
}) {
  const Component = href ? AnchorButton : LinkButton
  const linkingProps = href ? { href } : { to }
  const Icon = Icons[icon]

  return (
    <Component
      {...linkingProps}
      size={size}
      variant={variant}
      rightIcon={<Icon />}
      target={target}
      css={theme => [
        ctaBtnCss({ theme }),
        {
          position: `relative`,
        },
        isInverted && invertedCss(theme),
      ]}
      {...rest}
    >
      {anchorText}
    </Component>
  )
}

export default withData(Cta)
