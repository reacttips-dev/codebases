import React, { useEffect, useState } from 'react'

import { Center } from '@chakra-ui/react'

import { Space } from 'tribe-api'
import { hasActionPermission } from 'tribe-api/permissions'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Spinner,
} from 'tribe-components'
import { Trans } from 'tribe-translation'

import { EmailVerificationBanner } from 'components/common/EmailVerificationBanner'
import { UserDivider } from 'components/UserImport/UserDivider'
import {
  UserImportContext,
  UserImportContextProps,
} from 'components/UserImport/UserImportContext'

import { useGetRoles, useInviteNetworkMembers } from 'containers/Network/hooks'
import useGetNetwork from 'containers/Network/useGetNetwork'
import useGetSpaces from 'containers/Space/useGetSpaces'

import { InviteMemberMode } from '../../containers/Member/components/InviteMember'
import { UserImportForm } from './UserImportForm'
import { UserImportFormProps } from './useUserImportForm'

export interface UserImportModalProps {
  isOpen: boolean
  onClose: () => void
}

export const UserImportModal = ({ isOpen, onClose }) => {
  const { network } = useGetNetwork({
    withDefaultSpaces: true,
    withRoles: true,
  })
  const { spaces, query, loading, isInitialLoading } = useGetSpaces()
  const { inviteNetworkMembers } = useInviteNetworkMembers()
  const [defaultSpaces, setDefaultSpaces] = useState<Space[]>([])
  const { roles, member } = useGetRoles()

  const firstSpace = spaces?.[0]
  useEffect(() => {
    if (network?.defaultSpaces && network.defaultSpaces.length > 0) {
      setDefaultSpaces(network?.defaultSpaces)
    } else if (firstSpace) {
      setDefaultSpaces([firstSpace])
    } else {
      setDefaultSpaces([])
    }
  }, [network, firstSpace])

  const onSpaceSearch = async (input: string): Promise<Space[]> => {
    const result = await query?.({
      query: input,
    })

    return result?.data?.getSpaces?.edges?.map(edge => edge.node as Space) || []
  }

  const { authorized: hasInviteDefaultsPermission } = hasActionPermission(
    network?.authMemberProps?.permissions || [],
    'inviteMembers',
  )

  const context: UserImportContextProps = {
    defaultSpaces,
    spaces,
    loading,
    onSpaceSearch,
    defaultRole: member,
    roles,
    hasInviteDefaultsPermission,
  }

  const onCompleted = async (formValues: UserImportFormProps) => {
    const response = await inviteNetworkMembers({
      input: {
        invitees: formValues.entries.map(it => ({
          email: it.email,
          name: it.name,
        })),
        defaultSpacesIds: formValues.spaces.map(it => it.id),
        invitationMessage: formValues.customMessage || undefined,
        roleId: formValues.role?.id,
      },
    })

    if (!response.errors) {
      onClose()
    }
  }

  return (
    <UserImportContext.Provider value={context}>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="2xl"
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay>
          <ModalContent>
            {isInitialLoading ? (
              <Center p={20}>
                <Spinner />
              </Center>
            ) : (
              <>
                <ModalHeader data-testid="user-import-modal-header">
                  <Trans
                    i18nKey="userimport.modal.title"
                    defaults="Invite to {{ networkName }}"
                    values={{ networkName: network?.name }}
                  />
                </ModalHeader>
                <ModalCloseButton />
                {context.hasInviteDefaultsPermission && (
                  <ModalBody>
                    <Text textStyle="medium/medium" mt={-4}>
                      <Trans
                        i18nKey="userimport.manual.link"
                        defaults="Share invite link"
                      />
                    </Text>
                    <Text
                      textStyle="regular/small"
                      color="label.secondary"
                      lineHeight={8}
                      mb={2}
                      mt={2}
                    >
                      <Trans
                        i18nKey="userimport.manual.anyone"
                        defaults="Anyone with this link can join as a member."
                      />
                    </Text>
                    <InviteMemberMode />
                    <UserDivider />

                    <EmailVerificationBanner status="success" isCentered />

                    <UserImportForm onSubmit={onCompleted} onCancel={onClose} />
                  </ModalBody>
                )}
              </>
            )}
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </UserImportContext.Provider>
  )
}
