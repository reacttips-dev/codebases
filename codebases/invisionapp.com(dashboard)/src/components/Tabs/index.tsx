import React, { forwardRef, Ref } from 'react'
import cx from 'classnames'
import Action from '../Action'
import Text from '../../primitives/Text'
import usePrevious from '../../hooks/usePrevious'
import { HTMLProps } from '../../helpers/omitType'
import { TabsItems, TabsItem } from './types'

export interface TabsProps extends HTMLProps<HTMLDivElement> {
  /**
   * The list of actionable items.
   */
  items: TabsItems
}

/**
 * Tabs contain a list of actionable items.
 */
const Tabs = forwardRef(function Tabs(
  props: TabsProps,
  ref: Ref<HTMLDivElement>
) {
  const { className, items, ...rest } = props
  const prevOptions = usePrevious(items)
  const currentlySelected = items.findIndex(
    (i: TabsItem) => i.isSelected === true
  )
  const previouslySelected =
    prevOptions && prevOptions.findIndex((i: TabsItem) => i.isSelected === true)

  return (
    <div {...rest} ref={ref} className={cx('hds-tabs', className)}>
      <ul
        className={cx('hds-tabs-menu', {
          [`hds-grid-cols-${items.length}`]: items,
        })}
      >
        <li
          aria-hidden="true"
          className={cx('hds-tabs-indicator', {
            'hds-tabs-indicator-is-hidden': currentlySelected === -1,
            'hds-tabs-indicator-is-appearing':
              currentlySelected > -1 && previouslySelected === -1,
            'hds-tabs-indicator-is-disappearing':
              currentlySelected === -1 &&
              typeof previouslySelected === 'number' &&
              previouslySelected > -1,
          })}
          style={{
            width: `${((1 / items.length) * 100).toFixed(2)}%`,
            transform: `translateX(${currentlySelected * 100}%)`,
          }}
        />
        {items.map((tab: TabsItem, i: number) => {
          const { onClick, label, isSelected } = tab
          return (
            <li className="hds-tabs-option" key={i}>
              <Action
                as="button"
                onClick={onClick}
                className={cx('hds-tabs-button', {
                  'hds-tabs-button-is-selected': isSelected,
                })}
              >
                <Text size="label-10" color="surface-100">
                  {label}
                </Text>
              </Action>
            </li>
          )
        })}
      </ul>
    </div>
  )
})

export default Tabs
