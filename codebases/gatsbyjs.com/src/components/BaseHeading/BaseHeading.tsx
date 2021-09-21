import * as React from "react"
import { PropsOf } from "../../utils/types"

type AllowedAs = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span"

export type BaseHeadingProps = Omit<PropsOf<AllowedAs>, "ref"> & {
  as?: AllowedAs
}

export function BaseHeading(props: BaseHeadingProps) {
  const { children, as: Component = `h1`, ...rest } = props

  return <Component {...rest}>{children}</Component>
}
