/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Link as GatsbyLink, GatsbyLinkProps } from "gatsby"
import { BaseAnchorProps, BaseAnchor } from "../BaseAnchor"
import { ThemeCss, Theme } from "../../theme"

const baseCss: ThemeCss = theme => ({
  alignItems: `center`,
  color: theme.colors.purple[60],
  display: `inline-flex`,
})

const variantsCss: Record<LinkVariant, ThemeCss> = {
  DEFAULT: theme => ({
    textDecoration: `underline`,
    ":focus, :hover": {
      color: theme.colors.purple[60],
      textDecoration: `underline`,
    },
  }),
  SIMPLE: theme => ({
    textDecoration: `none`,
    ":focus, :hover": {
      color: theme.colors.purple[40],
      textDecoration: `underline`,
    },
  }),
}

export type LinkVariant = `DEFAULT` | `SIMPLE`

type GatsbyLinkNoRefProps = Omit<GatsbyLinkProps<any>, "ref">

export type LinkProps = (
  | GatsbyLinkNoRefProps
  | Omit<BaseAnchorProps, "ref">
) & {
  variant?: LinkVariant
}

export function Link({ variant = `DEFAULT`, ...rest }: LinkProps) {
  const commonProps = {
    css: (theme: Theme) => [baseCss(theme), variantsCss[variant](theme)],
  }

  if (isGatsbyLink(rest)) {
    // GatsbyLink does not support target attribute
    return <GatsbyLink {...commonProps} {...rest} target={undefined} />
  }

  return <BaseAnchor {...commonProps} {...rest} />
}

/**
 * An awesome tidbit from React TypeScript Cheatsheet
 * https://github.com/typescript-cheatsheets/react-typescript-cheatsheet/blob/master/ADVANCED.md#typing-a-component-that-accepts-different-props
 */
function isGatsbyLink(props: LinkProps): props is GatsbyLinkNoRefProps {
  return "to" in props
}
