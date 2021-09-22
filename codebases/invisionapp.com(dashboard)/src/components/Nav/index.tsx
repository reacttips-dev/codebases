import React, { forwardRef, Ref } from 'react'
import cx from 'classnames'
import Action from '../Action'
import Text from '../../primitives/Text'
import { HTMLProps } from '../../helpers/omitType'
import { NavLinks, NavLink, NavOrder } from './types'
import { TextSize } from '../../primitives/Text/types'

export interface NavProps extends HTMLProps<HTMLElement> {
  /**
   * Changes the visual of the Nav
   */
  order: NavOrder
  /**
   * The list of links to render
   */
  links: NavLinks
}

/**
 * Navs contain a list of primary navigation links.
 */
const Nav = forwardRef(function Nav(props: NavProps, ref: Ref<HTMLElement>) {
  const { className, links, order, ...rest } = props
  return (
    <nav
      {...rest}
      ref={ref}
      className={cx('hds-nav', className, {
        'hds-nav-primary': order === 'primary',
      })}
    >
      <ul className="hds-nav-list hds-space-y-4">
        {links.map((link: NavLink, i: number) => {
          const { as, label, icon, isSelected, ...restOfLink } = link
          let size: TextSize = 'heading-16'
          if (order === 'secondary') {
            if (isSelected) {
              size = 'heading-14'
            } else {
              size = 'body-14'
            }
          }
          return (
            <li className="hds-nav-item" key={i}>
              <Action
                as={as}
                {...restOfLink}
                className={cx('hds-nav-link', {
                  'hds-nav-link-is-selected': isSelected,
                })}
              >
                <div className="hds-nav-icon">
                  {icon || (
                    <div aria-hidden="true" className="hds-nav-item-dot" />
                  )}
                </div>
                <Text
                  size={size}
                  color="surface-100"
                  className={cx('hds-nav-label')}
                >
                  {link.label}
                </Text>
              </Action>
            </li>
          )
        })}
      </ul>
    </nav>
  )
})

export default Nav
