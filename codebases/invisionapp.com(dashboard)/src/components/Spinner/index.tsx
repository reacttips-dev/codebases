import React, { forwardRef, Ref } from 'react'
import cx from 'classnames'
import { Omit, HTMLProps } from '../../helpers/omitType'
import { SpinnerColor } from './types'
import { Size } from '../../types'

export interface SpinnerProps
  extends Omit<HTMLProps<SVGSVGElement>, 'color' | 'crossOrigin' | 'size'> {
  /**
   * Sets the color of the spinning ring
   */
  color: SpinnerColor
  /**
   * Sets the size of the Spinner
   */
  size: Size
  /**
   * Sets the descriptive label for assistive technologies.
   */
  'aria-label': string
}

/**
 * Spinners are used to indicate a state of loading, where there is an indeterminate loading time.
 */
const Spinner = forwardRef(function Spinner(
  props: SpinnerProps,
  ref: Ref<SVGSVGElement>
) {
  const { className, color, size, 'aria-label': ariaLabel, ...rest } = props
  return (
    <svg
      viewBox="0,0 200,200"
      {...rest}
      ref={ref}
      height={size}
      width={size}
      className={cx('hds-spinner', className, {
        [`hds-w-${size} hds-h-${size}`]: size,
        [`hds-text-${color}`]: color,
      })}
      aria-label={ariaLabel}
      role="alert"
      aria-busy="true"
    >
      <defs>
        <clipPath id="ring">
          <path
            d="M 200, 100
                     A 100, 100, 0, 1, 1, 197.81, 79.21
                     L 188.03, 81.29
                     A 90, 90, 0, 1, 0, 190, 100 z"
          />
        </clipPath>

        <filter id="blur" x="0" y="0">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
        </filter>

        <path
          id="p"
          d="M 250, 100
                        A 150, 150, 0, 0, 1, 246.72, 131.19
                        L 100, 100
                        A 0, 0, 0, 0, 0, 100, 100 z"
          fill="currentColor"
        />
      </defs>

      <g clipPath="url(#ring)">
        <g filter="url(#blur)" transform="rotate(-6 100 100)">
          <use xlinkHref="#p" fillOpacity="0" transform="rotate(  0 100 100)" />
          <use
            xlinkHref="#p"
            fillOpacity="0.03"
            transform="rotate( 12 100 100)"
          />
          <use
            xlinkHref="#p"
            fillOpacity="0.07"
            transform="rotate( 24 100 100)"
          />
          <use
            xlinkHref="#p"
            fillOpacity="0.1"
            transform="rotate( 36 100 100)"
          />
          <use
            xlinkHref="#p"
            fillOpacity="0.14"
            transform="rotate( 48 100 100)"
          />
          <use
            xlinkHref="#p"
            fillOpacity="0.17"
            transform="rotate( 60 100 100)"
          />
          <use
            xlinkHref="#p"
            fillOpacity="0.2"
            transform="rotate( 72 100 100)"
          />
          <use
            xlinkHref="#p"
            fillOpacity="0.24"
            transform="rotate( 84 100 100)"
          />
          <use
            xlinkHref="#p"
            fillOpacity="0.28"
            transform="rotate( 96 100 100)"
          />
          <use
            xlinkHref="#p"
            fillOpacity="0.31"
            transform="rotate(108 100 100)"
          />
          <use
            xlinkHref="#p"
            fillOpacity="0.34"
            transform="rotate(120 100 100)"
          />
          <use
            xlinkHref="#p"
            fillOpacity="0.38"
            transform="rotate(132 100 100)"
          />
          <use
            xlinkHref="#p"
            fillOpacity="0.41"
            transform="rotate(144 100 100)"
          />
          <use
            xlinkHref="#p"
            fillOpacity="0.45"
            transform="rotate(156 100 100)"
          />
          <use
            xlinkHref="#p"
            fillOpacity="0.48"
            transform="rotate(168 100 100)"
          />
          <use
            xlinkHref="#p"
            fillOpacity="0.52"
            transform="rotate(180 100 100)"
          />
          <use
            xlinkHref="#p"
            fillOpacity="0.55"
            transform="rotate(192 100 100)"
          />
          <use
            xlinkHref="#p"
            fillOpacity="0.59"
            transform="rotate(204 100 100)"
          />
          <use
            xlinkHref="#p"
            fillOpacity="0.62"
            transform="rotate(216 100 100)"
          />
          <use
            xlinkHref="#p"
            fillOpacity="0.66"
            transform="rotate(228 100 100)"
          />
          <use
            xlinkHref="#p"
            fillOpacity="0.69"
            transform="rotate(240 100 100)"
          />
          <use
            xlinkHref="#p"
            fillOpacity="0.7"
            transform="rotate(252 100 100)"
          />
          <use
            xlinkHref="#p"
            fillOpacity="0.72"
            transform="rotate(264 100 100)"
          />
          <use
            xlinkHref="#p"
            fillOpacity="0.76"
            transform="rotate(276 100 100)"
          />
          <use
            xlinkHref="#p"
            fillOpacity="0.79"
            transform="rotate(288 100 100)"
          />
          <use
            xlinkHref="#p"
            fillOpacity="0.83"
            transform="rotate(300 100 100)"
          />
          <use
            xlinkHref="#p"
            fillOpacity="0.86"
            transform="rotate(312 100 100)"
          />
          <use
            xlinkHref="#p"
            fillOpacity="0.93"
            transform="rotate(324 100 100)"
          />
          <use
            xlinkHref="#p"
            fillOpacity="0.97"
            transform="rotate(336 100 100)"
          />
          <use xlinkHref="#p" fillOpacity="1" transform="rotate(348 100 100)" />
        </g>
      </g>
    </svg>
  )
})

Spinner.defaultProps = {
  color: 'surface-100',
  'aria-label': 'Loading',
}

export default Spinner
