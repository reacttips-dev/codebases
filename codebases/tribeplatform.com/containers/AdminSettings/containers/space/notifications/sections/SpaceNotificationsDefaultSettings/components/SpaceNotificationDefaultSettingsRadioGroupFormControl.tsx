import React, { FC } from 'react'

import { VStack } from '@chakra-ui/react'
import { Control, Controller } from 'react-hook-form'

import { FormControl, Radio, RadioGroup, Text } from 'tribe-components'

import {
  SpaceNotificationPreferenceOption,
  SpaceNotificationsDefaultSettingsFormValues,
} from '../@types'

interface SpaceNotificationDefaultSettingsRadioGroupFormControlProps {
  control: Control<SpaceNotificationsDefaultSettingsFormValues> | undefined
  isDisabled?: boolean
  options: SpaceNotificationPreferenceOption[]
}

export const SpaceNotificationDefaultSettingsRadioGroupFormControl: FC<SpaceNotificationDefaultSettingsRadioGroupFormControlProps> = ({
  control,
  isDisabled = false,
  options,
}) => (
  <FormControl id="notification-settings-space-notification-preference">
    <Controller
      control={control}
      name="preference"
      render={({ onChange, value }) => (
        <RadioGroup value={value} onChange={onChange}>
          <VStack alignItems="baseline" spacing={5}>
            {options?.map(({ description, label, value }) => (
              <Radio
                alignItems="flex-start"
                isDisabled={isDisabled}
                key={value}
                value={value}
              >
                <VStack spacing={1} alignItems="flex-start">
                  <Text color="label.primary" textStyle="medium/medium">
                    {label}
                  </Text>
                  <Text color="label.secondary" textStyle="regular/medium">
                    {description}
                  </Text>
                </VStack>
              </Radio>
            ))}
          </VStack>
        </RadioGroup>
      )}
    />
  </FormControl>
)
