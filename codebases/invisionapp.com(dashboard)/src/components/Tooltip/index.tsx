/* eslint-disable react/jsx-indent */
import React, {
  ReactNode,
  useState,
  useCallback,
  useRef,
  useEffect,
  forwardRef,
  Ref,
} from 'react'
import { createPortal } from 'react-dom'
import cx from 'classnames'
import mergeRefs from 'react-merge-refs'
import { HTMLProps } from '../../helpers/omitType'
import setPositionFromPlacement, {
  Position,
  Dimensions,
} from '../../helpers/setPositionFromPlacement'
import { ENTER_KEY, SPACE_KEY } from '../../helpers/keyCodes'
import useOnClickOutside from '../../hooks/useOnClickOutside'
import ThemeProvider, { useThemeContext } from '../ThemeProvider'
import useFocusVisibleWithProps from '../../hooks/useFocusVisibleWithProps'
import { TooltipBackgroundColor, TooltipShowOn } from './types'
import { Placement } from '../../types'

export interface TooltipProps extends HTMLProps<HTMLDivElement> {
  /**
   * The interaction to show the Tooltip on
   */
  showOn?: TooltipShowOn
  /**
   * A React node that is the hoverable element to make the Tooltip appear.
   */
  trigger: ReactNode
  /**
   * The DOM node to render the Tooltip into, via a React Portal. If null, will render in place.
   */
  domNode?: Element
  /**
   * Where to place the Tooltip relative to the trigger.
   */
  placement?: Placement
  /**
   * Sets a maximum height on the Tooltip.
   */
  maxHeight?: number
  /**
   * Sets a maximum width on the Tooltip.
   */
  maxWidth?: number
  /**
   * Id for the tooltip. The trigger references this in aria-describedby.
   */
  tooltipId?: string
  /**
   * TabIndex of Tooltip. Default is 0, but use -1 for for removing from tabbing order entirely.
   */
  tabIndex?: number
  /**
   * Changes the background color of the Tooltip. Will also change the text color.
   */
  backgroundColor?: TooltipBackgroundColor
  /**
   * If true will only show the trigger, and not the Tooltip contents
   */
  disabled?: boolean
  /**
   * If true, will delay the appearance of the Tooltip by the delayDuration prop in milliseconds. Useful if you have a lot of Tooltips in a small space of UI.
   */
  hasDelay?: boolean
  /**
   * The delay to display the Tooltip, in milliseconds. Only used if hasDelay is true
   */
  delayDuration?: number
}

/**
 * Tooltips are text labels that appear on hover or click.
 */
