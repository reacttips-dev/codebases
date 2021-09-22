/** @jsx jsx */
import { jsx } from "@emotion/core"
import { BaseLink, BaseLinkProps } from "../BaseLink"
import { getButtonStyles, ButtonStyleProps } from "../Button"

export type LinkButtonProps<TState = any> = BaseLinkProps<TState> &
  ButtonStyleProps

export function LinkButton<TState>(props: LinkButtonProps<TState>) {
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
    <BaseLink
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
    />
  )
}
