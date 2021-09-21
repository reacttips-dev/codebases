import * as React from "react"
import { PropsOf } from "../../utils/types"

type AllowedAs = "p" | "span" | "div"

export type BaseTextProps = Omit<PropsOf<AllowedAs>, "ref"> & {
  as?: AllowedAs
}

export default function BaseText(props: BaseTextProps) {
  const { children, as: Component = `p`, ...rest } = props

  return <Component {...rest}>{children}</Component>
}
