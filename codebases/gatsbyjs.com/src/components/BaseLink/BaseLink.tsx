import * as React from "react"
import { Link, GatsbyLinkProps } from "gatsby"

export type BaseLinkProps<TState> = Omit<GatsbyLinkProps<TState>, "ref">

export function BaseLink({ to, role, children, ...rest }: BaseLinkProps<any>) {
  return (
    <Link to={to} role={role} {...rest}>
      {children}
    </Link>
  )
}
