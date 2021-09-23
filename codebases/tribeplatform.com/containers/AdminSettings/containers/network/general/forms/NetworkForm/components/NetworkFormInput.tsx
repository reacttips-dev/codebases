import React from 'react'

import {
  Control,
  Controller,
  ControllerProps,
  DeepMap,
  FieldError,
} from 'react-hook-form'

import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from 'tribe-components'
import { Trans } from 'tribe-translation'

import { NetworkFormValues } from 'containers/AdminSettings/containers/network/general/forms/NetworkForm/@types'

interface NetworkFormInputProps {
  control: Control<NetworkFormValues>
  defaultValue?: ControllerProps<
    typeof Input,
    Control<NetworkFormValues>
  >['defaultValue']
  errors: DeepMap<NetworkFormValues, FieldError>
  label: string | JSX.Element
  name: ControllerProps<typeof Input, Control<NetworkFormValues>>['name']
  rules?: ControllerProps<typeof Input, Control<NetworkFormValues>>['rules']
}

const NetworkFormInput: React.FC<NetworkFormInputProps> = ({
  control,
  defaultValue,
  errors,
  label,
  name,
  rules,
}) => {
  let errorMessage

  if (errors[name]?.type === 'required') {
    errorMessage = (
      <Trans
        i18nKey="admin:network.general.formErrors.required"
        defaults="{{ label }} is required"
        values={{
          label,
        }}
      />
    )
  } else if (errors[name]?.type === 'validate') {
    errorMessage = (
      <Trans
        i18nKey="admin:network.general.formErrors.invalidUrl"
        defaults="URL is invalid"
      />
    )
  }

  const isInvalid = !!errors[name]

  return (
    <FormControl id={`tribe-${name}`} isInvalid={isInvalid}>
      <FormLabel textStyle="semibold/medium" color="label.primary">
        {label}
      </FormLabel>
      <Controller
        as={Input}
        control={control}
        data-testid={`${name}-field`}
        defaultValue={defaultValue}
        name={name}
        rules={rules}
      />
      <FormErrorMessage>{errorMessage}</FormErrorMessage>
    </FormControl>
  )
}

export default NetworkFormInput
