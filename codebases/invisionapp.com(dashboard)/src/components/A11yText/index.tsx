import React, { forwardRef, Ref, ElementType } from 'react'
import cx from 'classnames'
import { HTMLProps } from '../../helpers/omitType'

export interface A11yTextProps
  extends Omit<HTMLProps<HTMLElement>, 'size' | 'color'> {
  /**
   * Sets the underlying HTML element.
   */
  as?: ElementType
}

/**
 * A11yTexts will render text to the DOM, but only for screen-readers. It will not show up visually.
 */
const A11yText = forwardRef(function A11yText(
  props: A11yTextProps,
  ref: Ref<HTMLDivElement>
) {
  const { className, children, as = 'div', ...rest } = props
  const Tag = as
  return (
    <Tag {...rest} ref={ref} className={cx('hds-a11y-text', className)}>
      {children}
    </Tag>
  )
})

export default A11yText
