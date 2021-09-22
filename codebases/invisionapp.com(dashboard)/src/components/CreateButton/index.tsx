import React, { useRef, useCallback, useState, forwardRef, Ref } from 'react'
import cx from 'classnames'
import mergeRefs from 'react-merge-refs'
import useFocusVisibleWithProps from '../../hooks/useFocusVisibleWithProps'
import { Omit, HTMLProps } from '../../helpers/omitType'
import Icon from '../../primitives/Icon'

import { CreateButtonSize, CreateButtonOrder } from './types'

type T = React.TouchEvent<HTMLButtonElement>
type M = React.MouseEvent<HTMLButtonElement>
type K = React.KeyboardEvent<HTMLButtonElement>

export interface CreateButtonProps
  extends Omit<HTMLProps<HTMLButtonElement>, 'size'> {
  /**
   * The size of the CreateButton
   */
  size: CreateButtonSize
  /**
   * Changes the gradient of the CreateButton to match the document type
   */
  order?: CreateButtonOrder
}

/**
 * CreateButtons should be used solely for a positive creation action on a page. It should only be used as part of the GlobalHeader experience.
 */
const CreateButton = forwardRef(function CreateButton(
  props: CreateButtonProps,
  ref: Ref<HTMLButtonElement>
) {
  const { className, size, children, onClick, order, ...rest } = props
  const { focusVisible, onFocus, onBlur } = useFocusVisibleWithProps<
    HTMLButtonElement
  >(props)

  const [position, setPosition] = useState(0)
  const button = useRef<HTMLButtonElement>()
  const dimensions = useRef({
    left: 0,
    width: 0,
  })

  const getTouchValue = (e: T) => {
    const { left, width } = dimensions.current
    let x = (e as T).touches[0].pageX - left
    // @ts-ignore
    x = Math.min(Math.max(x, 0), width)
    const percentage = x / width
    return percentage
  }

  const getMouseValue = (e: T | M) => {
    const { left, width } = dimensions.current
    let x = (e as M).clientX - left
    // @ts-ignore
    x = Math.min(Math.max(x, 0), width)
    const percentage = x / width
    return percentage
  }

  const setDimensions = useCallback(() => {
    if (!button.current) {
      return {
        left: 0,
        width: 0,
      }
    }
    const box = button.current.getBoundingClientRect()
    return {
      left: box.left,
      width: box.width,
    }
  }, [])

  const setPercentage = (v: number) => {
    const percentagePosition = 100 - Math.round(v * 100)
    setPosition(percentagePosition)
  }

  const handleEnter = (e: M) => {
    dimensions.current = setDimensions()
    const v = getMouseValue(e)
    setPercentage(v)
  }

  const handleMove = (e: M) => {
    dimensions.current = setDimensions()
    const v = getMouseValue(e)
    setPercentage(v)
  }

  const handleMouseUp = () => {
    button?.current?.blur()
  }

  const handleTouchStart = (e: T) => {
    dimensions.current = setDimensions()
    const v = getTouchValue(e)
    setPercentage(v)
  }

  const handleTouchMove = (e: T) => {
    dimensions.current = setDimensions()
    const v = getTouchValue(e)
    setPercentage(v)
  }

  const handleTouchEnd = () => {
    button?.current?.blur()
  }

  return (
    <button
      {...rest}
      className={cx('hds-create-button', className, {
        'hds-create-button-24': size === '24',
        'hds-create-button-32': size === '32',
        'hds-focus-visible': focusVisible,
        'hds-create-button-all': !order,
        [`hds-create-button-${order}`]: order,
      })}
      type="button"
      onClick={onClick}
      ref={mergeRefs([button, ref])}
      onMouseEnter={handleEnter}
      onMouseMove={handleMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        backgroundPosition: `${position}%`,
      }}
      onBlur={onBlur}
      onFocus={onFocus}
    >
      <Icon
        name="Add"
        color={order === 'spec' ? 'constants-black' : 'constants-white'}
        size={size === '24' ? '16' : '24'}
        isDecorative
      />

      {children}
    </button>
  )
})

CreateButton.defaultProps = {
  size: '24',
}

export default CreateButton
