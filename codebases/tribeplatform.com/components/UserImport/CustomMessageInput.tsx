import React, { ChangeEvent, useCallback, useState } from 'react'

import { Box } from '@chakra-ui/react'

import {
  CloseButton,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Link,
  Text,
  Textarea,
} from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import { includesUrl } from 'utils/validator.utils'

export const CUSTOM_MESSAGE_LIMIT = 1024

export const CustomMessageInput = ({ register, errors, setValue }) => {
  const { t } = useTranslation()
  const [showCustomMessage, setShowCustomMessage] = useState(false)
  const [customMessageLength, setCustomMessageLength] = useState(0)

  const close = () => {
    setValue('customMessage', '')
    setShowCustomMessage(false)
  }

  const customMessageLengthColor =
    customMessageLength < CUSTOM_MESSAGE_LIMIT
      ? 'label.secondary'
      : 'danger.base'

  const handleCustomMessageChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      setCustomMessageLength(event.target.value.length)
    },
    [],
  )

  if (showCustomMessage) {
    return (
      <Box position="relative">
        <FormControl
          id="customMessage"
          isInvalid={!!errors?.customMessage?.message}
        >
          <FormLabel textStyle="medium/medium" htmlFor="customMessage">
            <Trans
              i18nKey="userimport:custommessage.label"
              defaults="Custom message"
            />
          </FormLabel>
          <Textarea
            name="customMessage"
            onChange={handleCustomMessageChange}
            ref={register({
              validate: value => {
                if (includesUrl(value)) {
                  return t(
                    'userimport:custommessage.error.nourl',
                    'For security reasons, URLs are not allowed here',
                  )
                }
                return true
              },
            })}
            data-testid="custom-message-input"
          />
          <FormErrorMessage>{errors?.customMessage?.message}</FormErrorMessage>
          <Text
            data-testid="custom-message-length"
            textAlign="right"
            color={customMessageLengthColor}
          >
            {customMessageLength}/{CUSTOM_MESSAGE_LIMIT}
          </Text>
        </FormControl>
        <Box position="absolute" top="-1" right="0">
          <CloseButton
            onClick={close}
            data-testid="custom-message-remove"
            aria-label={t('common:close', 'Close')}
          />
        </Box>
      </Box>
    )
  }

  return (
    <Box>
      <FormLabel textStyle="medium/medium">
        <Trans
          i18nKey="userimport:custommessage.label"
          defaults="Custom message"
        />
      </FormLabel>
      <Text>
        <Trans i18nKey="userimport:custommessage.helperText">
          <Link
            color="accent.base"
            onClick={() => setShowCustomMessage(true)}
            href="#"
            data-testid="add-custom-message"
          >
            Add a custom message
          </Link>{' '}
          to the invitation
        </Trans>
      </Text>
    </Box>
  )
}
