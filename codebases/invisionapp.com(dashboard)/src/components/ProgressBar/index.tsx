import React, { useMemo, forwardRef, Ref } from 'react'
import cx from 'classnames'
import { HTMLProps } from '../../helpers/omitType'
import { ProgressBarColor } from './types'

export interface ProgressBarProps extends HTMLProps<HTMLDivElement> {
  /**
   * Changes the color of the ProgressBar.
   */
  barColor: ProgressBarColor
  /**
   * How far along, from 1-100 the ProgressBar is from completing.
   */
  progress: number
}
/**
 * ProgressBars inform the user of how much time is left to perform an action such as uploading an image.
 */
const ProgressBar = forwardRef(function ProgressBar(
  props: ProgressBarProps,
  ref: Ref<HTMLDivElement>
) {
  const { className, barColor, progress, ...rest } = props

  const parsedProgress = useMemo(() => {
    return Math.min(Math.max(progress, 0), 100)
  }, [progress])

  return (
    <div {...rest} ref={ref} className={cx('hds-progress-bar', className)}>
      <div
        className={cx('hds-progress-bar-progress', {
          [`hds-progress-bar-primary`]: barColor === 'primary-100',
          'hds-progress-bar-destructive': barColor === 'destructive-100',
        })}
        style={{
          width: `${parsedProgress}%`,
        }}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Currently ${progress}% complete`}
      />
    </div>
  )
})

export default ProgressBar
