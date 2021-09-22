import React, { useRef, useEffect, useState, forwardRef, Ref } from 'react'
import cx from 'classnames'
import { HTMLProps } from '../../helpers/omitType'
import Action from '../Action'
import { TabNavItems, TabNavItem } from './types'

export interface TabNavProps extends HTMLProps<HTMLDivElement> {
  /**
   * The list of navigation items
   */
  items: TabNavItems
}

type Position = {
  left: number
  right: string | number
}

/**
 *  TabNavs contain a list of navigation actions for tabs.
 */
const TabNav = forwardRef(function TabNav(
  props: TabNavProps,
  ref: Ref<HTMLDivElement>
) {
  const { className, items, ...rest } = props
  const optionsRef = useRef<HTMLLIElement[]>([])
  const wrapRef = useRef<HTMLUListElement>(null)

  const [position, setPosition] = useState<Position>({
    left: 0,
    right: '100%',
  })

  useEffect(() => {
    optionsRef.current = optionsRef.current.slice(0, items.length)
    const currentlySelected = items.findIndex(
      (i: TabNavItem) => i.isSelected === true
    )
    const activeNode: HTMLElement = optionsRef.current[currentlySelected]
    if (!activeNode || !wrapRef.current) {
      return
    }
    const left = activeNode.offsetLeft
    const width = activeNode.clientWidth
    const wrapWidth = wrapRef.current.clientWidth
    const right = wrapWidth - left - width
    setPosition({ left, right })
  }, [items])

  return (
    <div {...rest} ref={ref} className={cx('hds-tab-nav', className)}>
      <ul className={cx('hds-tab-nav-menu hds-space-x-24', {})} ref={wrapRef}>
        {items.map((tab: TabNavItem, i: number) => {
          const { onClick, href, to, as, label, isSelected } = tab
          return (
            <li
              className="hds-tab-nav-option"
              key={i}
              // @ts-ignore
              ref={el => (optionsRef.current[i] = el)}
            >
              <Action
                as={as}
                href={href}
                to={to}
                onClick={onClick}
                className={cx('hds-tab-nav-button hds-transition-on-hover', {
                  'hds-tab-nav-button-is-selected': isSelected,
                })}
              >
                {label}
              </Action>
            </li>
          )
        })}
        <li
          aria-hidden="true"
          className={cx('hds-tab-nav-indicator', {})}
          style={{
            left: position.left,
            right: position.right,
          }}
        />
      </ul>
    </div>
  )
})

export default TabNav
