import React, { useRef, useCallback, forwardRef, Ref } from 'react'
import cx from 'classnames'
import useFocusVisibleWithProps from '../../hooks/useFocusVisibleWithProps'
import { Omit, HTMLProps } from '../../helpers/omitType'
import Text from '../../primitives/Text'
import {
  UP_KEY,
  DOWN_KEY,
  LEFT_KEY,
  RIGHT_KEY,
  PAGE_DOWN_KEY,
  PAGE_UP_KEY,
  END_KEY,
  HOME_KEY,
} from '../../helpers/keyCodes'
import { LabelPosition } from '../../types'

type T = React.TouchEvent<HTMLDivElement>
type M = React.MouseEvent<HTMLDivElement>
type K = React.KeyboardEvent<HTMLDivElement>

export interface RangeProps
  extends Omit<
    HTMLProps<HTMLDivElement>,
    'onChange' | 'onKeyDown' | 'onDragStart' | 'onDragEnd'
  > {
  /**
   * Represents a caption for the form element.
   */
  label: string
  /**
   * Used to link the input element to the label.
   */
  id: string
  /**
   * Determines the minimum possible value of the Range.
   */
  min?: number
  /**
   * Determines the maximum possible value of the Range.
   */
  max?: number
  /**
   * Determines the value of the Range.
   */
  value: number
  /**
   * Determines the increment in the values.
   */
  step?: number
  /**
   * Determines the increment when using a keyboard and pressing the PAGE_UP or PAGE_DOWN keys.
   */
  pageKeyStep?: number
  /**
   * Callback for when the Range state changes
   */
  onChange: (v: number) => any
  onKeyDown?: (e: K) => any
  onDragStart?: (v: number) => any
  onDragMove?: (v: number) => any
  onDragEnd?: (v: number) => any
  /**
   * If true, the Range will be non-interactive
   */
  disabled?: boolean
  /**
   * Text to label the Range for assisitve tech users
   * @type string
   */
  'aria-label'?: string
  /**
   * Determines where to place the label relative to the input.
   */
  labelPosition: LabelPosition
}

/**
 * Ranges allow users to select a single option from a range.
 */
