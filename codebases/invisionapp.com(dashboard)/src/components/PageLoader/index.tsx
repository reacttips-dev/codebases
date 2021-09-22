import React, { forwardRef, Ref } from 'react'
import cx from 'classnames'
import { HTMLProps } from '../../helpers/omitType'

export interface PageLoaderProps extends HTMLProps<HTMLDivElement> {
  /**
   * If present, will determine the appearance of the loading animation. 0 means the
   * loading has not started, and 100 means the page is fully loaded.
   */
  loadingPercentage?: number
}

/**
 * PageLoaders show the loaded state of a document or page.
 */
const PageLoader = forwardRef(function PageLoader(
  props: PageLoaderProps,
  ref: Ref<HTMLDivElement>
) {
  const { loadingPercentage, className, ...rest } = props
  if (loadingPercentage != null) {
    return (
      <div
        {...rest}
        ref={ref}
        className={cx('hds-page-loader hds-page-loader-controlled', className, {
          'hds-page-loader-is-complete': loadingPercentage >= 100,
        })}
        style={{
          transform: `scaleX(${loadingPercentage / 100})`,
        }}
      />
    )
  }
  return (
    <div
      {...rest}
      ref={ref}
      className={cx('hds-page-loader hds-page-loader-uncontrolled', className)}
    />
  )
})

export default PageLoader
