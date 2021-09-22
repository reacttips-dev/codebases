import React, { useEffect, useState, forwardRef, Ref } from 'react'
import cx from 'classnames'
import { HTMLProps } from '../../helpers/omitType'
import { CursorColor, CursorPosition } from './types'
import { useThemeContext } from '../ThemeProvider'

export interface CursorProps extends HTMLProps<HTMLDivElement> {
  /**
   * Changes the color of the cursor.
   */
  color: CursorColor
}

/**
 * Cursors allow for some custom UI to replace the default browser cursor.
 */
const Cursor = forwardRef(function Cursor(
  props: CursorProps,
  ref?: Ref<HTMLDivElement>
) {
  const { className, children, color, ...rest } = props
  const [position, setPosition] = useState<CursorPosition>({
    left: 0,
    top: 0,
  })
  const [isHidden, setIsHidden] = useState(false)
  const { setIsCursorHidden } = useThemeContext()

  useEffect(() => {
    function setMousePosition(e: MouseEvent) {
      const { clientX: left, clientY: top } = e
      setPosition({ left, top })
    }
    function show() {
      setIsHidden(false)
    }
    function hide() {
      setIsHidden(true)
    }
    setIsCursorHidden(true)
    document.addEventListener('mousemove', setMousePosition)
    document.addEventListener('mouseenter', show)
    document.addEventListener('mouseleave', hide)
    return () => {
      setIsCursorHidden(false)
      document.removeEventListener('mousemove', setMousePosition)
      document.removeEventListener('mouseenter', show)
      document.removeEventListener('mouseleave', hide)
    }
  }, [])

  const lighterBackgroundList = ['pink', 'turquoise', 'yellow']
  return (
    <div
      {...rest}
      ref={ref}
      className={cx('hds-cursor', className, {
        'hds-hidden': isHidden,
      })}
      style={{ ...position }}
    >
      <svg
        width="14"
        height="19"
        viewBox="0 0 14 19"
        className={cx('hds-cursor-arrow', {
          [`hds-text-brand-${color}`]: color,
        })}
      >
        <defs>
          <polygon
            id="blue-copy-b"
            points=".25 16.75 .25 .75 12.25 11.25 5.25 11.25"
          />
          <filter
            id="blue-copy-a"
            width="191.7%"
            height="168.8%"
            x="-45.8%"
            y="-21.9%"
            filterUnits="objectBoundingBox"
          >
            <feOffset dy="2" in="SourceAlpha" result="shadowOffsetOuter1" />
            <feGaussianBlur
              in="shadowOffsetOuter1"
              result="shadowBlurOuter1"
              stdDeviation="1.5"
            />
            <feColorMatrix
              in="shadowBlurOuter1"
              values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.3 0"
            />
          </filter>
        </defs>
        <g>
          <use
            fill="#000"
            filter="url(#blue-copy-a)"
            xlinkHref="#blue-copy-b"
          />
          <use className="hds-fill-current" xlinkHref="#blue-copy-b" />
          <polygon
            stroke="#FFF"
            points=".25 16.75 5.25 11.25 12.25 11.25 .25 .75"
          />
        </g>
      </svg>
      <div
        className={cx('hds-cursor-text', {
          'hds-text-constants-white': !lighterBackgroundList.includes(color),
          'hds-text-constants-black': lighterBackgroundList.includes(color),
        })}
        style={{
          backgroundColor: `var(--hds-palette-brand-${color})`,
        }}
      >
        {children}
      </div>
    </div>
  )
})

export default Cursor
