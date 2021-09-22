/* eslint-disable @invisionapp/style-guide/en-dashes */
import React, { useMemo, ReactNode, forwardRef, Ref } from 'react'
import cx from 'classnames'
import useFocusVisibleWithProps from '../../hooks/useFocusVisibleWithProps'
import { Omit, HTMLProps } from '../../helpers/omitType'
import Text from '../../primitives/Text'
import ValidationMessage from '../ValidationMessage'
import { Size, Status, LabelPosition } from '../../types'

export interface InputProps extends Omit<HTMLProps<HTMLInputElement>, 'size'> {
  /**
   * Represents a caption for the form element.
   */
  label: string
  /**
   * Useful to add additional context or hints.
   */
  placeholder?: string
  /**
   * If true, will move the placeholder to an element under the form element itself.
   * Useful for instances where usability is a primary concern.
   */
  withAccessiblePlaceholder?: boolean
  /**
   * Used to link the input element to the label.
   */
  id: string
  /**
   * Where this component fits on our size spectrum
   */
  size?: Size
  /**
   * Determines the position of the label, relative to the input.
   */
  labelPosition?: LabelPosition
  /**
   * Adds a piece of UI immediately before the form element.
   */
  prepend?: ReactNode
  /**
   * Adds a piece of UI immediately after the form element.
   */
  append?: ReactNode
  /**
   * Whether or not the element is disabled
   */
  isDisabled?: boolean
  /**
   * Sets the type of Input
   */
  type?: string
  /**
   * Sets the status of the input, usually used to determine validation status.
   */
  status?: Status
  /**
   * If true, will make the label only visible to screen readers.
   */
  withHiddenLabel?: boolean
  /**
   * If present, will display a validation message under the Input. This will be announced by a screen reader if this prop changes dynamically.
   */
  validationMessage?: ReactNode
}

function getInputProps(props: Partial<InputProps>) {
  const { type, placeholder, withAccessiblePlaceholder, id } = props

  const placeholderProps =
    placeholder && withAccessiblePlaceholder
      ? {
          'aria-describedby': `${id}-hint`,
        }
      : {
          placeholder,
        }

  const typeProps =
    type === 'number'
      ? {
          type: 'text',
          inputMode: 'numeric' as any,
          pattern: '[0-9]*',
        }
      : { type }
  return {
    ...placeholderProps,
    ...typeProps,
  }
}

/**
 * Inputs are in forms for entering and editing shorter textual content.
 */
const Input = forwardRef(function Input(
  props: InputProps,
  ref: Ref<HTMLInputElement>
) {
  const {
    type,
    id,
    value,
    label,
    placeholder,
    className,
    withAccessiblePlaceholder,
    labelPosition,
    size,
    prepend,
    append,
    isDisabled,
    status,
    withHiddenLabel,
    validationMessage,
    ...rest
  } = props

  const inputProps = useMemo(
    () => getInputProps({ id, type, placeholder, withAccessiblePlaceholder }),
    [id, type, placeholder, withAccessiblePlaceholder]
  )

  const { focusVisible, onFocus, onBlur } = useFocusVisibleWithProps(props)

  return (
    <div
      className={cx('hds-input', className, {
        'hds-input-vertical': labelPosition === 'top',
        'hds-input-horizontal': labelPosition === 'left',
        [`hds-input-size-${size}`]: size,
        'hds-input-disabled': isDisabled,
        'hds-focus-visible': focusVisible,
      })}
    >
      <Text
        as="label"
        className={cx('hds-input-label hds-block', {
          [`hds-input-label-h-${size}`]: size && labelPosition === 'left',
          'hds-sr-only': withHiddenLabel,
        })}
        size={size === '48' ? 'label-12' : 'label-10'}
        color="surface-100"
        htmlFor={id}
      >
        {label}
      </Text>
      <div className="hds-input-inner">
        <div className="hds-input-element-wrap">
          {prepend && (
            <div
              className={cx('hds-input-prepend', {
                [`hds-h-${size}`]: size,
              })}
            >
              {prepend}
            </div>
          )}
          <input
            {...rest}
            ref={ref}
            className={cx('hds-input-element', {
              [`hds-h-${size}`]: size,
              'hds-input-element-disabled': isDisabled,

              'hds-px-8': size !== '48',
              'hds-px-16': size === '48',
            })}
            disabled={isDisabled}
            onFocus={onFocus}
            onBlur={onBlur}
            type={type}
            id={id}
            aria-describedby={`${id}-validation`}
            value={value}
            {...inputProps}
          />
          {append && (
            <div
              className={cx('hds-input-append', {
                [`hds-h-${size}`]: size,
              })}
            >
              {append}
            </div>
          )}
          <div
            className={cx('hds-input-wrapper', {
              [`hds-border-${status}-100`]: status,
              'hds-input-wrapper-has-validation': validationMessage,
            })}
            aria-hidden="true"
          />
        </div>
        <ValidationMessage id={id} status={status}>
          {validationMessage}
        </ValidationMessage>
        {placeholder && withAccessiblePlaceholder && (
          <Text
            as="div"
            className="hds-input-placeholder hds-block"
            size="body-12"
            color="surface-80"
            id={`${id}-hint`}
          >
            {placeholder}
          </Text>
        )}
      </div>
    </div>
  )
})

Input.defaultProps = {
  size: '32',
  type: 'text',
}

export default Input
