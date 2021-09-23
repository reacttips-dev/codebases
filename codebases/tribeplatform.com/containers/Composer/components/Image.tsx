import React, { useState, useCallback } from 'react'

import { Box } from '@chakra-ui/react'

import { Media, ThemeTokens } from 'tribe-api'
import { TribeUIProvider, Image } from 'tribe-components'

import { ImageBlotClassName } from '../constants'
import { ComposerMediaCompleteEvent } from '../hooks/useMediaUploadStatus'
import ComposerLoading from './Loading'
import ComposerMediaClose from './MediaClose'
import ComposerMediaError from './MediaError'

export interface ComposerImageProps {
  imageProps?: Record<string, string>
  isReadOnly: boolean
  src: string | null
  themeSettings?: ThemeTokens
  uploadPromise?: Promise<Media>
}

const ComposerImage = ({
  imageProps = {},
  isReadOnly,
  src,
  themeSettings,
  uploadPromise,
}: ComposerImageProps) => {
  const [loading, setLoading] = useState(!!uploadPromise)
  const [error, setError] = useState(false)
  const [source, setSource] = useState(src)
  const [dataId, setDataId] = useState(imageProps['data-id'] || null)

  const handleClick = useCallback(e => {
    const { target } = e
    const quillRoot = target.closest('.ql-editor')
    if (quillRoot) {
      quillRoot.dispatchEvent(new CustomEvent(ComposerMediaCompleteEvent))
    }

    const blot = target.closest('p') || target.closest(`.${ImageBlotClassName}`)
    blot.remove()
  }, [])

  if (uploadPromise) {
    uploadPromise
      .then(result => {
        if (!result[0]) return

        const { mediaUrl, mediaId } = result[0]

        setDataId(mediaId)
        setSource(mediaUrl)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
        setError(true)
      })
  }

  return (
    <TribeUIProvider themeSettings={themeSettings as ThemeTokens}>
      {loading && <ComposerLoading handleClose={handleClick} />}

      {error && <ComposerMediaError handleClose={handleClick} />}

      {source && (
        <Box
          background="bg.secondary"
          className={ImageBlotClassName}
          mt={5}
          pos="relative"
          display="flex"
          justifyContent="center"
        >
          {!isReadOnly && <ComposerMediaClose onClick={handleClick} />}

          <Image
            width={imageProps?.width ? `${imageProps.width}` : 'auto'}
            height={imageProps?.height ? `${imageProps.height}` : 'auto'}
            src={source}
            data-id={dataId}
            alt=""
            maxHeight={{ base: '70vh', '2xl': 'lg' }}
            objectFit="fill"
          />
        </Box>
      )}
    </TribeUIProvider>
  )
}

export default ComposerImage
