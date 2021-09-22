import React, { useState } from 'react'
import pluralize from 'pluralize'
import styled from 'styled-components'
import {
  Radio,
  Text,
  Truncate,
  Spaced,
  Illustration as HeliosIllustration,
  LoadingDots
} from '@invisionapp/helios'
import Check from '@invisionapp/helios/icons/Check'
// @ts-ignore
import deleteUserGroupSvg from '@invisionapp/helios/illustrations/spot/delete-user-group.svg'

import { BFFResponse } from '../../utils/bffRequest'
import useToast from '../../hooks/useToast'

import { UserAvatar } from '../../components/tables/Table'
import { SearchablePotentialOwners } from '../../components/documents/SearchablePotentialOwners'
import { CustomDialog } from '../../components/CustomDialog'

import { LoadingStatus } from '../../stores/utils/loadingStatus'
import { Member, deleteMember } from '../../stores/members'
import { transferDocsToUser, transferCounts } from '../../stores/bulkTransfer'

type RemoveUserDialogProps = {
  currentUserID?: number
  member?: Member
  documentCount?: number
  withDocumentTransfer?: boolean
  onClose: () => void
  onRemoved: (member: Member) => void
}

// we want to empathize the email of the user
const errorMessage = (email: string) => (
  <Text order="body">
    We were unable to remove <strong>{email}</strong> from the team
  </Text>
)

