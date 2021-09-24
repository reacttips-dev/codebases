/* eslint-disable import/order, global-require */
import React from 'react'
import dynamic from 'next/dynamic'
import { ComposerRefImperativeHandle, ReactQuillProps } from './@types'

export { ComposerReadonly } from './ComposerReadonly'

// used https://github.com/FormidableLabs/jest-next-dynamic but it does not working on ci pipeline
const ComposerComponent = dynamic(import('./Composer'), { ssr: false })
const ComposerControlsComponent = dynamic(
  import('./components/ComposerControls'),
  { ssr: false },
)

const ForwardedComposer = React.forwardRef<
  ComposerRefImperativeHandle,
  ReactQuillProps
>(
  (props, ref): JSX.Element => (
    <ComposerComponent {...props} forwardedRef={ref} />
  ),
)

export const ComposerWidget =
  process.env.NODE_ENV === 'test'
    ? require('./Composer').default
    : ForwardedComposer

export const ComposerControls =
  process.env.NODE_ENV === 'test'
    ? require('./components/ComposerControls').default
    : ComposerControlsComponent
