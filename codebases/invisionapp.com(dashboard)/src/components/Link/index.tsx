import React, { ElementType, forwardRef, Ref } from 'react'
import cx from 'classnames'
import { HTMLProps } from '../../helpers/omitType'
import Action from '../Action'
import { LinkOrder } from './types'

export interface LinkProps
  extends HTMLProps<HTMLAnchorElement | HTMLButtonElement> {
  /**
   * Changes the visual prominence of the Link
   */
  order?: LinkOrder
  /**
   * Changes the underling HTML node to re4nder
   */
  as?: ElementType
  /**
   * If true, will display an underline when the Link is inactive.
   */
  hasUnderline?: boolean
}

/**
 * Links are actionable components meant for actions with lower prominence than Buttons.
 */
const Link = forwardRef(function Link(
  props: LinkProps,
  ref: Ref<HTMLAnchorElement | HTMLButtonElement>
) {
  const { className, children, order, as = 'a', hasUnderline, ...rest } = props
  return (
    <Action
      {...rest}
      ref={ref}
      className={cx('hds-link hds-transition-on-hover', className, {
        'hds-link-primary': order === 'primary',
        'hds-link-surface': order === 'surface',
        'hds-link-has-underline': hasUnderline,
      })}
      as={as}
    >
      {children}
    </Action>
  )
})

Link.defaultProps = {
  as: 'a',
  order: 'primary',
  hasUnderline: true,
}

export default Link
