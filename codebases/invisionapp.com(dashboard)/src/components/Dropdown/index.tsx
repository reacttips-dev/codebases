import React, {
  ReactNode,
  useCallback,
  useMemo,
  forwardRef,
  Ref,
  useRef,
  useEffect,
} from 'react'
import { createPortal } from 'react-dom'
import cx from 'classnames'
import mergeRefs from 'react-merge-refs'
import { HTMLProps } from '../../helpers/omitType'
import usePositionElement from '../../hooks/usePositionElement'
import Menu, { MenuProps } from '../Menu'
import Action from '../Action'
import ThemeProvider, { useThemeContext } from '../ThemeProvider'
import { Placement, FocusManager } from '../../types'

export interface DropdownProps extends HTMLProps<HTMLDivElement> {
  /**
   * Whether or not the Dropdown is currently opened.
   */
  isOpen: boolean
  /**
   * The DOM node to render the Dropdown into, via a React Portal.
   */
  domNode?: HTMLElement
  /**
   * The trigger UI for the Dropdown.
   */
  triggerNode: ReactNode
  /**
   * Callback that gets fired whenever a visibility
   * state change is requested.
   */
  onChangeVisibility: (a: boolean) => any
  /**
   * If true, closes the dropdown menu after a list item has been clicked
   */
  canCloseOnItemClick?: boolean
  /**
   * If true, will close the Dropdown whenever you click outside the Dropdown element
   */
  canCloseOnClickOutside?: boolean
  /**
   * If true, pressing the ESC key will close the Dropdown
   */
  canCloseOnEsc?: boolean
  /**
   * Where the Dropdown Menu should be placed relatively to the trigger
   */
  placement: Placement
  /**
   * The items to display within the Menu.
   */
  items: MenuProps['items']
  /**
   * Sets the width in pixels of the Menu
   */
  width?: MenuProps['width']
  /**
   * Sets the horizontal alignment of any nested Menus
   */
  nestedAlign?: MenuProps['nestedAlign']
  /**
   * Sets the vertical placement of any nested Menus
   */
  nestedPlacement?: MenuProps['nestedPlacement']
  /**
   * If present, fixes the maximum height of the Menu, and the content will scroll. Note this prop is not compatible with nested Menu components.
   */
  fixedHeight?: MenuProps['fixedHeight']
  /**
   * Determines how to show and hide any nested Menu components.
   */
  openNestedMenuOn?: MenuProps['openNestedMenuOn']
  /**
   * The aria-label for the Menu for those using assistive technologies.
   */
  'aria-label': MenuProps['aria-label']
  /**
   * Determines how the focus management occurs. modal will automatically focus the first focusable element,
   * whereas modeless will shift focus to the container and allow a user to tab to focus the first focusable element
   */
  focusManager?: FocusManager
}

export interface RenderTriggerProps extends DropdownProps {
  onTriggerClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  ariaHaspopup: 'true'
  ariaPressed: 'true' | 'false'
}

/**
 * Dropdowns contain a list of actionable items within a Menu.
 */
const Dropdown = forwardRef(function Dropdown(
  props: DropdownProps,
  ref: Ref<HTMLDivElement>
) {
  const {
    className,
    triggerNode,
    isOpen,
    onChangeVisibility,
    canCloseOnClickOutside,
    canCloseOnEsc,
    canCloseOnItemClick,
    onClick,
    domNode,
    placement,
    items,
    nestedAlign,
    nestedPlacement,
    openNestedMenuOn,
    'aria-label': ariaLabel,
    fixedHeight,
    width,
    focusManager = 'modeless',
    ...rest
  } = props

  const {
    triggerRef,
    contentsRef,
    position,
    isInTheDOM,
    setIsInTheDOM,
  } = usePositionElement({
    isOpen,
    canCloseOnClickOutside,
    canCloseOnEsc,
    onChangeVisibility,
    placement,
    shouldPositionElement: true,
    focusManager,
  })
  const { theme } = useThemeContext()

  const triggerNodeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen && isInTheDOM) {
      triggerNodeRef?.current?.focus()
    }
  }, [isOpen, isInTheDOM])

  const handleClick = useCallback(
    (e: React.MouseEvent<any>) => {
      onClick && onClick(e)
      onChangeVisibility(!isOpen)
    },
    [onChangeVisibility, isOpen, onClick]
  )

  const handleMouseEnter = useCallback(() => {
    setIsInTheDOM(true)
  }, [setIsInTheDOM])

  const handleFocus = useCallback(() => {
    setIsInTheDOM(true)
  }, [setIsInTheDOM])

  const handleTouchStart = useCallback(() => {
    setIsInTheDOM(true)
  }, [setIsInTheDOM])

  const handleClickListItem = useCallback((): void => {
    onChangeVisibility(false)
  }, [onChangeVisibility])

  const processedItems = useMemo(() => {
    if (!canCloseOnItemClick) {
      return items
    }
    return items.map(item => {
      const { type, onClick, onKeyDown } = item
      if (type !== 'item') {
        return item
      }
      return {
        ...item,
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          if (canCloseOnItemClick && !item.items) {
            handleClickListItem()
          }
          onClick && onClick(e)
        },
        onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
          if (canCloseOnItemClick) {
            onChangeVisibility(false)
          }
          onKeyDown && onKeyDown(e)
        },
      }
    })
  }, [items, canCloseOnItemClick, handleClickListItem, onChangeVisibility])

  const getContents = () => {
    if (!isInTheDOM) {
      return null
    }
    const contents = (
      <div
        className={cx('hds-dropdown-menu-wrap', className, {
          'hds-dropdown-menu-wrap-is-visible': isOpen,
          [`hds-rpd-contents-${placement}`]: placement,
          'hds-rpd-contents-y-axis':
            placement && placement.match(/^(top|bottom)/),
          'hds-rpd-contents-x-axis':
            placement && placement.match(/^(left|right)/),
        })}
        ref={mergeRefs([contentsRef, ref])}
        tabIndex={focusManager === 'modeless' ? -1 : undefined}
        style={
          domNode && {
            ...position,
          }
        }
      >
        <Menu
          items={processedItems}
          nestedAlign={nestedAlign}
          nestedPlacement={nestedPlacement}
          openNestedMenuOn={openNestedMenuOn}
          width={width}
          fixedHeight={fixedHeight}
          aria-label={ariaLabel}
        />
      </div>
    )
    if (domNode) {
      return createPortal(
        <ThemeProvider theme={theme}>{contents}</ThemeProvider>,
        domNode
      )
    }
    return contents
  }

  return (
    <div
      {...rest}
      className={cx('hds-dropdown', {
        'hds-dropdown-open': isOpen,
        'hds-rpd-in-situ': !domNode,
      })}
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
      onTouchStart={handleTouchStart}
      ref={triggerRef}
    >
      <Action
        as="button"
        role="button"
        className="hds-dropdown-trigger"
        onClick={handleClick}
        aria-haspopup="true"
        aria-pressed={isOpen ? 'true' : 'false'}
        aria-label="Open the dropdown menu"
        ref={triggerNodeRef}
      >
        {triggerNode}
      </Action>
      {getContents()}
    </div>
  )
})

Dropdown.defaultProps = {
  canCloseOnItemClick: true,
  canCloseOnClickOutside: true,
  canCloseOnEsc: true,
  focusManager: 'modeless',
}

export default Dropdown
