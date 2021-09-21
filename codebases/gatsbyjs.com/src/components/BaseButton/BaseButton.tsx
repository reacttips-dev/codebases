import * as React from "react"
import { PropsOf } from "../../utils/types"

export type BaseButtonProps = Omit<JSX.IntrinsicElements["button"], "ref"> & {
  loading?: boolean
  loadingLabel?: React.ReactNode
  LoadingIcon?: React.ComponentType<any> // TODO replace any with something more strict
  ButtonComponent?: React.ComponentType<PropsOf<"button">>
}

export const BaseButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>(
  (props, ref) => {
    const {
      children,
      disabled = false,
      loading = false,
      loadingLabel = `Loading`,
      LoadingIcon,
      type = `button`,
      ButtonComponent = `button`,
      ...rest
    } = props

    return (
      <ButtonComponent
        disabled={loading ? true : disabled}
        type={type}
        {...rest}
        ref={ref}
      >
        {loading ? (
          <React.Fragment>
            {loadingLabel && <span>{loadingLabel}</span>}
            {` `}
            {LoadingIcon && <LoadingIcon />}
          </React.Fragment>
        ) : (
          children
        )}
      </ButtonComponent>
    )
  }
)