const Tooltip = forwardRef(function Tooltip(
  props: TooltipProps,
  ref: Ref<HTMLDivElement>
) {
  const {
    className,
    trigger,
    domNode,
    showOn = 'hover',
    children,
    placement = 'bottom-center',
    hasDelay,
    delayDuration = 350,
    maxHeight,
    maxWidth,
    tooltipId,
    tabIndex = 0,
    'aria-label': ariaLabel,
    backgroundColor = 'surface-100',
    onClick,
    onMouseEnter,
    onMouseLeave,
    onKeyDown,
    onBlur,
    onFocus,
    disabled,
    ...rest
  } = props
  const [isInTheDOM, setIsInTheDOM] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [position, setPosition] = useState<Position>()
  const triggerRef = useRef<HTMLDivElement>(null)
  const contentsRef = useRef<HTMLDivElement>(null)
  const triggerDimensions = useRef<Dimensions>()
  const contentsDimensions = useRef<Dimensions>()
  const isNavigatingUsingKeyboard = useRef<boolean>(false)
  const focusableElementsInTooltip = useRef<HTMLElement[]>([])
  const { theme } = useThemeContext()

  const {
    focusVisible,
    onFocus: fvOnFocus,
    onBlur: fvOnBlur,
  } = useFocusVisibleWithProps<HTMLDivElement>(props)

  useOnClickOutside({
    element: [triggerRef, contentsRef],
    shouldDisableEventBubbling: false,
    callback: () => {
      setIsVisible(false)
    },
  })

  useEffect(() => {
    function setTooltipPosition() {
      if (!triggerRef.current || !contentsRef.current) {
        return null
      }
      const defaultDimensions = {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
      }
      triggerDimensions.current = triggerRef.current.getBoundingClientRect()
      contentsDimensions.current = contentsRef.current.getBoundingClientRect()
      const bodyRect = document.body.getBoundingClientRect()
      const triggerRect =
        triggerRef?.current?.getBoundingClientRect() || defaultDimensions
      const contentsRect = contentsRef?.current?.getBoundingClientRect()
      triggerDimensions.current = {
        left: triggerRect.left - bodyRect.left,
        top: triggerRect.top - bodyRect.top,
        width: triggerRect.width,
        height: triggerRect.height,
      }
      contentsDimensions.current = {
        left: contentsRect.left - bodyRect.left,
        top: contentsRect.top - bodyRect.top,
        width: contentsRect.width,
        height: contentsRect.height,
      }
      const result = setPositionFromPlacement(
        placement,
        triggerDimensions.current,
        contentsDimensions.current
      )
      setPosition({
        left: Math.round(result.left),
        top: Math.round(result.top),
      })
    }
    if (isInTheDOM) {
      setTooltipPosition()
    }
    if (showOn === 'hover') {
      if (focusVisible) {
        setTooltipPosition()
        setIsVisible(true)
      } else if (!isHovered) {
        setIsVisible(false)
      } else if (isHovered || isFocused) {
        setTooltipPosition()

        setIsVisible(true)
      }
    }
  }, [isInTheDOM, showOn, placement, isHovered, isFocused, focusVisible])

  useEffect(() => {
    if (!isInTheDOM || !contentsRef.current) {
      return
    }
    const focusable = Array.prototype.slice.call(
      contentsRef.current.querySelectorAll(
        'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]'
      )
    )
    focusableElementsInTooltip.current = focusable
  }, [children, isInTheDOM])

  useEffect(() => {
    if (showOn === 'hover') {
      return
    }
    if (isVisible) {
      contentsRef?.current?.focus()
    } else if (isInTheDOM) {
      setTimeout(() => {
        triggerRef?.current?.focus()
      }, 0)
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [isVisible, isInTheDOM, showOn])
  /* eslint-enable react-hooks/exhaustive-deps */

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      isNavigatingUsingKeyboard.current = false
      onClick && onClick(e)
      setIsVisible(!isVisible)
    },
    [isVisible, onClick]
  )

  const handleInit = useCallback(() => {
    if (!isInTheDOM) {
      setIsInTheDOM(true)
    }
  }, [isInTheDOM])

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      onMouseEnter && onMouseEnter(e)
      handleInit()
      setIsHovered(true)
    },
    [handleInit, onMouseEnter]
  )

  const handleTouchStart = useCallback(() => {
    handleInit()
  }, [handleInit])

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      onMouseLeave && onMouseLeave(e)
      if (isHovered) {
        setIsHovered(false)
      }
    },
    [isHovered, onMouseLeave]
  )

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      handleInit()
      fvOnFocus(e)
      if (!isFocused) {
        setIsFocused(true)
      }
    },
    [isFocused, handleInit, fvOnFocus]
  )

  const handleClickFocus = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      handleFocus(e)
      if (!isInTheDOM) {
        setIsInTheDOM(true)
      }
    },
    [isInTheDOM, handleFocus]
  )

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      fvOnBlur(e)
      if (isFocused) {
        setIsFocused(false)
      }
    },
    [isFocused, fvOnBlur]
  )

  const handleContentsBlur = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      if (e.currentTarget.contains(e.relatedTarget as Node)) {
        return
      }
      fvOnBlur(e)
      e.preventDefault()

      if (isNavigatingUsingKeyboard.current) {
        setIsHovered(false)
        setIsVisible(false)
        setIsFocused(false)
      }
    },
    [fvOnBlur]
  )

  const focusElement = useCallback((type: 'next' | 'previous') => {
    const currentlyActive = document.activeElement as HTMLElement
    const focusable = focusableElementsInTooltip.current
    if (!focusable.length) {
      return
    }
    const firstFocusable = focusable[0]
    const lastFocusable = focusable[focusable.length - 1]
    const currentlyFocusedIndex = currentlyActive
      ? focusable.indexOf(currentlyActive)
      : -1

    let itemToFocus = firstFocusable
    if (currentlyFocusedIndex === -1 && type === 'previous') {
      itemToFocus = lastFocusable
    }
    if (type === 'next') {
      itemToFocus =
        currentlyFocusedIndex === focusable.length - 1
          ? firstFocusable
          : focusable[currentlyFocusedIndex + 1]
    } else if (type === 'previous') {
      itemToFocus =
        currentlyFocusedIndex === 0
          ? lastFocusable
          : focusable[currentlyFocusedIndex - 1]
    }
    itemToFocus.focus()
  }, [])

  const handleContentsMouseDown = useCallback(() => {
    isNavigatingUsingKeyboard.current = false
  }, [])

  const handleContentsKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        focusElement('next')
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        focusElement('previous')
      }
    },
    [focusElement]
  )

  const handleClickKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.keyCode === ENTER_KEY || e.keyCode === SPACE_KEY) {
        isNavigatingUsingKeyboard.current = true
        setIsVisible(!isVisible)
      }
    },
    [isVisible]
  )

  const getContents = () => {
    if (!isInTheDOM || disabled) {
      return null
    }
    let style: React.CSSProperties = {}
    if (domNode) {
      style = { ...position }
    }
    if (hasDelay && isVisible) {
      style.transitionDelay = `${delayDuration}ms, ${delayDuration}ms`
    }
    const contents = (
      <div
        className={cx(
          'hds-tooltip-contents hds-rpd-contents hds-type-scale-body-12',
          {
            'hds-tooltip-contents-0': backgroundColor === 'surface-0',
            'hds-tooltip-contents-100': backgroundColor === 'surface-100',
            'hds-tooltip-contents-is-visible': isVisible,
            [`hds-rpd-contents-${placement}`]: placement,
            'hds-rpd-contents-y-axis': placement.match(/^(top|bottom)/),
            'hds-rpd-contents-x-axis': placement.match(/^(left|right)/),
            'hds-tooltip-contents-inert': showOn === 'hover',
          }
        )}
        id={tooltipId}
        ref={mergeRefs([contentsRef, ref])}
        tabIndex={-1}
        style={style}
        role="presentation"
        onMouseDown={handleContentsMouseDown}
        onKeyDown={handleContentsKeyDown}
        onBlur={handleContentsBlur}
      >
        <div
          className={cx('hds-tooltip-contents-inner', {
            'hds-tooltip-contents-overflow': maxHeight,
          })}
          style={{
            maxHeight: maxHeight || undefined,
            maxWidth: maxWidth || undefined,
          }}
        >
          {children}
          <div
            aria-hidden="true"
            className={cx('hds-tooltip-chevron', {
              [`hds-text-${backgroundColor}`]: backgroundColor,
            })}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="6"
              viewBox="0 0 18 6"
            >
              <path
                className="hds-fill-current"
                d="M9.68566256,0.293886673 L13.982771,4.54522641 C14.8564607,5.40961041 16.0154858,5.9197451 17.2367535,5.98392135 L17.5579279,5.99179124 L17.5579279,5.99179124 L0.44,5.99207717 C1.75586174,5.99126792 3.01836223,5.47177394 3.95372217,4.54625001 L8.25127747,0.293886673 C8.64737197,-0.0979622243 9.28956805,-0.0979622243 9.68566256,0.293886673 Z"
              />
            </svg>
          </div>
        </div>
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

  const handlers =
    showOn === 'click'
      ? {
          onClick: handleClick,
          onMouseEnter: handleMouseEnter,
          onMouseLeave: handleMouseLeave,
          onKeyDown: handleClickKeyDown,
          onFocus: handleClickFocus,
          onBlur: handleBlur,
          onTouchStart: handleTouchStart,
        }
      : {
          onMouseEnter: handleMouseEnter,
          onMouseLeave: handleMouseLeave,
          onFocus: handleFocus,
          onBlur: handleBlur,
          onTouchStart: handleTouchStart,
        }
  const spreadHandlers = disabled ? {} : handlers

  return (
    <div
      {...rest}
      className={cx('hds-tooltip', className, {
        'hds-rpd-in-situ': !domNode,
      })}
      aria-expanded={isVisible}
      aria-describedby={tooltipId}
      aria-label={ariaLabel}
    >
      <div
        className={cx('hds-tooltip-trigger', {
          'hds-focus-visible': focusVisible,
        })}
        tabIndex={tabIndex}
        role="button"
        {...spreadHandlers}
        ref={triggerRef}
      >
        {trigger}
      </div>
      {getContents()}
    </div>
  )
})

Tooltip.defaultProps = {
  showOn: 'hover',
  tabIndex: 0,
  placement: 'bottom-center',
  backgroundColor: 'surface-100',
  delayDuration: 350,
}

export default Tooltip
