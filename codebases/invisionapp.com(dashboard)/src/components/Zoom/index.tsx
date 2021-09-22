import React, { forwardRef, Ref } from 'react'
import cx from 'classnames'
import { Omit, HTMLProps } from '../../helpers/omitType'
import IconButton from '../IconButton'
import Icon from '../../primitives/Icon'
import { ZoomSize } from './types'

export interface ZoomProps extends Omit<HTMLProps<HTMLDivElement>, 'size'> {
  /**
   * The current zoom level. Gets rendered in between the zoom-out and zoom-in icons.
   */
  zoomLevel: string
  /**
   * Callback that gets fired when a user clicks on the zoom-in button.
   */
  onZoomIn: (e: React.MouseEvent<HTMLButtonElement>) => any
  /**
   * Callback that gets fired whena  user clicks on the zoom-out button.
   */
  onZoomOut: (e: React.MouseEvent<HTMLButtonElement>) => any
  /**
   * The size of the IconButtons
   */
  size: ZoomSize
  /**
   * If true, will remove the shadow surrounding the Zoom. Useful if you're placing
   * the Zoom within a Toolbar.
   */
  hasBoxShadow?: boolean
}

/**
 * Zooms contain all the UI to handle zooming an application. The Zoom will not actually perform the zooming though, in order to remain environment-agnostic.
 */
const Zoom = forwardRef(function Zoom(
  props: ZoomProps,
  ref: Ref<HTMLDivElement>
) {
  const {
    className,
    zoomLevel,
    onZoomIn,
    onZoomOut,
    size,
    hasBoxShadow,
    ...rest
  } = props

  return (
    <div
      {...rest}
      ref={ref}
      className={cx('hds-zoom hds-space-x-8', className, {
        'hds-zoom-no-shadow': !hasBoxShadow,
        [`hds-h-${size}`]: size,
        'hds-p-8': size === '56',
        'hds-p-4': size === '48',
      })}
    >
      <IconButton
        as="button"
        onClick={onZoomOut}
        size="40"
        aria-label="Zoom Out"
      >
        <Icon
          name="ZoomOut"
          size="24"
          color="surface-100"
          aria-label="Zoom Out"
        />
      </IconButton>
      <div className="hds-zoom-level">{zoomLevel}</div>
      <IconButton as="button" onClick={onZoomIn} size="40" aria-label="Zoom In">
        <Icon name="Zoom" size="24" color="surface-100" aria-label="Zoom In" />
      </IconButton>
    </div>
  )
})

Zoom.defaultProps = {
  hasBoxShadow: true,
  size: '56',
}

export default Zoom
