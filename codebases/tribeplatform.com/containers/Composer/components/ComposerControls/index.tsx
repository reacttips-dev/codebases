import React, { FC, useEffect, useState } from 'react'

import { ReactQuillProps } from 'containers/Composer/@types'

import ComposerControls from './ComposerControls'

interface ComposerControlsLoaderProps {
  composerRef: ReactQuillProps['forwardedRef']
}

const ComposerControlsLoader: FC<ComposerControlsLoaderProps> = ({
  composerRef,
  children,
}) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <ComposerControls quill={composerRef?.current?.getQuill?.()}>
      {children}
    </ComposerControls>
  )
}

export default ComposerControlsLoader
