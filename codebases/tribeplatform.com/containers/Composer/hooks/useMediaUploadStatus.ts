import { useState, useCallback, RefObject } from 'react'

import { ComposerRefImperativeHandle } from '../@types'

export const ComposerMediaCreateEvent = 'composer:mediaCreate'
export const ComposerMediaCompleteEvent = 'composer:mediaComplete'

interface MediaUploadStatusResponse {
  isMediaUploading: boolean
  onQuillMount: () => void
  onQuillUnmount: () => void
}

export const useMediaUploadStatus = (
  composerRef: RefObject<ComposerRefImperativeHandle>,
): MediaUploadStatusResponse => {
  const [isMediaUploading, setIsMediaUploading] = useState(false)

  const handleMediaCreate = useCallback(() => {
    setIsMediaUploading(true)
  }, [])

  const handleMediaComplete = useCallback(() => {
    setIsMediaUploading(false)
  }, [])

  const onQuillMount = useCallback(() => {
    const quill = composerRef?.current?.getQuill?.()
    if (quill?.root) {
      quill.root.addEventListener(ComposerMediaCreateEvent, handleMediaCreate)
      quill.root.addEventListener(
        ComposerMediaCompleteEvent,
        handleMediaComplete,
      )
    }
  }, [composerRef, handleMediaComplete, handleMediaCreate])

  const onQuillUnmount = useCallback(() => {
    const quill = composerRef?.current?.getQuill?.()
    if (quill?.root) {
      quill.root.removeEventListener(
        ComposerMediaCreateEvent,
        handleMediaCreate,
      )
      quill.root.removeEventListener(
        ComposerMediaCompleteEvent,
        handleMediaComplete,
      )
    }
  }, [composerRef, handleMediaComplete, handleMediaCreate])

  return { isMediaUploading, onQuillMount, onQuillUnmount }
}
