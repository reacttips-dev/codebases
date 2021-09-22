// import React, { PureComponent, ReactNode, createRef } from 'react'
import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
  useEffect,
  ReactNode,
  forwardRef,
  Ref,
} from 'react'
import cx from 'classnames'
import mergeRefs from 'react-merge-refs'
import { Omit, HTMLProps } from '../../helpers/omitType'
import {
  ENTER_KEY,
  SPACE_KEY,
  UP_KEY,
  DOWN_KEY,
  LEFT_KEY,
  RIGHT_KEY,
  TAB_KEY,
} from '../../helpers/keyCodes'
import usePrevious from '../../hooks/usePrevious'
import useOnClickOutside from '../../hooks/useOnClickOutside'
import Rule from '../Rule'
import Icon from '../../primitives/Icon'
import {
  MenuItem,
  MenuNestedAlign,
  MenuNestedPlacement,
  MenuOpenNestedMenuOn,
} from './types'
import Text from '../../primitives/Text'

export interface MenuProps extends Omit<HTMLProps<HTMLUListElement>, 'width'> {
  /**
   * The items to display within the Menu.
   */
  items: MenuItem[]
  /**
   * Sets the width in pixels of the Menu
   */
  width?: number
  /**
   * Sets the horizontal alignment of any nested Menus
   */
  nestedAlign?: MenuNestedAlign
  /**
   * Sets the vertical placement of any nested Menus
   */
  nestedPlacement?: MenuNestedPlacement
  /**
   * If present, fixes the maximum height of the Menu, and the content will scroll. Note this prop is not compatible with nested Menu components.
   */
  fixedHeight?: number
  /**
   * Determines how to show and hide any nested Menu components.
   */
  openNestedMenuOn?: MenuOpenNestedMenuOn
  /**
   * The aria-label for the Menu for those using assistive technologies.
   */
  'aria-label': string
}

export interface MenuState {
  OPEN: string[]
  FOCUSED_LEVEL: string
  ITEMS: any
  FOCUSED_HISTORY: string[]
}

const getMenuItemsWithLevels = (
  items: MenuItem[],
  lastIdx = ''
): MenuItem[] => {
  return items.map((item: MenuItem, idx: number) => {
    const level = lastIdx === '' ? idx.toString() : `${lastIdx}-${idx}`
    return {
      ...item,
      level,
      items: item.items ? getMenuItemsWithLevels(item.items, level) : undefined,
    }
  })
}

const getFirstFocusedLevel = (items: MenuItem[]) => {
  return items.filter(item => {
    return item.type === 'item' && !item.isDisabled
  })[0].level
}

/**
 * We only want to keep open direct descendents of the current open menu,
 * so this method calculates which nested menus to keep open.
 */
export const getOpenLevels = (level: string): string[] => {
  if (level.length === 1) {
    return [level]
  }
  const split = level.split('-')
  const openLevels = split.reduce(
    (arr: string[], curr: string, i: number): string[] => {
      if (i === 0) {
        return [curr]
      }
      const last = arr[i - 1]
      return [...arr, `${last}-${curr}`]
    },
    []
  )
  return openLevels
}

/**
 * Menus contain a standardized, grouped list of actionable items.
 */
