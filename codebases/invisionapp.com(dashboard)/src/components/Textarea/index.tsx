/* eslint-disable @invisionapp/style-guide/en-dashes */
import React, { useMemo, forwardRef, Ref, ReactNode } from 'react'
import cx from 'classnames'
import TextareaAutosize from 'react-autosize-textarea'
import useFocusVisibleWithProps from '../../hooks/useFocusVisibleWithProps'
import useMediaQuery from '../../hooks/useMediaQuery'
import { HTMLProps } from '../../helpers/omitType'
import Text from '../../primitives/Text'
import ValidationMessage from '../ValidationMessage'
import { Status, LabelPosition } from '../../types'

export interface TextareaProps extends HTMLProps<HTMLTextAreaElement> {
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
   * Used to link the textarea element to the label.
   */
  id: string
  /**
   * Determines where to place the label relative to the textarea.
   */
  labelPosition?: LabelPosition
  /**
   * Whether or not the element is disabled
   */
  isDisabled?: boolean
  /**
   * The maximum number of rows the textarea will grow to
   */
  maxRows?: number
  /**
   * Sets the status of the textarea, usually used to determine validation status.
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

function getTextareaProps(props: Partial<TextareaProps>) {
  const { placeholder, withAccessiblePlaceholder, id } = props

  const placeholderProps =
    placeholder && withAccessiblePlaceholder
      ? {
          'aria-describedby': `${id}-hint`,
        }
      : {
          placeholder,
        }

  return {
    ...placeholderProps,
  }
}

/**
 * Textareas are used in forms for entering and editing longer textual content.
 */
const Textarea = forwardRef(function Textarea(
  props: TextareaProps,
  ref: Ref<HTMLTextAreaElement>
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
    maxRows = 3,
    status,
    withHiddenLabel,
    validationMessage,
    ...rest
  } = props

  const textareaProps = useMemo(
    () => getTextareaProps({ id, placeholder, withAccessiblePlaceholder }),
    [id, placeholder, withAccessiblePlaceholder]
  )

  const { focusVisible, onFocus, onBlur } = useFocusVisibleWithProps<
    HTMLTextAreaElement
  >(props)

  const isAbove1024 = useMediaQuery('(min-width: 1024px)')

  const maxHeight = useMemo(() => {
    const lineHeight = isAbove1024 ? 20 : 24
    return 16 + maxRows * lineHeight
  }, [isAbove1024, maxRows])

  return (
    <div
      className={cx('hds-textarea', className, {
        'hds-textarea-vertical': labelPosition === 'top',
        'hds-textarea-horizontal': labelPosition === 'left',
        'hds-textarea-disabled': isDisabled,
        'hds-focus-visible': focusVisible,
      })}
    >
      <Text
        as="label"
        className={cx('hds-textarea-label hds-block', {
          'hds-sr-only': withHiddenLabel,
        })}
        size="label-10"
        color="surface-100"
        htmlFor={id}
      >
        {label}
      </Text>
      <div className="hds-textarea-wrap">
        <TextareaAutosize
          {...rest}
          ref={ref}
          className={cx('hds-textarea-element', {
            'hds-textarea-element-disabled': isDisabled,
            [`hds-border-${status}-100`]: status,
            'hds-textarea-element-has-validation': validationMessage,
          })}
          disabled={isDisabled}
          onFocus={onFocus}
          onBlur={onBlur}
          id={id}
          value={value}
          {...textareaProps}
          style={{
            ...rest.style,
            maxHeight,
          }}
        />
        <ValidationMessage id={id} status={status}>
          {validationMessage}
        </ValidationMessage>
        {placeholder && withAccessiblePlaceholder && (
          <Text
            as="div"
            className="hds-textarea-placeholder hds-block"
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

Textarea.defaultProps = {
  maxRows: 3,
}

export default Textarea
