import React, { forwardRef, Ref, ReactNode } from 'react'
import cx from 'classnames'
import useFocusVisibleWithProps from '../../hooks/useFocusVisibleWithProps'
import { Omit, HTMLProps } from '../../helpers/omitType'
import Text from '../../primitives/Text'
import Icon from '../../primitives/Icon'
import ValidationMessage from '../ValidationMessage'
import { Size, Status, LabelPosition } from '../../types'

export interface SelectProps
  extends Omit<HTMLProps<HTMLSelectElement>, 'size'> {
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
   * Used to link the select element to the label.
   */
  id: string
  /**
   * Where this component fits on our size spectrum
   */
  size: Size
  /**
   * Determines where to place the label relative to the select.
   */
  labelPosition: LabelPosition
  /**
   * Whether or not the element is disabled
   */
  isDisabled?: boolean
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

/**
 * Selects allow a user to select a value from a list.
 */
const Select = forwardRef(function Select(
  props: SelectProps,
  ref: Ref<HTMLSelectElement>
) {
  const {
    id,
    value,
    label,
    placeholder,
    className,
    withAccessiblePlaceholder,
    labelPosition,
    isDisabled,
    children,
    size,
    status,
    withHiddenLabel,
    validationMessage,
    ...rest
  } = props

  const { focusVisible, onFocus, onBlur } = useFocusVisibleWithProps<
    HTMLSelectElement
  >(props)

  const placeholderProps =
    placeholder && withAccessiblePlaceholder
      ? {
          'aria-describedby': `${id}-hint`,
        }
      : {
          placeholder,
        }

  return (
    <div
      className={cx('hds-select', className, {
        'hds-select-vertical': labelPosition === 'top',
        'hds-select-horizontal': labelPosition === 'left',
        [`hds-select-size-${size}`]: size,
        'hds-select-disabled': isDisabled,
        'hds-focus-visible': focusVisible,
      })}
    >
      <Text
        as="label"
        className={cx('hds-select-label hds-block', {
          [`hds-select-label-h-${size}`]: size && labelPosition === 'left',
          'hds-sr-only': withHiddenLabel,
        })}
        size={size === '48' ? 'label-12' : 'label-10'}
        color="surface-100"
        htmlFor={id}
      >
        {label}
      </Text>
      <div className="hds-select-inner">
        <div className="hds-select-wrap">
          <select
            {...rest}
            ref={ref}
            className={cx('hds-select-element', {
              [`hds-h-${size}`]: size,
              [`hds-border-${status}-100`]: status,
              'hds-select-element-disabled': isDisabled,
              'hds-px-8': size !== '48',
              'hds-px-16': size === '48',
              'hds-select-element-has-validation': validationMessage,
            })}
            disabled={isDisabled}
            onFocus={onFocus}
            onBlur={onBlur}
            id={id}
            value={value}
            {...placeholderProps}
          >
            {children}
          </select>
          <Icon
            name="ExpandMenuAlt"
            size="24"
            color="surface-100"
            isDecorative
            aria-label=""
            className="hds-select-icon"
          />
        </div>
        <ValidationMessage id={id} status={status}>
          {validationMessage}
        </ValidationMessage>
        {placeholder && withAccessiblePlaceholder && (
          <Text
            as="div"
            className="hds-select-placeholder hds-block"
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

Select.defaultProps = {
  size: '32',
}

export default Select
