import React, { useState } from 'react'

import { useClipboard } from '@chakra-ui/react'

import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  InputGroup,
  InputRightElement,
  TextInputProps,
  TextInput,
} from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import useInvitation from '../hooks/useInvitation'

export const InviteMemberMode: React.FC<TextInputProps> = ({
  name,
  label,
  error,
}) => {
  const { data, loading } = useInvitation()
  const { t } = useTranslation()
  const { onCopy } = useClipboard(data?.getMemberInvitationLink?.link)
  const [copied, setCopied] = useState(false)

  const copy = () => {
    onCopy()
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 3000)
  }

  return (
    <FormControl id={name} isInvalid={!!error}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <InputGroup size="md">
        {loading ? (
          <TextInput
            variant="filled"
            paddingRight={16}
            isTruncated
            value={`${t('userimport.link.loading', {
              defaultValue: 'Loading',
            })}...`}
            bgColor="bg.secondary"
            isReadOnly
          />
        ) : (
          <TextInput
            variant="filled"
            paddingRight={16}
            isTruncated
            textAlign={copied ? 'center' : 'left'}
            value={
              copied
                ? t('userimport.link.copied', 'Link copied')
                : data?.getMemberInvitationLink?.link
            }
            bgColor={copied ? 'accent.lite' : 'bg.secondary'}
            color={copied ? 'accent.base' : undefined}
            onClick={copy}
            isReadOnly
            data-testid="invitation-link"
          />
        )}
        {!copied && (
          <InputRightElement width="4.5rem">
            <Button
              variant="ghost"
              h="1.75rem"
              size="sm"
              onClick={copy}
              color="accent.base"
              data-testid="copy-invite-link"
            >
              <Trans i18nKey="userimport.manual.copy" defaults="Copy" />
            </Button>
          </InputRightElement>
        )}
      </InputGroup>
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  )
}
