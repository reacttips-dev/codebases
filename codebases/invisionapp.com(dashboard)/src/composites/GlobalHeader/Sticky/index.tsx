/* eslint-env browser */
import React, { useEffect, useRef, CSSProperties, ReactNode } from 'react'

export const observeStickyElements = (
  element: HTMLDivElement,
  fn: (isStuck: boolean) => any
): (() => any) => {
  if (typeof IntersectionObserver === 'undefined') {
    return () => undefined
  }
  const observer = new IntersectionObserver(
    ([e]) => fn(e.intersectionRatio < 1),
    {
      threshold: [1],
    }
  )
  observer.observe(element)
  return () => {
    observer.unobserve(element)
  }
}

export interface ObserverProps {
  offsetTop?: number
  onStickyStateChange?: (stuck: boolean) => void
}

export const Observer = ({
  offsetTop = 0,
  onStickyStateChange,
}: ObserverProps) => {
  const observeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!observeRef.current) {
      return () => {}
    }

    const unsubscribe = observeStickyElements(observeRef.current, stuck => {
      onStickyStateChange && onStickyStateChange(stuck)
    })

    return () => {
      unsubscribe()
    }
  }, [observeRef, onStickyStateChange])

  return (
    <div className="hds-global-header-sticky-observer-container">
      <div
        className="hds-global-header-sticky-observer"
        ref={observeRef}
        style={{
          top: offsetTop * -1,
        }}
      />
    </div>
  )
}

export interface StickyProps {
  offsetTop?: number
  style?: CSSProperties
  onStickyStateChange?: (stuck: boolean) => void
  children?: ReactNode
}

const Sticky = ({
  offsetTop = 0,
  style,
  onStickyStateChange,
  children,
}: StickyProps) => {
  return (
    <>
      <Observer
        onStickyStateChange={onStickyStateChange}
        offsetTop={offsetTop}
      />
      <div
        className="hds-global-header-sticky-container"
        style={{ ...style, top: offsetTop }}
      >
        {children}
      </div>
    </>
  )
}

export default Sticky
