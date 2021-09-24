import React from 'react'

import { Box } from '@chakra-ui/react'

import { NotificationChannel, SpaceQuery } from 'tribe-api'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from 'tribe-components'
import { Trans } from 'tribe-translation'

import { NotificationPreferences } from 'containers/Notifications/components/NotificationPreferences'
import { NotificationPreferencesChannelOverride } from 'containers/Notifications/components/NotificationPreferencesChannelOverride'
import { useGetNotificationSettings } from 'containers/Notifications/hooks/useGetNotificationSettings'
import { useUpdateSpaceNotificationSettings } from 'containers/Notifications/hooks/useUpdateSpaceNotificationSettings'

export const SpaceNotificationSettingsModal = ({
  isOpen,
  onClose,
  space,
}: {
  isOpen: boolean
  onClose: () => void
  space: SpaceQuery['space']
}) => {
  const { update: updateSpaceSettings } = useUpdateSpaceNotificationSettings({
    space,
  })
  const { networkSettings, spacesSettings } = useGetNotificationSettings()

  const networkSettingsEmail = networkSettings?.find(
    it => it.channel === NotificationChannel.EMAIL,
  )
  const inAppSettings = spacesSettings?.find(
    it =>
      it.space?.id === space?.id && it.channel === NotificationChannel.IN_APP,
  )
  const emailSettings = spacesSettings?.find(
    it =>
      it.space?.id === space?.id && it.channel === NotificationChannel.EMAIL,
  )

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size="xl"
        variant="withBorder"
      >
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <Trans
                i18nKey="space:notifications.settingsModal.title"
                defaults="Notifications"
              />
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {inAppSettings?.preference && (
                <NotificationPreferences
                  value={inAppSettings?.preference}
                  onChange={preference =>
                    updateSpaceSettings(NotificationChannel.IN_APP, {
                      preference,
                    })
                  }
                />
              )}
            </ModalBody>

            {networkSettingsEmail?.enabled && (
              <ModalFooter justifyContent="flex-start">
                <Box width="100%">
                  {inAppSettings?.preference && (
                    <NotificationPreferencesChannelOverride
                      notificationSettings={emailSettings}
                      defaultValue={inAppSettings?.preference}
                      onChange={(sameAsDefault, preference) =>
                        updateSpaceSettings(NotificationChannel.EMAIL, {
                          sameAsDefault,
                          preference,
                        })
                      }
                    />
                  )}
                </Box>
              </ModalFooter>
            )}
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  )
}
