import React, {
  forwardRef,
  Ref,
  useState,
  useRef,
  useCallback,
  useEffect,
} from 'react'
import cx from 'classnames'
import mergeRefs from 'react-merge-refs'
import { HTMLProps } from '../../helpers/omitType'
import { TruncatePlacement } from './types'

interface ITruncateString {
  text: string
  ellipsisString: string
  measurements: {
    box: number
    ellipse: number
    child: number
  }
  truncationFactor: number
  leftPercentage: number
}

export const truncateString = ({
  text,
  ellipsisString,
  measurements,
  truncationFactor,
  leftPercentage,
}: ITruncateString) => {
  if (!text) {
    return ''
  }
  if (measurements.child > measurements.box) {
    const size = (percentage: number): number =>
      measurements.box * (percentage / 100)

    const portion = (size: number): number =>
      Math.floor((text.length * size * truncationFactor) / measurements.child)

    const left = text.slice(
      0,
      Math.max(0, portion(size(leftPercentage)) - ellipsisString.length)
    )

    const right = text.slice(
      text.length - portion(size(100 - leftPercentage)) + ellipsisString.length,
      text.length
    )

    return `${left}${ellipsisString}${right}`
  }
  return text
}

export interface TruncateProps extends HTMLProps<HTMLDivElement> {
  /**
   * The origin of the truncation.
   */
  placement: TruncatePlacement
  /**
   * The string to truncate.
   */
  children: string
  /**
   * Changes how the truncation is calculated. Only used if placement="center"
   */
  truncationFactor?: number
  /**
   * If true, will show the truncated text outside of the bounds of the containing box.
   */
  shouldOverflowText?: boolean
}

/**
 * Truncates will truncate text when space is at a premium.
 */
const Truncate = forwardRef(function Truncate(
  props: TruncateProps,
  ref: Ref<HTMLDivElement>
) {
  const {
    className,
    children,
    placement,
    truncationFactor = 1,
    shouldOverflowText,
    ...rest
  } = props
  const box = useRef<HTMLDivElement>(null)
  const child = useRef<HTMLDivElement>(null)
  const ellipse = useRef<HTMLDivElement>(null)

  const getTruncatedString = useCallback(() => {
    if (
      !box ||
      !box.current ||
      !ellipse ||
      !ellipse.current ||
      !child ||
      !child.current
    ) {
      return
    }

    const measurements = {
      box: box.current.offsetWidth,
      ellipse: ellipse.current.offsetWidth,
      child: child.current.offsetWidth,
    }

    const leftPercentage = 50

    return truncateString({
      measurements,
      text: children,
      truncationFactor,
      ellipsisString: '…',
      leftPercentage,
    })
  }, [truncationFactor, children])

  const [isTruncating, setIsTruncating] = useState(true)
  const [truncatedString, setTruncatedString] = useState(getTruncatedString())

  function handleResize() {
    setIsTruncating(true)
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize, true)
    return () => window.removeEventListener('resize', handleResize, true)
  })

  useEffect(() => {
    setIsTruncating(true)
  }, [children, truncationFactor])

  useEffect(() => {
    if (isTruncating) {
      setTruncatedString(getTruncatedString())
      setIsTruncating(false)
    }
  }, [isTruncating, children, getTruncatedString])

  return (
    <div
      {...rest}
      ref={mergeRefs([box, ref])}
      className={cx('hds-truncate', className, {
        'hds-truncate-should-overflow': shouldOverflowText,
        'hds-truncate-start': placement === 'start',
        'hds-truncate-end': placement === 'end',
        'hds-truncate-center': placement === 'center',
      })}
      title={children}
    >
      {placement === 'center' ? (
        <>
          {isTruncating && <span ref={child}>{children}</span>}
          {isTruncating && <span ref={ellipse}>…</span>}
          {!isTruncating && truncatedString}
        </>
      ) : (
        children
      )}
    </div>
  )
})

Truncate.defaultProps = {
  truncationFactor: 1,
}

export default Truncate
