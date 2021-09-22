import React, { forwardRef, Ref } from 'react'
import cx from 'classnames'
import useFocusVisibleWithProps from '../../hooks/useFocusVisibleWithProps'
import { HTMLProps } from '../../helpers/omitType'
import Text from '../../primitives/Text'

export interface RadioProps extends HTMLProps<HTMLInputElement> {
  /**
   * Represents a caption for the form element.
   */
  label: string
  /**
   * Used to link the input element to the label.
   */
  id: string
  /**
   * Determines whether the Radio is checked or not
   */
  checked: boolean
  /**
   * Callback for when the Radio state changes
   */
  onChange?: (evt?: React.FormEvent<HTMLInputElement>) => any
  /**
   * If true, the Radio will be non-interactive
   */
  disabled?: boolean
  /**
   * Text to label the Radio for assisitve tech users
   * @type string
   */
  'aria-label'?: string
  /**
   * If true, will wrap the Checkbox and label within a border to resemble a button.
   */
  hasBorder?: boolean
}

/**
 * Radios allow users to select a single option from a range.
 */
const Radio = forwardRef(function Radio(
  props: RadioProps,
  ref: Ref<HTMLInputElement>
) {
  const {
    id,
    label,
    checked,
    value,
    className,
    disabled,
    hasBorder,
    ...rest
  } = props
  const { focusVisible, onFocus, onBlur } = useFocusVisibleWithProps(props)

  return (
    <Text
      as="label"
      className={cx('hds-radio', className, {
        'hds-radio-disabled': disabled,
        'hds-radio-has-border': hasBorder,
      })}
      size="body-14"
      color={disabled ? 'surface-50' : 'surface-100'}
      htmlFor={id}
    >
      <input
        {...rest}
        ref={ref}
        type="radio"
        checked={checked}
        id={id}
        value={value}
        className={cx('hds-radio-input', {
          'hds-focus-visible': focusVisible,
        })}
        disabled={disabled}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      <div className="hds-radio-label">{label}</div>
    </Text>
  )
})

export default Radio
