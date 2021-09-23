import React, { FC } from 'react'

import { Control, Controller } from 'react-hook-form'

import { Checkbox, FormControl, Text } from 'tribe-components'
import { Trans } from 'tribe-translation'

import { SpaceNotificationsDefaultSettingsFormValues } from '../@types'

interface SpaceNotificationDefaultSettingsCheckboxFormControlProps {
  control: Control<SpaceNotificationsDefaultSettingsFormValues> | undefined
  isDisabled?: boolean
  sameAsDefault: SpaceNotificationsDefaultSettingsFormValues['sameAsDefault']
}

export const SpaceNotificationDefaultSettingsCheckboxFormControl: FC<SpaceNotificationDefaultSettingsCheckboxFormControlProps> = ({
  control,
  isDisabled = false,
  sameAsDefault,
}) => (
  <FormControl
    id="notification-settings-space-email-notifications-same-as-default"
    mb={sameAsDefault ? 0 : 4}
  >
    <Controller
      control={control}
      name="sameAsDefault"
      render={({ onChange, value }) => (
        <Checkbox
          spacing={2}
          isDisabled={isDisabled}
          onChange={event => {
            onChange?.(!event?.currentTarget.checked)
          }}
          isChecked={!value}
          defaultChecked={!value}
        >
          <Text color="label.primary" textStyle="regular/medium">
            <Trans
              i18nKey="admin:notifications.useDifferentSettingsForEmail"
              defaults="Use different settings for email notifications"
            />
          </Text>
        </Checkbox>
      )}
    />
  </FormControl>
)
