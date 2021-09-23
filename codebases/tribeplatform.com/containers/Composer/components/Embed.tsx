import React, { useEffect, useState, useRef, useCallback } from 'react'

import { Box } from '@chakra-ui/react'
import Quill from 'quill'

import { Embed, ThemeTokens } from 'tribe-api/interfaces'
import { Input, TribeUIProvider, useDebounce } from 'tribe-components'

import { getGlobalTribeSettings } from 'lib/dom/window'

import ComposerLoading from './Loading'
import ComposerMediaClose from './MediaClose'

export interface ComposerEmbedProps {
  initialEmbed?: Embed
  isReadOnly: boolean
  handleEmbedPaste?: (value: string) => any
  handleEmbedInvalid?: () => void
  quill?: Quill | null
  placeholder?: string
  themeSettings?: Record<string, any>
}

const ComposerEmbed = ({
  initialEmbed,
  isReadOnly,
  handleEmbedPaste,
  handleEmbedInvalid,
  quill,
  placeholder,
  themeSettings,
}: ComposerEmbedProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const previewRef = useRef(null)
  const [value, setValue] = useState(initialEmbed?.url || '')
  const debouncedValue = useDebounce(value, 300)

  const [embedObject, setEmbedObject] = useState(initialEmbed)
  const [embedLoading, setEmbedLoading] = useState(false)

  const handleClose = useCallback(
    e => {
      const { target } = e
      const blot =
        target.closest('[data-type="embed"]') || target.closest(`.embed`)
      blot.remove()
      const range = quill.getSelection()
      if (range == null) return
      quill.insertText(range.index, value, {
        link: value,
      })
    },
    [embedObject],
  )

  const handleError = () => {
    setValue('')
    if (handleEmbedInvalid) {
      handleEmbedInvalid()
    }
  }

  const handleInputPaste = useCallback(
    async e => {
      e.preventDefault()
      const value = e.clipboardData.getData('Text')
      // eslint-disable-next-line no-useless-escape
      const urlRegex = /(\b(https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi
      if (!urlRegex.test(value) && handleEmbedInvalid) {
        handleEmbedInvalid()
        return
      }
      setEmbedLoading(true)
      setValue(value)
      if (handleEmbedPaste) {
        try {
          const embed = await handleEmbedPaste(value)
          setEmbedLoading(false)
          if (embed?.data?.embed?.html) {
            setEmbedObject(embed.data.embed)
          } else {
            handleError()
          }
        } catch (e) {
          handleError()
        }
      }
    },
    [handleEmbedPaste],
  )

  useEffect(() => {
    if (inputRef?.current) {
      inputRef.current.focus()
    }
  }, [])

  const PreviewProps = {}

  if (embedObject?.html) {
    // eslint-disable-next-line dot-notation
    PreviewProps['dangerouslySetInnerHTML'] = { __html: embedObject.html }
  }

  const currentThemeSettings =
    themeSettings || getGlobalTribeSettings('themeSettings')

  return (
    <TribeUIProvider themeSettings={currentThemeSettings as ThemeTokens}>
      <Box
        className="embed"
        // Return (enter) issues in edit mode.
        width={isReadOnly ? '100%' : '99%'}
        mt={3}
        pos="relative"
        display="inline-block"
        data-embed-id={embedObject?.id}
      >
        {!isReadOnly && !embedObject && (
          <Input
            width="100%"
            px={1}
            id="embed-input"
            color="accent.base"
            outline="none"
            value={debouncedValue}
            placeholder={placeholder}
            autoFocus
            onPaste={handleInputPaste}
            textStyle="regular/medium"
            ref={inputRef}
            variant="unstyled"
            sx={{
              _placeholder: {
                color: 'label.secondary',
                fontSize: 'md',
              },
            }}
          />
        )}

        {embedLoading && <ComposerLoading handleClose={handleClose} />}

        {!embedLoading && embedObject && (
          <Box className="preview" pos="relative" width="100%">
            <Box as="figure" ref={previewRef} {...PreviewProps} />

            {!isReadOnly && <ComposerMediaClose onClick={handleClose} />}
          </Box>
        )}
      </Box>
    </TribeUIProvider>
  )
}

export default ComposerEmbed
