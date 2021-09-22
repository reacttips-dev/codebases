import React, { useState } from 'react'
import styled from 'styled-components'
import {
  Checkbox,
  Illustration as HeliosIllustration,
  LoadingDots,
  Text
} from '@invisionapp/helios'
// @ts-ignore
import deleteUserGroupSvg from '@invisionapp/helios/illustrations/spot/delete-user-group.svg'
import { CustomDialog } from '../CustomDialog'

type DeleteConfirmationDialogProps = {
  buttonText?: string
  extraConfirmationText?: string
  isBackDisabled?: boolean
  loading?: boolean
  onBack?: () => void
  onConfirm?: () => void
  open?: boolean
  showExtraConfirmation?: boolean
  // This lets the consumer override the default rendered content. It's mostly
  // A left-over of a shared UI that's no longer shared.
  renderContent?: () => React.ReactElement
  confirmationButtonDisabled?: boolean
}

const DeleteConfirmationDialog = (props: DeleteConfirmationDialogProps) => {
  const {
    buttonText,
    extraConfirmationText = '',
    isBackDisabled = false,
    loading = false,
    onBack = () => {},
    onConfirm = () => {},
    open = false,
    showExtraConfirmation = false,
    renderContent,
    confirmationButtonDisabled = false
  } = props

  const [agreeChecked, setAgreeChecked] = useState(false)

  const positiveButtonText = loading ? <LoadingDots color="white" /> : buttonText

  const renderDefaultContent = () => {
    return (
      <>
        <Illustration order="scene">
          <img alt="Are you sure you want to do this?" src={deleteUserGroupSvg} />
        </Illustration>
        <Text className="title" order="title" size="smaller">
          Are you sure you want to do this?
        </Text>
        {showExtraConfirmation && (
          <Subtitle>
            <Checkbox
              id="extra-confirmation"
              unstyled
              checked={agreeChecked}
              onChange={() => setAgreeChecked(!agreeChecked)}
            >
              <Text order="body">{extraConfirmationText}</Text>
            </Checkbox>
          </Subtitle>
        )}
      </>
    )
  }

  return (
    <CustomDialog
      aria-label="Confirmation to delete a team resource"
      closeOnEsc
      closeOnOverlay
      negativeText="Back"
      onRequestClose={() => {}}
      onRequestNegative={() => onBack()}
      onRequestPositive={() => onConfirm()}
      positiveText={positiveButtonText as string}
      open={open}
      disableAutofocus
      negativeDisabled={isBackDisabled || loading}
      positiveDisabled={
        (showExtraConfirmation && !agreeChecked) || loading || confirmationButtonDisabled
      }
    >
      <Wrapper>{renderContent ? renderContent() : renderDefaultContent()}</Wrapper>
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

export default DeleteConfirmationDialog
