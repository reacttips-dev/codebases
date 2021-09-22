import React, { ReactElement, forwardRef, Ref } from 'react'
import cx from 'classnames'
import { HTMLProps } from '../../helpers/omitType'

export interface SkeletonProps extends HTMLProps<HTMLDivElement> {
  /**
   * Used when masking an image/video with a Skeleton component. Adjusts the dimensions of the Skeleton to mimic the dimensions of the image
   */
  imageRatio?: number
  /**
   * Used when masking text that has a different line height to the regular 20px, for example if using a different Text style
   */
  height?: number
  /**
   * If true, the two gradient colors will be a shade darker. Useful for Skeleton loaders appearing on our darker background.
   */
  isDarker?: boolean
  /**
   * Sets the descriptive label for assistive technologies.
   */
  'aria-label': string
}
/**
 * Skeletons are our preferred page loading indicator. They take the shape of content, such as text or images, but not the structure of a page.
 */
const Skeleton = forwardRef(function Skeleton(
  props: SkeletonProps,
  ref: Ref<HTMLDivElement>
): ReactElement {
  const {
    className,
    imageRatio,
    height,
    'aria-label': ariaLabel,
    isDarker,
    style,
    ...rest
  } = props

  return (
    <div
      {...rest}
      ref={ref}
      className={cx('hds-skeleton', className, {
        'hds-skeleton-is-darker': isDarker,
      })}
      style={{
        ...style,
        height: height || undefined,
      }}
      role="progressbar"
    >
      <div
        className="hds-skeleton-inner"
        style={{
          paddingTop: `${imageRatio ? imageRatio * 100 : 100}%`,
        }}
      />
    </div>
  )
})

export default Skeleton
