import React, { forwardRef, Ref } from 'react'
import cx from 'classnames'
import { Omit, HTMLProps } from '../../helpers/omitType'
import Icon from '../../primitives/Icon'
import Action from '../Action'

export interface TagProps extends Omit<HTMLProps<HTMLButtonElement>, 'size'> {
  /**
   * Callback that gets fired when the Tag is clicked.
   */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => any
  /**
   * If the tag is dismissable, this callback gets fired when the Tag is dismissed.
   */
  onDismiss?: () => any
  /**
   * If true, the Tag will add a presentational Close icon. It is assumed the dismissal of the Tag will be handled by the consumer app.
   */
  isDismissable?: boolean
  /**
   * If true, renders a smaller Tag.
   */
  isCompact?: boolean
  /**
   * If true, the Tag will appear disabled and be non-interactive.
   */
  isDisabled?: boolean
  /**
   * If true, the Tag will appear in its selected state.
   */
  isSelected?: boolean
}

/**
 * Tags are actionable, toggleable components, usually repreenting an input, or an action.
 */
const Tag = forwardRef(function Tag(
  props: TagProps,
  ref: Ref<HTMLButtonElement>
) {
  const {
    className,
    children,
    onDismiss,
    onClick,
    isDismissable,
    isCompact,
    isDisabled,
    isSelected,
    onKeyDown,
    ...rest
  } = props
  const classes = cx('hds-tag', className, {
    'hds-tag-disabled': isDisabled,
    'hds-tag-selected': isSelected,
    'hds-tag-compact': isCompact,
    'hds-tag-dismissable': isDismissable,
    'hds-tag-com-dis': isCompact && isDismissable,
  })

  function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    onKeyDown && onKeyDown(e)
    if (isDismissable && e.key === 'Backspace') {
      onDismiss && onDismiss()
    }
  }

  return (
    <Action
      {...rest}
      ref={ref}
      className={classes}
      onClick={onClick}
      as="button"
      role="button"
      disabled={isDisabled}
      onKeyDown={handleKeyDown}
      aria-pressed={isSelected ? 'true' : 'false'}
    >
      {children}
      {isDismissable && (
        <Icon
          name="Close"
          className="hds-tag-dismiss"
          size={isCompact ? '16' : '24'}
          color={isSelected ? 'surface-0' : 'surface-100'}
          aria-label="Dismiss this tag"
        />
      )}
    </Action>
  )
})

export default Tag
