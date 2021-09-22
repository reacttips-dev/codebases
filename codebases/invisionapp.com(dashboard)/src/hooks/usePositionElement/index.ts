import { useState, useRef, useEffect, useCallback } from 'react'
import setPositionFromPlacement, {
  Position,
  Dimensions,
} from '../../helpers/setPositionFromPlacement'
import useOnClickOutside from '../useOnClickOutside'
import useKeys from '../useKeys'
import { Placement, FocusManager } from '../../types'

export interface UsePositionElementProps {
  canCloseOnEsc?: boolean
  canCloseOnClickOutside?: boolean
  onChangeVisibility: (v: boolean) => void
  placement: Placement
  isOpen: boolean
  shouldPositionElement: boolean
  focusManager: FocusManager
}

function usePositionElement({
  canCloseOnEsc,
  canCloseOnClickOutside,
  onChangeVisibility,
  placement,
  isOpen,
  shouldPositionElement = true,
  focusManager = 'modal',
}: UsePositionElementProps) {
  const [isInTheDOM, setIsInTheDOM] = useState(false)
  const [position, setPosition] = useState<Position>()
  const triggerRef = useRef<HTMLDivElement>(null)
  const contentsRef = useRef<HTMLDivElement>(null)
  const triggerDimensions = useRef<Dimensions>()
  const contentsDimensions = useRef<Dimensions>()
  const focusableElementsInTooltip = useRef<HTMLElement[]>([])

  useOnClickOutside({
    element: [triggerRef, contentsRef],
    callback: () => {
      canCloseOnClickOutside && onChangeVisibility(false)
    },
  })

  useKeys(
    'esc',
    () => {
      canCloseOnEsc && onChangeVisibility(false)
    },
    {
      keyup: false,
      keydown: true,
    }
  )

  const setTooltipPosition = useCallback(() => {
    const defaultDimensions = {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
    }
    if (!shouldPositionElement) {
      return
    }
    if (!contentsRef.current) {
      return
    }
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
  }, [placement, shouldPositionElement, contentsRef])

  useEffect(() => {
    window.addEventListener('resize', setTooltipPosition, true)

    return () => window.removeEventListener('resize', setTooltipPosition, true)
  }, [setTooltipPosition])

  useEffect(() => {
    if (isInTheDOM) {
      setTooltipPosition()
    }
  }, [isInTheDOM, placement, setTooltipPosition])

  useEffect(() => {
    if (!isInTheDOM || !contentsRef.current) {
      return
    }
    if (focusManager === 'modeless') {
      contentsRef.current.focus()
    } else {
      const focusable = Array.prototype.slice.call(
        contentsRef.current.querySelectorAll(
          'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]'
        )
      )
      focusableElementsInTooltip.current = focusable
    }
  }, [isInTheDOM, focusManager])

  useEffect(() => {
    if (isOpen) {
      const firstFocusable = focusableElementsInTooltip.current[0]
      setTimeout(() => {
        firstFocusable && firstFocusable.focus()
      }, 200)
    } else if (isInTheDOM) {
      triggerRef?.current?.focus()
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [isOpen, isInTheDOM])
  /* eslint-enable react-hooks/exhaustive-deps */

  return {
    position,
    setPosition,
    isInTheDOM,
    setIsInTheDOM,
    triggerRef,
    contentsRef,
    triggerDimensions,
    contentsDimensions,
  }
}

export default usePositionElement