const Range = forwardRef(function Range(
  props: RangeProps,
  ref: Ref<HTMLDivElement>
) {
  const {
    id,
    label,
    min = 0,
    max = 10,
    value,
    step = 1,
    labelPosition,
    className,
    pageKeyStep = 5,
    onChange,
    disabled,
    onKeyDown,
    onDragStart,
    onDragMove,
    onDragEnd,
    ...rest
  } = props

  const { focusVisible, onFocus, onBlur } = useFocusVisibleWithProps(props)
  const range = useRef<HTMLDivElement>(null)
  const isDragging = useRef<boolean>(false)
  const elementDimensions = useRef<{ left: number; width: number }>({
    left: 0,
    width: 0,
  })

  const getValue = useCallback(
    (v: number) => {
      const range = max - min
      const decimalStep = step / range

      let value = Math.round(v / decimalStep) * decimalStep
      value = (value * range) / range
      value = value * (max - min) + min
      value = Math.min(Math.max(value, min), max)
      return parseInt(value.toString(), 10)
    },
    [max, min, step]
  )

  const getValueFromEvent = useCallback(
    (e: T | M) => {
      const { left, width } = elementDimensions.current
      let x: number
      if ((e as T).touches && (e as T).touches.length === 1) {
        x = (e as T).touches[0].pageX - left
      } else if ((e as M).clientX) {
        x = (e as M).clientX - left
      }
      // @ts-ignore
      x = Math.min(Math.max(x, 0), width)
      const percentage = x / width
      return getValue(percentage)
    },
    [getValue]
  )

  const handleResize = useCallback(() => {
    if (!range.current) {
      return {
        left: 0,
        width: 0,
      }
    }
    const box = range.current.getBoundingClientRect()
    elementDimensions.current = {
      left: box.x,
      width: box.width,
    }
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const range = max - min
      const stepArrow = step / range
      const stepPage = pageKeyStep / range
      const factorMap: { [key: number]: number } = {
        [UP_KEY]: stepArrow,
        [RIGHT_KEY]: stepArrow,
        [DOWN_KEY]: -stepArrow,
        [LEFT_KEY]: -stepArrow,
        [PAGE_DOWN_KEY]: -stepPage,
        [PAGE_UP_KEY]: stepPage,
        [HOME_KEY]: -1,
        [END_KEY]: 1,
      }
      const factor = factorMap[e.keyCode]
      if (typeof factor !== 'number') {
        return
      }
      const currentPercentage = (value - min) / (max - min)
      const v = getValue(factor + currentPercentage)
      onChange(v)

      onKeyDown && onKeyDown(e)
    },
    [min, max, step, value, onChange, onKeyDown, getValue, pageKeyStep]
  )

  const handleDragStart = useCallback(
    (e: T | M) => {
      handleResize()
      isDragging.current = true
      const v = getValueFromEvent(e)
      onChange(v)
      onDragStart && onDragStart(v)
    },
    [handleResize, getValueFromEvent, onChange, onDragStart]
  )

  const handleDragMove = useCallback(
    (v: number) => {
      if (value !== v) {
        onChange(v)
      }
      onDragMove && onDragMove(v)
    },
    [value, onChange, onDragMove]
  )

  const handleMouseMove = useCallback(
    (e: M) => {
      if (!isDragging.current) {
        return
      }
      const v = getValueFromEvent(e)
      handleDragMove(v)
    },
    [handleDragMove, getValueFromEvent]
  )

  const handleTouchMove = useCallback(
    (e: T) => {
      if (!isDragging.current) {
        return
      }
      e.preventDefault()
      const v = getValueFromEvent(e)
      handleDragMove(v)
    },
    [handleDragMove, getValueFromEvent]
  )

  const handleDragEnd = useCallback(() => {
    if (isDragging.current) {
      onDragEnd && onDragEnd(value)
    }
    isDragging.current = false
  }, [value, onDragEnd])

  const percentage = ((value - min) / (max - min)) * 100

  const handlers = disabled
    ? {}
    : {
        onFocus,
        onBlur,
        onKeyDown: handleKeyDown,
        onMouseDown: handleDragStart,
        onMouseMove: handleMouseMove,
        onMouseUp: handleDragEnd,
        onTouchStart: handleDragStart,
        onTouchMove: handleTouchMove,
        onTouchEnd: handleDragEnd,
      }

  return (
    <div
      {...rest}
      ref={ref}
      className={cx('hds-range', className, {
        'hds-range-vertical': labelPosition === 'top',
        'hds-range-horizontal': labelPosition === 'left',
        'hds-range-disabled': disabled,
        'hds-focus-visible': focusVisible,
      })}
    >
      <Text
        as="label"
        className="hds-range-label hds-block"
        size="label-12"
        color="surface-100"
        htmlFor={id}
      >
        {label}
      </Text>
      <div
        className="hds-range-wrapper"
        ref={range}
        tabIndex={disabled ? undefined : 0}
        role={disabled ? undefined : 'slider'}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={`${value} ranging from ${min} to ${max}`}
        {...handlers}
        aria-label={label}
      >
        <div className="hds-range-track">
          <div
            className="hds-range-progress"
            style={{
              transform: `scaleX(${percentage / 100})`,
            }}
          />
          <div className="hds-range-hover" />
        </div>
        <div
          className="hds-range-handle"
          style={{
            left: `${percentage}%`,
          }}
        />
        <Text
          size="label-10"
          color="surface-100"
          className="hds-range-value"
          style={{
            left: `${percentage}%`,
          }}
        >
          {value}
        </Text>
      </div>
    </div>
  )
})

Range.defaultProps = {
  min: 0,
  max: 10,
  step: 1,
  pageKeyStep: 5,
}

export default Range
