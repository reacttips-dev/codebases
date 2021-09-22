import React, { forwardRef, Ref, useState, useRef, useEffect } from 'react'
import cx from 'classnames'
import mergeRefs from 'react-merge-refs'
import { HTMLProps } from '../../helpers/omitType'

export interface A11yFocusProps extends HTMLProps<HTMLDivElement> {
  /**
   * Changes the color of the focus ring.
   */
  ringColor?: string
}

/**
 * A11yFocus adds a focus ring around every single tabbable element. It only needs to be added to your application once, usually at the very bottom of the tree, right before the closing tag.
 */
const A11yFocus = forwardRef(function A11yFocus(
  props: A11yFocusProps,
  ref: Ref<HTMLDivElement>
) {
  const { className, ringColor, ...rest } = props
  const [isVisible, setIsVisible] = useState(false)
  const ring = useRef<HTMLDivElement>()
  const hasHadKeyboardEvent = useRef(false)

  useEffect(() => {
    const offsetOf = (elem: Element) => {
      const rect = elem.getBoundingClientRect && elem.getBoundingClientRect()
      const clientLeft =
        document.documentElement.clientLeft || document.body.clientLeft
      const clientTop =
        document.documentElement.clientTop || document.body.clientTop
      const scrollLeft =
        window.pageXOffset ||
        document.documentElement.scrollLeft ||
        document.body.scrollLeft
      const scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop
      const left = rect ? rect.left + scrollLeft - clientLeft : 0
      const top = rect ? rect.top + scrollTop - clientTop : 0
      return {
        top: top || null,
        left: left || null,
      }
    }

    const setFocusRing = (activeElement: HTMLElement) => {
      const target = activeElement
      const ringElem = ring.current

      if (target && ringElem) {
        const offset = offsetOf(target)
        ringElem.style.left = `${offset.left}px`
        ringElem.style.top = `${offset.top}px`
        ringElem.style.width = `${target.offsetWidth}px`
        ringElem.style.height = `${target.offsetHeight}px`
      }
    }

    const handleAnimationEnd = (): void => {
      if (isVisible) {
        setFocusRing(document.activeElement as HTMLElement)
      }
    }

    const handleBlur = (e: FocusEvent) => {
      const target = e.target as HTMLElement
      if (target) {
        target.removeEventListener('animationend', handleAnimationEnd)
        target.removeEventListener('transitionend', handleAnimationEnd)
      }
      setIsVisible(false)
    }

    const handleKeyDown = () => {
      hasHadKeyboardEvent.current = true
    }

    const handleMouseDown = () => {
      hasHadKeyboardEvent.current = false
    }

    const handleFocus = (e: FocusEvent): void => {
      const target = e.target as HTMLElement
      if (target) {
        setFocusRing(target)
        target.addEventListener('animationend', handleAnimationEnd)
        target.addEventListener('transitionend', handleAnimationEnd)
      }
      if (hasHadKeyboardEvent) {
        setIsVisible(true)
      }
    }

    const handleScroll = (): void => {
      if (isVisible) {
        setFocusRing(document.activeElement as HTMLElement)
      }
    }
    document.addEventListener('keydown', handleKeyDown, true)
    document.addEventListener('mousedown', handleMouseDown, true)
    document.addEventListener('pointerdown', handleMouseDown, true)
    document.addEventListener('touchstart', handleMouseDown, true)
    document.addEventListener('focus', handleFocus, true)
    document.addEventListener('blur', handleBlur, true)
    document.addEventListener('scroll', handleScroll, true)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('pointerdown', handleMouseDown)
      document.removeEventListener('touchstart', handleMouseDown)
      document.removeEventListener('focus', handleFocus)
      document.removeEventListener('blur', handleBlur)
      document.removeEventListener('scroll', handleScroll)
    }
  }, [isVisible])

  return (
    <div
      {...rest}
      ref={mergeRefs([ref, ring])}
      className={cx('hds-a11y-focus', className, {
        'hds-a11y-focus-is-visible': isVisible,
      })}
      style={{
        boxShadow: `0 0 2px 3px ${ringColor}`,
      }}
    />
  )
})

A11yFocus.defaultProps = {
  ringColor: '#e0005a',
}

export default A11yFocus
