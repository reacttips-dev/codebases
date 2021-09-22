import React, { useState, useEffect, forwardRef, Ref, useMemo } from 'react'
import cx from 'classnames'
import { Omit, HTMLProps } from '../../helpers/omitType'
import IconButton from '../IconButton'
import Icon from '../../primitives/Icon'
import { BannerTextAlignment, BannerColor } from './types'

export interface BannerProps extends Omit<HTMLProps<HTMLDivElement>, 'size'> {
  /**
   * The alignment of the text within the Banner.
   */
  textAlignment?: BannerTextAlignment
  /**
   * If true, an IconButton will display allowing the user to dismiss the component.
   */
  isDismissable?: boolean
  /**
   * Changes the background color of the Banner
   */
  color: BannerColor
  /**
   * Optional callback that gets fired when the user clicks the dismiss IconButton
   */
  onDismiss?: () => void
}
/**
 * Banners are small bars of information (normally one sentence) that sit above the page’s content.
 */
const Banner = forwardRef(function Banner(
  props: BannerProps,
  ref: Ref<HTMLDivElement>
) {
  const {
    className,
    children,
    isDismissable,
    color,
    textAlignment,
    onDismiss,
    ...rest
  } = props
  const [isLeaving, setIsLeaving] = useState(false)
  const [isInDOM, setIsInDOM] = useState(true)

  useEffect(() => {
    if (isLeaving) {
      const timer = setTimeout(() => {
        setIsInDOM(false)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [isLeaving])

  const textColor = useMemo(() => {
    if (color === 'surface-20') {
      return 'surface-100'
    }
    if (color === 'surface-100') {
      return 'surface-0'
    }
    return 'constants-white'
  }, [color])

  function handleClick() {
    onDismiss && onDismiss()
    setIsLeaving(true)
  }

  if (!isInDOM) {
    return null
  }

  return (
    <div
      {...rest}
      ref={ref}
      className={cx('hds-banner hds-type-scale-heading-14', className, {
        [`hds-bg-${color}`]: color,
        [`hds-text-${textColor}`]: textColor,
        [`hds-banner-align-${textAlignment}`]: textAlignment,
        'hds-banner-out': isLeaving,
        'hds-banner-is-dismissable': isDismissable,
      })}
    >
      {children}
      {isDismissable && (
        <IconButton
          className="hds-banner-dismiss-action"
          onClick={handleClick}
          as="button"
          type="button"
          aria-label="Dismiss the banner"
          size="24"
        >
          <Icon name="Close" size="16" color={textColor} isDecorative />
        </IconButton>
      )}
    </div>
  )
})

export default Banner
