import { useEffect, useState, useRef } from 'react'

export interface UseWiggleProps {
  /**
   * How long to detect each wiggle.
   */
  wiggleCaptureDuration: number
  /**
   * How long to ignore wiggles after an onWiggle event has fired.
   */
  wiggleGraceDuration: number
  /**
   * The number of wiggles registed before the onWiggle event will fire
   */
  wiggleAmount: number
  /**
   * Callback that gets fired whenever a wiggle event is detected.
   */
  onWiggle: () => void
}

function useWiggle(props: UseWiggleProps) {
  const {
    wiggleCaptureDuration,
    wiggleGraceDuration,
    onWiggle,
    wiggleAmount,
  } = props

  const lastPositions = useRef({
    x: 0,
    y: 0,
    deltaX: 0,
    deltaY: 0,
  })

  const [wiggleDirectionChanges, setWiggleDirectionChanges] = useState(0)
  const [canCallWiggleEvent, setCanCallWiggleEvent] = useState(false)
  const wiggleDirectionChangesRef = useRef(wiggleDirectionChanges)
  wiggleDirectionChangesRef.current = wiggleDirectionChanges
  const canCallWiggleEventRef = useRef(canCallWiggleEvent)
  canCallWiggleEventRef.current = canCallWiggleEvent
  const intervalRef = useRef<any>()

  useEffect(() => {
    function detectWiggle(e: MouseEvent) {
      const { clientX: x, clientY: y } = e
      const lastX = lastPositions.current.x
      const lastY = lastPositions.current.y
      const lastDeltaX = lastPositions.current.deltaX
      const lastDeltaY = lastPositions.current.deltaY
      const deltaX = lastX - x
      const deltaY = lastY - y
      if (
        lastX == null &&
        lastY == null &&
        lastDeltaX == null &&
        lastDeltaY == null
      ) {
        lastPositions.current.x = x
        lastPositions.current.y = y
        lastPositions.current.deltaX = deltaX
        lastPositions.current.deltaY = deltaY
        return
      }

      if (Math.sign(lastDeltaX) + Math.sign(deltaX) === 0 && deltaX !== 0) {
        setWiggleDirectionChanges(c => c + 1)
      }

      lastPositions.current.x = x
      lastPositions.current.y = y
      if (deltaX !== 0) {
        lastPositions.current.deltaX = deltaX
      }
      if (deltaY !== 0) {
        lastPositions.current.deltaY = deltaY
      }
    }

    document.addEventListener('mousemove', detectWiggle)

    return () => {
      document.removeEventListener('mousemove', detectWiggle)
      clearInterval(intervalRef.current)
    }
  }, [])

  useEffect(() => {
    if (wiggleDirectionChanges === 1) {
      intervalRef.current = setInterval(() => {
        clearInterval(intervalRef.current)
        if (!canCallWiggleEventRef.current) {
          setWiggleDirectionChanges(0)
        }
      }, wiggleCaptureDuration)
    }
    if (wiggleDirectionChanges >= wiggleAmount) {
      setWiggleDirectionChanges(0)
      clearInterval(intervalRef.current)
      if (!canCallWiggleEvent) {
        setCanCallWiggleEvent(true)
        onWiggle()
        setTimeout(() => {
          if (canCallWiggleEventRef.current) {
            setCanCallWiggleEvent(false)
            setWiggleDirectionChanges(0)
            clearInterval(intervalRef.current)
          }
        }, wiggleGraceDuration)
      }
    }
  }, [
    wiggleDirectionChanges,
    canCallWiggleEvent,
    wiggleCaptureDuration,
    wiggleGraceDuration,
    onWiggle,
    wiggleAmount,
  ])

  return {
    canCallWiggleEvent,
    wiggleDirectionChanges,
  }
}

export default useWiggle
