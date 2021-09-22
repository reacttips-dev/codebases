import React, { ElementType, ReactNode, forwardRef, Ref } from 'react'
import cx from 'classnames'
import { HTMLProps } from '../../helpers/omitType'
import {
  BoxFlex,
  BoxFlexDirection,
  BoxFlexGrow,
  BoxFlexShrink,
  BoxFlexWrap,
  BoxOrder,
  BoxJustifyContent,
  BoxAlignItems,
  BoxAlignContent,
  BoxAlignSelf,
} from './types'
import { Spacing } from '../../types'

export interface BoxProps extends HTMLProps<HTMLDivElement> {
  /**
   * A shorthand for controlling how flex items both grow and shrink.
   */
  flex?: BoxFlex
  /**
   * Establishes how the content is distributed within the Box, either as horizontal rows or vertical columns, as well as options to reverse the order.
   */
  flexDirection?: BoxFlexDirection
  /**
   * Defines how much space an element should take up proportionally to the rest of the sibling elements.
   */
  flexGrow?: BoxFlexGrow
  /**
   * Defines how the component should adapt when the component is larger than the Box container.
   */
  flexShrink?: BoxFlexShrink
  /**
   * Defines how the children of the Box behave, whether they should all fit in a single row/column and squeeze together (wrap / wrap-reverse), or keep their natural sizes and exist on multiple rows/columns (nowrap).
   */
  flexWrap?: BoxFlexWrap
  /**
   * Determines where visually this Flex component will appear. Used for overriding DOM positioning.
   */
  order?: BoxOrder
  /**
   * Defines the alignment and distribution along the main axis (horizontal for row, vertical for column).
   */
  justifyContent?: BoxJustifyContent
  /**
   * Defines the alignment and distribution along the cross axis (vertical for row, horizontal for column).
   */
  alignItems?: BoxAlignItems
  /**
   * Defines the alignment and distribution along the cross axis when there are multiple rows/columns. Will not work with a single line of children.
   */
  alignContent?: BoxAlignContent
  /**
   * Allows the default alignment set by alignItems to be overridden on an individual basis.
   */
  alignSelf?: BoxAlignSelf
  /**
   * What underlying HTML element to render the Box as.
   */
  as?: ElementType
  /**
   * The space between each child element
   */
  spacing?: Spacing
  /**
   * The content of the Box
   */
  children: ReactNode
}

/**
 * Boxes are flexbox-based layout utility components.
 */
const Box = forwardRef(function Box(props: BoxProps, ref: Ref<HTMLDivElement>) {
  const {
    flexDirection,
    flexWrap,
    alignItems,
    alignContent,
    alignSelf,
    justifyContent,
    flex,
    flexGrow,
    flexShrink,
    order,
    spacing,
    as = 'div',
    children,
    className,
    ...rest
  } = props
  const Tag = as

  const spacingAxis = flexDirection && flexDirection.includes('col') ? 'y' : 'x'

  return (
    <Tag
      {...rest}
      ref={ref}
      className={cx('hds-box hds-flex', className, {
        [`hds-flex-${flexDirection}`]: flexDirection,
        [`hds-flex-${flexWrap}`]: flexWrap,
        [`hds-items-${alignItems}`]: alignItems,
        [`hds-content-${alignContent}`]: alignContent,
        [`hds-self-${alignSelf}`]: alignSelf,
        [`hds-justify-${justifyContent}`]: justifyContent,
        [`hds-flex-${flex}`]: flex,
        [`hds-flex-${flexGrow}`]: flexGrow,
        [`hds-flex-${flexShrink}`]: flexShrink,
        [`hds-order-${order}`]: order,
        [`hds-space-${spacingAxis}-${spacing}`]: spacing,
      })}
    >
      {children}
    </Tag>
  )
})

Box.defaultProps = {
  as: 'div',
}

export default Box
