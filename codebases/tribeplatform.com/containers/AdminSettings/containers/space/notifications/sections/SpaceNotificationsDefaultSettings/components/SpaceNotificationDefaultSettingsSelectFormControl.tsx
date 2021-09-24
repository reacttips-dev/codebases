import React, { FC } from 'react'

import { Control, Controller } from 'react-hook-form'

import { FormControl, Select } from 'tribe-components'

import {
  SpaceNotificationPreferenceOption,
  SpaceNotificationsDefaultSettingsFormValues,
} from '../@types'

interface SpaceNotificationDefaultSettingsSelectFormControlProps {
  control: Control<SpaceNotificationsDefaultSettingsFormValues> | undefined
  isDisabled?: boolean
  options: SpaceNotificationPreferenceOption[]
  sameAsDefault?: SpaceNotificationsDefaultSettingsFormValues['sameAsDefault']
}

export const SpaceNotificationDefaultSettingsSelectFormControl: FC<SpaceNotificationDefaultSettingsSelectFormControlProps> = ({
  control,
  isDisabled = false,
  options,
  sameAsDefault = true,
}) => (
  <FormControl
    display={sameAsDefault ? 'none' : 'block'}
    id="notification-settings-space-email-preference"
  >
    <Controller
      control={control}
      name="emailPreference"
      render={({ onBlur, onChange, value, name }) => (
        <Select
          isDisabled={isDisabled}
          onBlur={onBlur}
          onChange={selectValue => {
            onChange?.(selectValue?.id)
          }}
          value={{
            id: value,
          }}
          name={name}
          options={options?.map(option => ({
            ...option,
            value: {
              id: option?.value,
            },
          }))}
        />
      )}
    />
  </FormControl>
)
