import React, { ElementType, forwardRef, Ref } from 'react'
import cx from 'classnames'
import useFocusVisibleWithProps from '../../hooks/useFocusVisibleWithProps'
import { HTMLProps, Omit } from '../../helpers/omitType'

export interface ActionProps
  extends Omit<HTMLProps<HTMLButtonElement | HTMLAnchorElement>, 'size'> {
  /**
   * The HTML element to use.
   */
  as: ElementType
  /**
   * The URL you want to navigate to, if using react-router
   */
  to?: string
}

/**
 * Actions are a utility component for interactable, focusable components that automatically adds accessible focus states and event handlers.
 */
const Action = forwardRef(function Action(
  props: ActionProps,
  ref: Ref<HTMLButtonElement | HTMLAnchorElement>
) {
  const { as, className, children, onClick, tabIndex = 0, ...rest } = props
  const { focusVisible, onFocus, onBlur } = useFocusVisibleWithProps(props)
  const Comp = as

  function handleClick(
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>
  ) {
    const isKeyboardEvent = e.clientX === 0 && e.clientY === 0
    onClick && onClick(e)
    if (!isKeyboardEvent) {
      e.currentTarget.blur()
    }
  }
  return (
    <Comp
      {...rest}
      ref={ref}
      className={cx('hds-action', className, {
        'hds-focus-visible': focusVisible,
      })}
      onFocus={onFocus}
      onBlur={onBlur}
      onClick={handleClick}
      tabIndex={tabIndex}
    >
      {children}
    </Comp>
  )
})

Action.defaultProps = {
  as: 'button',
}

export default Action
