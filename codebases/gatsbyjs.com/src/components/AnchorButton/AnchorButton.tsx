/** @jsx jsx */
import { jsx } from "@emotion/core"
import * as React from "react"
import { BaseAnchor, BaseAnchorProps } from "../BaseAnchor"
import { ButtonStyleProps, getButtonStyles } from "../Button/Button"

export type AnchorButtonProps = BaseAnchorProps & ButtonStyleProps

export const AnchorButton = React.forwardRef<
  HTMLAnchorElement,
  AnchorButtonProps
>((props, ref) => {
  const {
    children,
    size,
    tone,
    variant,
    leftIcon,
    rightIcon,
    textVariant,
    width,
    ...rest
  } = props

  return (
    <BaseAnchor
      {...getButtonStyles({
        children,
        size,
        tone,
        variant,
        leftIcon,
        rightIcon,
        textVariant,
        width,
      })}
      {...rest}
      ref={ref}
    />
  )
})
