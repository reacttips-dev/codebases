import React, { ReactNode, forwardRef, Ref } from 'react'
import cx from 'classnames'
import { Omit, HTMLProps } from '../../helpers/omitType'
import Action from '../Action'
import Modal from '../Modal'

export interface ColorPickerProps
  extends Omit<HTMLProps<HTMLDivElement>, 'size'> {
  /**
   * The list of colors to display. Should be an array of hex codes.
   */
  colors: string[]
  /**
   * A render prop to display the trigger element to show/hide the colors.
   */
  renderTrigger?: (props: ColorPickerProps) => ReactNode
  /**
   * The currently selected color
   */
  selectedColor?: string
  /**
   * Whether or not the ColorPicker list is visible
   */
  isOpen: boolean
  /**
   * Callback that is fired when a user clicks on a color
   */
  onChangeColor?: (color: string) => any
  /**
   * Callback that is fired when the ColorPicker should change visibility
   */
  onChangeVisibility: (visibility: boolean) => any
  /**
   * For styling
   */
  className?: string
  /**
   * Color disc size
   */
  size?: number
  /**
   * The DOM node to render the ColorPicker Modal into.
   */
  domNode?: Element
}

/**
 * ColorPickers contain a list of colors for a user to choose from.
 */
const ColorPicker = forwardRef(function ColorPicker(
  props: ColorPickerProps,
  ref: Ref<HTMLDivElement>
) {
  const {
    className,
    colors,
    isOpen,
    renderTrigger,
    selectedColor,
    onChangeColor,
    onChangeVisibility,
    size = 12,
    domNode,
    ...rest
  } = props

  const handleClick = (color: string) => (
    evt: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>
  ) => {
    evt.currentTarget.blur()
    onChangeColor && onChangeColor(color)
  }

  const handleRequestClose = () => {
    onChangeVisibility(false)
  }

  return (
    <div {...rest} ref={ref} className={cx('hds-color-picker', className)}>
      {renderTrigger!(props)}
      <Modal
        className={cx('hds-color-picker-wrap', {
          'hds-color-picker-wrap-is-open': isOpen,
        })}
        isOpen={isOpen}
        aria-label="Color Picker"
        onRequestClose={handleRequestClose}
        style={{
          maxWidth: 14 * size,
        }}
        domNode={domNode}
      >
        {colors.map(color => {
          const colorDisc = (
            <Action
              as="button"
              className={cx('hds-color-picker-color', {
                'hds-color-picker-color-is-active': color === selectedColor,
              })}
              key={color}
              style={{
                backgroundColor: color,
                boxShadow:
                  color === selectedColor
                    ? `0 0 0 2px var(--hds-palette-surface-0), 0 0 0 4px ${color}`
                    : undefined,
                width: size,
                height: size,
              }}
              onClick={handleClick(color)}
              data-testid="hds-color-picker-color"
              aria-label={`Choose ${color}`}
              title={`Choose ${color}`}
            />
          )

          return colorDisc
        })}
      </Modal>
    </div>
  )
})

ColorPicker.defaultProps = {
  size: 12,
  renderTrigger: (props: ColorPickerProps) => {
    const { selectedColor, open, onChangeVisibility, size } = props

    function handleChangeVisibility(
      evt: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>
    ) {
      evt.currentTarget.blur()
      onChangeVisibility(!open)
    }
    return (
      <Action
        as="button"
        className={cx('hds-color-picker-color hds-color-picker-trigger')}
        style={{
          backgroundColor: selectedColor,
          width: size,
          height: size,
        }}
        onClick={handleChangeVisibility}
        aria-label="Toggle the Color Picker"
        color={selectedColor}
      />
    )
  },
}

export default ColorPicker
