import React, { forwardRef, Ref, ReactNode } from 'react'
import cx from 'classnames'
import { HTMLProps } from '../../helpers/omitType'
import useWiggle from '../../hooks/useWiggle'

export type WigglerRenderPropProps = WigglerProps & {
  canCallWiggleEvent: boolean
  wiggleDirectionChanges: number
}

export interface WigglerProps extends HTMLProps<HTMLDivElement> {
  /**
   * How long to detect each wiggle.
   */
  wiggleCaptureDuration?: number
  /**
   * How long to ignore wiggles after an onWiggle event has fired.
   */
  wiggleGraceDuration?: number
  /**
   * The number of wiggles registed before the onWiggle event will fire
   */
  wiggleAmount?: number
  /**
   * Callback that gets fired whenever a wiggle event is detected.
   */
  onWiggle: () => void
  /**
   * Render prop which can be used to update UI based on the state of the wiggle.
   */
  children: (props: WigglerRenderPropProps) => ReactNode
}

/**
 * Wigglers are utility components to allow users to wiggle their mouse and magic can happen.
 */
const Wiggler = forwardRef(function Wiggler(
  props: WigglerProps,
  ref: Ref<HTMLDivElement>
) {
  const {
    children,
    className,
    wiggleCaptureDuration = 1000,
    wiggleGraceDuration = 2500,
    onWiggle,
    wiggleAmount = 10,
    ...rest
  } = props

  const { canCallWiggleEvent, wiggleDirectionChanges } = useWiggle({
    wiggleGraceDuration,
    wiggleCaptureDuration,
    onWiggle,
    wiggleAmount,
  })

  return (
    <div {...rest} ref={ref} className={cx('hds-wiggle', className)}>
      {children({
        ...props,
        canCallWiggleEvent,
        wiggleDirectionChanges,
      })}
    </div>
  )
})

Wiggler.defaultProps = {
  wiggleCaptureDuration: 1000,
  wiggleGraceDuration: 2500,
  wiggleAmount: 10,
}

export default Wiggler
