import React, { forwardRef, Ref } from 'react'
import cx from 'classnames'
import useFocusVisibleWithProps from '../../hooks/useFocusVisibleWithProps'
import { HTMLProps } from '../../helpers/omitType'
import Text from '../../primitives/Text'
import Icon from '../../primitives/Icon'

export interface CheckboxProps extends HTMLProps<HTMLInputElement> {
  /**
   * Represents a caption for the form element.
   */
  label: string
  /**
   * Used to link the input element to the label.
   */
  id: string
  /**
   * Determines whether the Checkbox is checked or not.
   */
  checked?: boolean
  /**
   * Callback for when the Checkbox state changes.
   */
  onChange: (evt?: React.FormEvent<HTMLInputElement>) => any
  /**
   * If true, the Checkbox will be non-interactive.
   */
  disabled?: boolean
  /**
   * Text to label the checkbox for assisitve tech users.
   */
  'aria-label'?: string
  /**
   * If true, will make the label only visible to screen readers.
   */
  withHiddenLabel?: boolean
  /**
   * If true, will wrap the Checkbox and label within a border to resemble a button.
   */
  hasBorder?: boolean
}

/**
 * Checkboxes allow users to select one or many options from a range.
 */
const Checkbox = forwardRef(function Checkbox(
  props: CheckboxProps,
  ref: Ref<HTMLInputElement>
) {
  const {
    id,
    label,
    checked,
    value,
    className,
    disabled,
    withHiddenLabel,
    hasBorder,
    ...rest
  } = props
  const { focusVisible, onFocus, onBlur } = useFocusVisibleWithProps(props)
  return (
    <Text
      as="label"
      className={cx('hds-checkbox', className, {
        'hds-checkbox-disabled': disabled,
        'hds-checkbox-no-label': withHiddenLabel,
        'hds-checkbox-has-border': hasBorder,
      })}
      size="body-14"
      color={disabled ? 'surface-50' : 'surface-100'}
      htmlFor={id}
    >
      <input
        {...rest}
        ref={ref}
        type="checkbox"
        checked={checked}
        id={id}
        value={value}
        className={cx('hds-checkbox-input', {
          'hds-focus-visible': focusVisible,
        })}
        disabled={disabled}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      <div className="hds-checkbox-label">
        {withHiddenLabel ? <div className="hds-sr-only">{label}</div> : label}
      </div>
      <Icon
        name="Check"
        className="hds-checkbox-check"
        size="16"
        color="constants-white"
        isDecorative
        aria-label=""
      />
    </Text>
  )
})

export default Checkbox
