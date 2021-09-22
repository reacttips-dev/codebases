import React, { forwardRef, Ref } from 'react'
import cx from 'classnames'
import useFocusVisibleWithProps from '../../hooks/useFocusVisibleWithProps'
import { HTMLProps, Omit } from '../../helpers/omitType'
import { ENTER_KEY, SPACE_KEY } from '../../helpers/keyCodes'
import Text from '../../primitives/Text'
import { LabelPosition } from '../../types'

export interface ToggleProps
  extends Omit<HTMLProps<HTMLInputElement>, 'onChange'> {
  /**
   * The form field ID
   */
  id: string
  /**
   * The label for the form field
   */
  label: string
  /**
   * For styling
   */
  className?: string
  /**
   * If true, the Toggle appears checked
   */
  checked: boolean
  /**
   * If true, the Toggle will be non-interactive
   */
  disabled?: boolean
  /**
   * Callback for when the Toggle is clicked on and changes state. Exposes a parameter of whether the Toggle should be clicked or not.
   */
  onChange: (checked: boolean) => any
  /**
   * Used for screen readers to help give context to the Toggle
   */
  'aria-label'?: string
  /**
   * Determines where to place the label relative to the input.
   */
  labelPosition: LabelPosition
}

/**
 * Toggles are a stylized checkbox which allows the user to feel as though they are turning something on/off.
 */
const Toggle = forwardRef(function Toggle(
  props: ToggleProps,
  ref: Ref<HTMLInputElement>
) {
  const {
    id,
    label,
    className,
    checked,
    disabled,
    onChange,
    labelPosition,
    ...rest
  } = props
  const { focusVisible, onFocus, onBlur } = useFocusVisibleWithProps(props)

  const handleChange = () => {
    const { onChange, checked } = props

    onChange(!checked)
  }

  const handleKeyDown = (evt: React.KeyboardEvent<HTMLDivElement>) => {
    const { keyCode } = evt
    const { onChange, checked, disabled } = props
    if (disabled) {
      return
    }
    if (keyCode === ENTER_KEY || keyCode === SPACE_KEY) {
      onChange(!checked)
    }
  }

  return (
    <div
      className={cx('hds-toggle', className, {
        'hds-toggle-vertical': labelPosition === 'top',
        'hds-toggle-horizontal': labelPosition === 'left',
        'hds-toggle-disabled': disabled,
        'hds-focus-visible': focusVisible,
      })}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="checkbox"
      aria-checked={checked}
      aria-label={label as string}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <Text
        as="label"
        className="hds-toggle-label hds-block"
        size="label-12"
        color={disabled ? 'surface-60' : 'surface-100'}
        htmlFor={id}
      >
        {label}
      </Text>
      <label
        className="hds-toggle-wrap"
        htmlFor={id}
        aria-label={checked ? 'Yes' : 'No'}
        aria-checked={checked}
      >
        <input
          {...rest}
          ref={ref}
          type="checkbox"
          className="hds-toggle-input"
          id={id}
          onChange={handleChange}
          checked={checked}
          disabled={disabled}
          tabIndex={-1}
        />
        <div className="hds-toggle-track">
          <div className="hds-toggle-handle" />
        </div>
      </label>
    </div>
  )
})

export default Toggle
