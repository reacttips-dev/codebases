import React from 'react'

import { Box, Spacer, VStack } from '@chakra-ui/react'
import ArrowDropDownLineIcon from 'remixicon-react/ArrowDropDownLineIcon'

import {
  MemberSpaceNotificationSettings,
  SpaceNotificationPreference,
} from 'tribe-api'
import {
  Checkbox,
  Icon,
  PopoverContent,
  PopoverTrigger,
  Button,
  Popover,
  PopoverBody,
} from 'tribe-components'
import { Trans } from 'tribe-translation'

import { NotificationPreferences } from 'containers/Notifications/components/NotificationPreferences'

import useToggle from 'hooks/useToggle'

import { enumI18nSpaceNotificationPreference } from 'utils/enums'

export const NotificationPreferencesChannelOverride = ({
  defaultValue,
  notificationSettings,
  onChange,
}: {
  defaultValue: SpaceNotificationPreference
  notificationSettings: MemberSpaceNotificationSettings | null | undefined
  onChange: (
    sameAsDefault: boolean,
    newValue: SpaceNotificationPreference | null | undefined,
  ) => void
}) => {
  const [popoverOpen, togglePopoverOpen] = useToggle(false)

  return (
    <VStack align="stretch">
      <Checkbox
        isChecked={!notificationSettings?.sameAsDefault}
        onChange={() => {
          onChange(
            !notificationSettings?.sameAsDefault,
            notificationSettings?.preference ?? defaultValue,
          )
        }}
      >
        <Trans
          i18nKey="notification:settings.preferences.overrideEmail"
          defaults="Use different settings for email notifications"
        />
      </Checkbox>
      {!notificationSettings?.sameAsDefault && (
        <Box pl={6} width="100%">
          <Popover isOpen={popoverOpen} placement="bottom-start">
            <PopoverTrigger>
              <Button onClick={togglePopoverOpen} width="full">
                {enumI18nSpaceNotificationPreference(
                  notificationSettings?.preference ?? defaultValue,
                )}
                <Spacer />
                <Icon as={ArrowDropDownLineIcon} />
              </Button>
            </PopoverTrigger>
            <PopoverContent w="504px">
              <PopoverBody>
                <NotificationPreferences
                  value={notificationSettings?.preference ?? defaultValue}
                  showDescriptions={false}
                  onChange={preference => {
                    togglePopoverOpen()
                    onChange(false, preference)
                  }}
                />
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Box>
      )}
    </VStack>
  )
}
