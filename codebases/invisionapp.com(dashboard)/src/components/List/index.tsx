import React, { ReactNode, useMemo, forwardRef, Ref } from 'react'
import cx from 'classnames'
import { Omit, HTMLProps } from '../../helpers/omitType'
import Text from '../../primitives/Text'
import { TextSize, TextColor } from '../../primitives/Text/types'
import { ListOrder } from './types'

export interface ListProps
  extends Omit<HTMLProps<HTMLUListElement | HTMLOListElement>, 'size'> {
  /**
   * The items within the List.
   */
  items: ReactNode[]
  /**
   * Updates each list item's text size.
   */
  size: TextSize
  /**
   * Changes the color of the text
   */
  color: TextColor
  /**
   * Which type of list to display
   */
  order: ListOrder
}

/**
 * Lists are groups of content.
 */
const List = forwardRef(function List(
  props: ListProps,
  ref: Ref<HTMLUListElement | HTMLOListElement>
) {
  const { className, items, size, color, order, type, ...rest } = props
  const tag = order === 'ordered' ? 'ol' : 'ul'

  const spacing = useMemo(() => {
    const matcher = /(?:[a-z]*-)*(\d*)/
    const matches = size && size.match(matcher)
    const px = matches ? parseInt(matches[1], 10) : 14
    if (px <= 20) {
      return '8'
    }
    if (px <= 50) {
      return '16'
    }
    return '24'
  }, [size])

  return (
    <Text
      {...rest}
      ref={ref}
      size={size}
      color={color}
      as={tag}
      className={cx('hds-list', className, {
        'hds-list-unstyled': order === 'unstyled',
        [`hds-space-y-${spacing}`]: spacing,
      })}
    >
      {items.map((i, j) => (
        <li className="hds-list-item" key={j}>
          {i}
        </li>
      ))}
    </Text>
  )
})

export default List
