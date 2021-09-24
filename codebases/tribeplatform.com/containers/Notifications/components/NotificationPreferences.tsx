import React from 'react'

import { Stack } from '@chakra-ui/react'

import { SpaceNotificationPreference } from 'tribe-api/interfaces'
import { Radio, RadioGroup, Text } from 'tribe-components'
import { Trans } from 'tribe-translation'

import { enumI18nSpaceNotificationPreference } from 'utils/enums'

export const NotificationPreferences = ({
  value,
  onChange,
  showDescriptions = true,
}: {
  value: SpaceNotificationPreference
  onChange: (newValue: SpaceNotificationPreference) => void
  showDescriptions?: boolean
}) => {
  return (
    <RadioGroup defaultValue={value} onChange={onChange}>
      <Stack spacing={showDescriptions ? 8 : 5}>
        <Radio value={SpaceNotificationPreference.ALL}>
          <Stack spacing={1}>
            <Text color="label.primary" textStyle="medium/medium">
              {enumI18nSpaceNotificationPreference(
                SpaceNotificationPreference.ALL,
              )}
            </Text>
            {showDescriptions && (
              <Text color="label.secondary" textStyle="medium/xsmall">
                <Trans
                  key="notification:settings.preferences.all.description"
                  defaults="New posts and replies in this space"
                />
              </Text>
            )}
          </Stack>
        </Radio>

        <Radio value={SpaceNotificationPreference.NEW_POST}>
          <Stack spacing={1}>
            <Text color="label.primary" textStyle="medium/medium">
              {enumI18nSpaceNotificationPreference(
                SpaceNotificationPreference.NEW_POST,
              )}
            </Text>
            {showDescriptions && (
              <Text color="label.secondary" textStyle="medium/xsmall">
                <Trans
                  key="notification:settings.preferences.newPosts.description"
                  defaults="Only new posts in this space"
                />
              </Text>
            )}
          </Stack>
        </Radio>

        <Radio value={SpaceNotificationPreference.NONE}>
          <Stack spacing={1}>
            <Text color="label.primary" textStyle="medium/medium">
              {enumI18nSpaceNotificationPreference(
                SpaceNotificationPreference.NONE,
              )}
            </Text>
            {showDescriptions && (
              <Text color="label.secondary" textStyle="medium/xsmall">
                <Trans
                  key="notification:settings.preferences.none.description"
                  defaults="Only the posts you are specifically following"
                />
              </Text>
            )}
          </Stack>
        </Radio>
      </Stack>
    </RadioGroup>
  )
}