export const RemoveUserDialog = (props: RemoveUserDialogProps) => {
  const {
    currentUserID,
    member,
    documentCount,
    withDocumentTransfer = false,
    onRemoved,
    onClose
  } = props

  const [documentsTransferAction, setDocumentsTransferAction] = useState<
    'transfer-later' | 'transfer-now' | undefined
  >()
  const [selectedMember, setSelectedMember] = useState<Member | undefined>()
  const [loadingState, setLoadingState] = useState<LoadingStatus>('initial')

  const { successToast, errorToast } = useToast()

  const positiveButtonText = () => {
    switch (loadingState) {
      case 'loading': {
        return <LoadingDots color="white" />
      }
      case 'loaded': {
        return <Check fill="white" />
      }
      default: {
        return 'Remove 1 user'
      }
    }
  }

  const handleClose = () => {
    // Let animation finish before reseting everything
    setTimeout(() => onClose(), 300)
  }

  const removeUserOnly = (member: Member) => {
    return deleteMember(member.userID)
      .then(() => {
        setLoadingState('loaded')
        successToast(
          'The user has been successfully removed. You can transfer their documents from the Removed users tab'
        )

        onRemoved(member)
      })
      .catch(() => {
        errorToast(errorMessage(member.email))
      })
      .finally(() => {
        setLoadingState('initial')
      })
  }

  const removeUserAndDocuments = (memberToRemove: Member, memberNewOwner?: Member) => {
    if (!memberNewOwner) {
      return
    }

    // params: fromUserId, toUserId
    transferDocsToUser(String(memberToRemove.userID), String(memberNewOwner.userID))
      .then((response: BFFResponse) => {
        const body = response.data
        const { failed, succeeded } = transferCounts(body)

        if (body.status === 'Failed') {
          setLoadingState('error')

          // Document transfer failed
          return errorToast(
            <>
              {succeeded.length} {pluralize('documents', succeeded.length)} were successfully
              transferred to their new owner, however
              <br />
              {failed.length} {pluralize('documents', failed.length)} were not transferred.
              Please try again later or contact support.
            </>
          )
        }

        // Document transfer successful
        return deleteMember(memberToRemove.userID)
          .then(() => {
            setLoadingState('loaded')

            // transferred docs to myself
            if (memberNewOwner.userID === currentUserID) {
              successToast(
                `The user has been successfully removed and you are now the new owner of
                ${succeeded.length} ${pluralize('document', succeeded.length)}`
              )
            } else {
              // transferred docs to someone else
              successToast(
                `The user has been successfully removed and the new
                ${pluralize('document', succeeded.length)} owner will be notified`
              )
            }
            onRemoved(memberToRemove)
          })
          .catch(() => {
            errorToast(errorMessage(memberToRemove.email))
          })
          .finally(() => {
            setLoadingState('initial')
          })
      })
      .catch(() => {
        setLoadingState('initial')
        errorToast('There was an error transferring the documents. Please try again.')
      })
  }

  const startRemovingUser = React.useCallback(() => {
    if (!member) {
      return
    }

    setLoadingState('loading')
    documentsTransferAction === 'transfer-now'
      ? removeUserAndDocuments(member, selectedMember)
      : removeUserOnly(member)
  }, [loadingState, documentsTransferAction, member, removeUserAndDocuments, removeUserOnly])

  const shouldBlockProgress = React.useCallback(() => {
    if (loadingState === 'loading' || loadingState === 'loaded') {
      return true
    }

    if (!withDocumentTransfer) {
      return false
    }

    switch (documentsTransferAction) {
      case undefined: {
        return true
      }

      case 'transfer-later': {
        return false
      }

      case 'transfer-now': {
        return selectedMember === undefined
      }

      default: {
        return true
      }
    }
  }, [withDocumentTransfer, loadingState, selectedMember, documentsTransferAction])

  const handleSelectPerson = React.useCallback(
    member => {
      setSelectedMember(member)
    },
    [setSelectedMember, selectedMember, documentsTransferAction]
  )

  const renderWithDocumentTransfer = () => {
    if (!member) {
      return <></>
    }

    return (
      <div
        style={{
          textAlign: 'left',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <Spaced bottom="m">
          <Text order="title" size="smaller" style={{ textAlign: 'center' }}>
            You are about to remove this user
          </Text>
        </Spaced>
        <div
          style={{
            textAlign: 'left',
            margin: '0 auto',
            width: '80%'
          }}
        >
          <Spaced bottom="m">
            <UserWrapper>
              <UserAvatar
                size="larger"
                color="dark"
                name={member.name}
                order="user"
                src={member.avatarURL}
              />
              <div>
                <Text
                  order="body"
                  color="text-darker"
                  size="larger"
                  style={{ fontWeight: 600 }}
                >
                  <Truncate placement="end">{member.name}</Truncate>
                </Text>
                <Text order="body" size="smaller">
                  {documentCount} {pluralize('document', documentCount)}
                </Text>
              </div>
            </UserWrapper>
          </Spaced>

          <div style={{ lineHeight: 2.3 }}>
            <Spaced bottom="xxs">
              <Text order="subtitle">What should we do with their documents?</Text>
            </Spaced>

            <Radio
              id="transfer-later"
              name="transfer-documents-action"
              unstyled
              onClick={() => {
                setDocumentsTransferAction('transfer-later')
              }}
            >
              Nothing. I{"'"}ll transfer document ownership later if need be
            </Radio>
            <Radio
              id="transfer-now"
              name="transfer-documents-action"
              unstyled
              onClick={() => {
                setDocumentsTransferAction('transfer-now')
              }}
            >
              I would like to transfer them to another teammate now
            </Radio>

            {documentsTransferAction === 'transfer-now' && (
              <Spaced top="xs">
                <div>
                  <SearchablePotentialOwners
                    onSelect={handleSelectPerson}
                    removeUserID={member.userID}
                    isToTransferDocs
                  />
                </div>
              </Spaced>
            )}
          </div>
        </div>
      </div>
    )
  }

  const renderRemoveOnly = () => {
    return (
      <>
        <Illustration order="scene">
          <img alt="Are you sure you want to do this?" src={deleteUserGroupSvg} />
        </Illustration>
        <Text className="title" order="title" size="smaller">
          Are you sure you want to do this?
        </Text>
      </>
    )
  }

  return (
    <CustomDialog
      aria-label="Confirmation to delete a team resource"
      closeOnEsc
      closeOnOverlay
      negativeText="Back"
      onRequestClose={() => handleClose()}
      onRequestNegative={() => handleClose()}
      onRequestPositive={startRemovingUser}
      positiveText={positiveButtonText() as string}
      open={!!member}
      disableAutofocus
      negativeDisabled={false}
      positiveDisabled={shouldBlockProgress()}
      onAfterClose={() => {
        // Let the animations finish before resetting everything
        setTimeout(() => {
          // Reset everything after the dialog closes
          setLoadingState('initial')
          setDocumentsTransferAction(undefined)
        }, 300)
      }}
    >
      <Wrapper>
        {withDocumentTransfer ? renderWithDocumentTransfer() : renderRemoveOnly()}
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

const UserWrapper = styled.div`
  padding: ${props => props.theme.spacing.m};
  border: 1px solid ${props => props.theme.palette.structure.lighter};
`