const Menu = forwardRef(function Menu(
  props: MenuProps,
  ref: Ref<HTMLUListElement>
) {
  const {
    items,
    width,
    className,
    fixedHeight,
    nestedAlign,
    nestedPlacement,
    'aria-label': ariaLabel,
    openNestedMenuOn,
    ...rest
  } = props

  const wrapper = useRef<HTMLUListElement>(null)
  const targetMenuItem = useRef()

  /**
   * We add some extra values in the items object
   */
  const processedItems = useMemo(() => {
    return getMenuItemsWithLevels(items)
  }, [items])

  /**
   * Stores which particular menu items are 'open'
   */
  const [openItems, setOpenItems] = useState<string[]>([])

  /**
   * Used to store which level of a menu is currently focused
   */
  const [focusedLevel, setFocusedLevel] = useState(
    getFirstFocusedLevel(processedItems)
  )

  const previousFocusedLevel = usePrevious(focusedLevel)

  /**
   * Used for tabbing through the focus states of the Menu
   */
  const [focusedHistory, setFocusedHistory] = useState<string[]>([])

  /**
   * Determines whether the current Menu is in the open array.
   */
  const checkIfIsOpen = useCallback(
    (level: string): boolean => {
      return openItems.indexOf(level) > -1
    },
    [openItems]
  )

  /**
   * Resets the Menu if clicked outsite
   */
  useOnClickOutside({
    element: wrapper,
    callback: () => {
      if (openItems.length) {
        setOpenItems([])
      }
      setFocusedLevel(getFirstFocusedLevel(processedItems))
    },
  })

  const setOpenState = useCallback(
    (level: any) => {
      const isOpen = checkIfIsOpen(level)

      if (!isOpen) {
        const openLevels = getOpenLevels(level)
        setOpenItems(openLevels)
      } else {
        const newOpen = [...openItems]
        const index = newOpen.indexOf(level)
        if (index > -1) {
          newOpen.splice(index, 1)
        }
        setOpenItems(newOpen)
      }
    },
    [openItems, checkIfIsOpen]
  )

  useEffect(() => {
    const targetMenuHTMLElement: any = targetMenuItem.current
    if (
      previousFocusedLevel &&
      focusedLevel.length > previousFocusedLevel.length
    ) {
      setTimeout(() => {
        if (!targetMenuHTMLElement) {
          return
        }
        targetMenuHTMLElement.focus()
      }, 100)
    } else {
      if (!targetMenuHTMLElement) {
        return
      }
      targetMenuHTMLElement.focus()
    }
  }, [focusedLevel, previousFocusedLevel, items])

  const handleItemBlur = () => {
    const activeElement = document?.activeElement as HTMLElement
    activeElement?.blur()
  }

  /**
   * Method that gets called on a click of an item. Calls the onClick
   * prop for the item if it exists, and if it's a nested nav will add
   * the associated nav to the open array.
   */
  const handleItemClick = useCallback(
    (item: MenuItem, level: any) => (
      e: React.MouseEvent<HTMLElement>
    ): void => {
      const { onClick, items } = item
      onClick && onClick(e)
      e.stopPropagation()

      if (!items || !items.length) {
        return
      }
      setOpenState(level)
    },
    [setOpenState]
  )

  const handleItemMouseEnter = useCallback(
    (item: MenuItem, level: any) => (
      e: React.MouseEvent<HTMLElement>
    ): void => {
      const { items } = item
      handleItemBlur()
      e.preventDefault()
      e.stopPropagation()

      if (!items || !items.length) {
        return
      }

      setOpenState(level)
    },
    [setOpenState]
  )

  const handleItemMouseLeave = useCallback(
    (item: MenuItem, level: any) => (
      e: React.MouseEvent<HTMLElement>
    ): void => {
      const { items } = item
      e.preventDefault()
      e.stopPropagation()

      if (!items || !items.length) {
        return
      }

      setOpenState(level)
    },
    [setOpenState]
  )

  /**
   * Handles all keyboard interaction with a menu item
   */
  const handleItemKeyDown = useCallback(
    (item: MenuItem, level: any) => (
      e: React.KeyboardEvent<HTMLElement>
    ): void => {
      const getSiblingsFromLevel = (
        level: string,
        focusableItems: MenuItem[]
      ) => {
        const levelArray = level.split('-').map(char => {
          return parseInt(char, 10)
        })
        let subsetOfItems: any = focusableItems
        if (subsetOfItems) {
          for (let l = 0; l < levelArray.length - 1; l++) {
            const index = levelArray[l]
            subsetOfItems = subsetOfItems[index].items
          }
        }
        return subsetOfItems
      }

      const getLevelFromMoveDown = (
        level: string,
        focusableItems: MenuItem[]
      ) => {
        // get the current position and menu items
        let position = parseInt(level.slice(-1), 10)
        const currentMenu = getSiblingsFromLevel(level, focusableItems)

        for (let i = 0; i < currentMenu.length; i++) {
          // land on item
          if (position + 1 <= currentMenu.length - 1) {
            position += 1
          } else {
            position = 0
          }
          // check if type item
          if (
            currentMenu[position].type === 'item' &&
            !currentMenu[position].isDisabled
          ) {
            return currentMenu[position].level
          }
        }
        return level
      }

      const getLevelFromMoveUp = (
        level: string,
        focusableItems: MenuItem[]
      ) => {
        // get the current position and menu items
        let position = parseInt(level.slice(-1), 10)
        const currentMenu = getSiblingsFromLevel(level, focusableItems)

        for (let i = 0; i < currentMenu.length; i++) {
          // land on item
          if (position - 1 < 0) {
            position = currentMenu.length - 1
          } else {
            position -= 1
          }
          // check if type item
          if (
            currentMenu[position].type === 'item' &&
            !currentMenu[position].isDisabled
          ) {
            return currentMenu[position].level
          }
        }
        return level
      }

      const getLevelFromMoveRight = (
        level: string,
        focusableItems: MenuItem[]
      ) => {
        // get the next level (naively)
        const nextLevel = `${level}-0`
        const currentMenu = getSiblingsFromLevel(nextLevel, focusableItems)
        if (currentMenu) {
          for (let position = 0; position < currentMenu.length; position++) {
            // check if type item
            if (
              currentMenu[position].type === 'item' &&
              !currentMenu[position].isDisabled
            ) {
              // add to history before moving
              setFocusedHistory(prevHistory => prevHistory.concat(level))
              return currentMenu[position].level
            }
          }
        }

        return level
      }

      const getLevelFromMoveLeft = (level: string) => {
        // get from history
        const newLevel = focusedHistory.pop()
        if (newLevel) {
          const newHistory = focusedHistory.splice(-1, 1)
          setFocusedHistory(newHistory)
          return newLevel
        }
        return level
      }
      // Selecting a menu item
      if (e.keyCode === ENTER_KEY || e.keyCode === SPACE_KEY) {
        e.preventDefault()
        e.stopPropagation()
        const { onKeyDown, onClick, items } = item

        onKeyDown && onKeyDown(e)
        onClick && onClick(e as any)
        if (!items || !items.length) {
          return
        }
        setOpenState(level)
        // Tabbing away closes menu and resets focus level
      } else if (e.keyCode === TAB_KEY) {
        setOpenItems([])
        setFocusedLevel(getFirstFocusedLevel(processedItems))
        // Moving up
      } else if (e.keyCode === UP_KEY) {
        e.preventDefault()
        e.stopPropagation()
        const nextLevel = getLevelFromMoveUp(focusedLevel, processedItems)
        setFocusedLevel(nextLevel)
        // Moving down
      } else if (e.keyCode === DOWN_KEY) {
        e.preventDefault()
        e.stopPropagation()
        const nextLevel = getLevelFromMoveDown(focusedLevel, processedItems)
        setFocusedLevel(nextLevel)
        // Moving right to a new menu
      } else if (e.keyCode === RIGHT_KEY) {
        e.preventDefault()
        e.stopPropagation()
        if (!checkIfIsOpen(level)) {
          setOpenState(level)
        }
        const nextLevel = getLevelFromMoveRight(focusedLevel, processedItems)
        setFocusedLevel(nextLevel)
        // Moving back left
      } else if (e.keyCode === LEFT_KEY) {
        e.preventDefault()
        e.stopPropagation()
        const nextLevel = getLevelFromMoveLeft(focusedLevel)
        setFocusedLevel(nextLevel)
        if (nextLevel !== level) {
          setOpenState(nextLevel)
        }
      }
    },
    [processedItems, focusedLevel, checkIfIsOpen, setOpenState, focusedHistory]
  )

  const handleItemKeyUp = (e: React.MouseEvent<HTMLElement>): void => {
    e.preventDefault()
    e.stopPropagation()
  }

  /**
   * Builds the content of the Menu, and runs recursively if an item has children
   * items of it's own.
   */
  const getChild = useCallback(
    (item: MenuItem, level: string): ReactNode => {
      const {
        type,
        label,
        isSelected,
        isDestructive,
        iconNode,
        isDisabled,
        items: nestedItems,
        onClick,
        onKeyDown,
        className,
        subtitle,
        as,
        ...restOfItem
      } = item
      if (type === 'divider') {
        return (
          <Rule
            color="surface-20"
            spacing="4"
            data-testid="helios-menu-divider"
          />
        )
      }
      if (type === 'label') {
        return (
          <Text
            size="label-12"
            className={cx('hds-menu-item-title', className)}
            data-testid="hds-menu-item-title"
            color="surface-100"
          >
            {label}
          </Text>
        )
      }
      if (type === 'item') {
        let interactionProps: any = {
          onMouseEnter: handleItemBlur,
        }
        if (openNestedMenuOn === 'hover') {
          interactionProps = {
            onMouseEnter: handleItemMouseEnter(item, level),
            onMouseLeave: handleItemMouseLeave(item, level),
          }
        }

        return (
          <div className={cx('hds-menu-item-wrap', className)}>
            <Text
              {...restOfItem}
              size={subtitle ? 'heading-14' : 'body-13'}
              as={as}
              className={cx('hds-menu-item hds-transition-on-hover', {
                'hds-menu-item-is-selected': isSelected,
                'hds-menu-item-is-destructive': isDestructive,
                'hds-menu-item-is-disabled': isDisabled,
              })}
              {...interactionProps}
              onClick={handleItemClick(item, level)}
              onKeyDown={handleItemKeyDown(item, level)}
              onKeyUp={handleItemKeyUp}
              tabIndex={level === focusedLevel && !isDisabled ? 0 : -1}
              aria-haspopup={
                nestedItems && nestedItems.length ? 'true' : 'false'
              }
              ref={level === focusedLevel ? targetMenuItem : null}
              role="menuitem"
            >
              {iconNode && (
                <div className="hds-menu-item-icon-wrap">{iconNode}</div>
              )}
              <div className="hds-menu-item-label">
                {label}
                {subtitle && (
                  <Text size="body-12" className="hds-menu-item-subtitle">
                    {subtitle}
                  </Text>
                )}
              </div>
              {isSelected && (
                <div className="hds-menu-item-selected-wrap">
                  <Icon
                    name="Check"
                    size="16"
                    color="primary-100"
                    isDecorative
                  />
                </div>
              )}
              {nestedItems && nestedItems.length && (
                <div className="hds-menu-item-selected-wrap">
                  <Icon
                    name="NavigateRight"
                    size="16"
                    color="surface-80"
                    isDecorative
                  />
                </div>
              )}
            </Text>
            {nestedItems && nestedItems.length && (
              <ul
                className={cx('hds-menu hds-menu-is-nested', {
                  [`hds-menu-align-${nestedAlign}`]: nestedAlign,
                  [`hds-menu-placement-${nestedPlacement}`]: nestedPlacement,
                  'hds-menu-is-open': checkIfIsOpen(level),
                })}
                role="menu"
                ref={wrapper}
                style={{
                  width,
                  height: fixedHeight || undefined,
                }}
              >
                {nestedItems.map((nestedItem, i) => (
                  <li
                    className="hds-menu-li"
                    key={`${nestedItem.label}-${i}`}
                    role="none"
                  >
                    {getChild(nestedItem, `${level}-${i}`)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      }
    },
    [
      checkIfIsOpen,
      nestedPlacement,
      nestedAlign,
      fixedHeight,
      focusedLevel,
      openNestedMenuOn,
      width,
      handleItemClick,
      handleItemKeyDown,
      handleItemMouseEnter,
      handleItemMouseLeave,
    ]
  )

  return (
    <ul
      {...rest}
      className={cx('hds-menu', className, {
        'hds-menu-with-scroll': fixedHeight,
      })}
      role="menu"
      ref={mergeRefs([wrapper, ref])}
      style={{
        width,
        maxHeight: fixedHeight || undefined,
      }}
    >
      {items.map((item, i) => (
        <li className="hds-menu-li" key={`${item.label}-${i}`} role="none">
          {getChild(item, `${i}`)}
        </li>
      ))}
    </ul>
  )
})

Menu.defaultProps = {
  width: 216,
  openNestedMenuOn: 'click',
  nestedAlign: 'right',
  nestedPlacement: 'bottom',
}

export default Menu
