import React, { useState } from 'react'
import styled from 'styled-components'
import {
  Checkbox,
  Illustration as HeliosIllustration,
  LoadingDots,
  Text,
  Padded,
  Spaced
} from '@invisionapp/helios'
import { CustomDialog } from '../CustomDialog'

type DeleteConfirmationDialogProps = {
  positiveText: string
  negativeText: string
  extraConfirmationText?: string
  negativeDisbled?: boolean
  loading?: boolean
  onBack?: () => void
  onConfirm?: () => void
  open?: boolean
  illustration: string
  title: any
  subtitle?: any
}

export const DeleteConfirmationDialog = (props: DeleteConfirmationDialogProps) => {
  const {
    positiveText,
    negativeText,
    extraConfirmationText = '',
    negativeDisbled = false,
    loading = false,
    onBack = () => {},
    onConfirm = () => {},
    open = false,
    illustration,
    title,
    subtitle
  } = props

  const [agreeChecked, setAgreeChecked] = useState(false)

  const positiveButtonText = loading ? <LoadingDots color="white" /> : positiveText

  return (
    <CustomDialog
      aria-label="Confirmation to delete a team resource"
      closeOnEsc
      closeOnOverlay
      negativeText={negativeText}
      onRequestClose={() => {}}
      onRequestNegative={() => onBack()}
      onRequestPositive={() => onConfirm()}
      positiveText={positiveButtonText as string}
      open={open}
      disableAutofocus
      negativeDisabled={negativeDisbled || loading}
      positiveDisabled={(extraConfirmationText && !agreeChecked) || loading}
    >
      <Wrapper>
        <Spaced bottom="s">
          <Illustration order="scene">
            <img alt={title} src={illustration} />
          </Illustration>
        </Spaced>
        <Text className="title" order="title" size="smaller">
          {title}
        </Text>
        {subtitle && (
          <Padded bottom="s">
            <Text order="body" size="larger">
              {subtitle}
            </Text>
          </Padded>
        )}
        {extraConfirmationText && (
          <Subtitle>
            <Checkbox
              disabled={loading}
              id="extra-confirmation"
              unstyled
              checked={agreeChecked}
              onChange={() => setAgreeChecked(!agreeChecked)}
            >
              <Text order="body">{extraConfirmationText}</Text>
            </Checkbox>
          </Subtitle>
        )}
      </Wrapper>
    </CustomDialog>
  )
}

const Wrapper = styled.div`
  text-align: center;

  .title {
    padding-bottom: ${props => props.theme.spacing.s};
  }
`

const Illustration = styled(HeliosIllustration)`
  display: inline-block;
  padding-bottom: ${props => props.theme.spacing.xs};
  margin: 0 auto;
`

const Subtitle = styled.div`
  display: inline-flex;
  align-items: center;
  margin: 0 auto;
`
