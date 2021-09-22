import React, {
  ReactNode,
  useEffect,
  useCallback,
  forwardRef,
  Ref,
  useMemo,
} from 'react'
import cx from 'classnames'
import { createPortal } from 'react-dom'
import mergeRefs from 'react-merge-refs'
import { HTMLProps, Omit } from '../../helpers/omitType'
import usePositionElement from '../../hooks/usePositionElement'
import ThemeProvider, { useThemeContext } from '../ThemeProvider'

import { Placement, FocusManager } from '../../types'
import { ContextualMenuShouldShowOn } from './types'

export interface ContextualMenuProps
  extends Omit<HTMLProps<HTMLDivElement>, 'size'> {
  /**
   * The DOM node to render the ContextualMenu into, via a React Portal. If `shouldShowOn="right-click"`
   * then this prop is required, otherwise you may get unexpected results.
   */
  domNode?: HTMLElement
  /**
   * Render prop to create the trigger element for the ContextualMenu.
   */
  renderTrigger?: (p: RenderTriggerProps) => ReactNode
  /**
   * What action to toggle the appearance of the ContextualMenu on.
   */
  shouldShowOn?: ContextualMenuShouldShowOn
  /**
   * If using a trigger, will position the ContextualMenu relative to the trigger.
   */
  placement: Placement
  /**
   * Whether the ContextualMenu is currently visible or not.
   */
  isOpen: boolean
  /**
   * Callback that controls the visibility state of the ContextualMenu.
   */
  onChangeVisibility: (v: boolean) => void
  /**
   * If true, will close the ContextualMenu whenever you click outside the ContextualMenu or trigger.
   * If the shouldShowOn prop is 'right-click', this will always be true.
   */
  canCloseOnClickOutside?: boolean
  /**
   * If true, will close the ContextualMenu when pressing the escape key.
   */
  canCloseOnEsc?: boolean
  /**
   * Determines how the focus management occurs. modal will automatically focus the first focusable element,
   * whereas modeless will shift focus to the container and allow a user to tab to focus the first focusable element
   */
  focusManager?: FocusManager
}

interface RenderTriggerProps extends ContextualMenuProps {
  onTriggerClick: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const ContextualMenu = forwardRef(function ContextualMenu(
  props: ContextualMenuProps,
  ref: Ref<HTMLDivElement>
) {
  const {
    className,
    children,
    domNode,
    renderTrigger,
    shouldShowOn,
    placement,
    isOpen,
    onChangeVisibility,
    canCloseOnClickOutside,
    canCloseOnEsc,
    onClick,
    focusManager = 'modeless',
    ...rest
  } = props

  const {
    triggerRef,
    contentsRef,
    contentsDimensions,
    position,
    setPosition,
    isInTheDOM,
    setIsInTheDOM,
  } = usePositionElement({
    isOpen,
    canCloseOnClickOutside:
      canCloseOnClickOutside || shouldShowOn === 'right-click',
    canCloseOnEsc,
    onChangeVisibility,
    placement,
    shouldPositionElement: shouldShowOn === 'trigger',
    focusManager,
  })
  const { theme } = useThemeContext()

  const handleRightClickDown = useCallback(
    (e: MouseEvent) => {
      if (e.buttons === 2) {
        setIsInTheDOM(true)
      }
    },
    [setIsInTheDOM]
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const isInTrigger = triggerRef?.current?.contains(e.target as Node)
      const isInContents = contentsRef?.current?.contains(e.target as Node)
      const isOutsideOfRefs = !isInTrigger && !isInContents
      if ((e.key === ' ' || e.key === 'Enter') && isOutsideOfRefs) {
        onChangeVisibility(false)
      }
    },
    [onChangeVisibility, triggerRef, contentsRef]
  )

  const handleRightClick = useCallback(
    (e: MouseEvent) => {
      if (!contentsRef.current) {
        return null
      }
      e.preventDefault()
      e.stopPropagation()
      const { clientX, clientY } = e
      const { innerHeight, innerWidth } = window
      contentsDimensions.current = contentsRef.current.getBoundingClientRect()
      const buffer = 16
      const leftThreshold =
        innerWidth - buffer - contentsDimensions.current.width
      const topThreshold =
        innerHeight - buffer - contentsDimensions.current.height
      const left = clientX > leftThreshold ? leftThreshold : clientX
      const top = clientY > topThreshold ? topThreshold : clientY
      setPosition({
        left,
        top,
      })
      onChangeVisibility(true)
    },
    [onChangeVisibility, contentsDimensions, contentsRef, setPosition]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown, true)
    if (shouldShowOn === 'right-click') {
      document.addEventListener('mousedown', handleRightClickDown, true)
      document.addEventListener('contextmenu', handleRightClick, true)
    } else {
      document.removeEventListener('mousedown', handleRightClickDown, true)
      document.removeEventListener('contextmenu', handleRightClick, true)
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true)
      if (shouldShowOn === 'right-click') {
        document.removeEventListener('mousedown', handleRightClickDown, true)
        document.removeEventListener('contextmenu', handleRightClick, true)
      }
    }
  }, [shouldShowOn, handleRightClick, handleRightClickDown, handleKeyDown])

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

  const getContents = useMemo(() => {
    if (!isInTheDOM) {
      return null
    }
    const contents = (
      <div
        className={cx('hds-contextual-menu-contents hds-rpd-contents', {
          'hds-contextual-menu-contents-is-visible': isOpen,
          [`hds-rpd-contents-${placement}`]: placement,
          'hds-rpd-contents-y-axis':
            placement && placement.match(/^(top|bottom)/),
          'hds-rpd-contents-x-axis':
            placement && placement.match(/^(left|right)/),
        })}
        ref={contentsRef}
        tabIndex={focusManager === 'modeless' ? -1 : undefined}
        style={
          domNode && {
            ...position,
          }
        }
      >
        {children}
      </div>
    )
    if (domNode) {
      return createPortal(
        <ThemeProvider theme={theme}>{contents}</ThemeProvider>,
        domNode
      )
    }
    return contents
  }, [
    isInTheDOM,
    domNode,
    isOpen,
    position,
    children,
    contentsRef,
    placement,
    theme,
  ])

  return (
    <div
      {...rest}
      className={cx('hds-contextual-menu', className, {
        'hds-contextual-menu-open': isOpen,
        'hds-rpd-in-situ': !domNode,
      })}
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
      onTouchStart={handleTouchStart}
      ref={mergeRefs([triggerRef, ref])}
    >
      {shouldShowOn === 'trigger' &&
        renderTrigger!({ ...props, onTriggerClick: handleClick })}
      {getContents}
    </div>
  )
})

ContextualMenu.defaultProps = {
  canCloseOnClickOutside: true,
  canCloseOnEsc: true,
  shouldShowOn: 'trigger',
  focusManager: 'modeless',
}

export default ContextualMenu
