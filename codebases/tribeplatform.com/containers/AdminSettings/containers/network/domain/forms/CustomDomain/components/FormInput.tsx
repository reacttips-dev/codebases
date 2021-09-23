import React from 'react'

import { ApolloError } from '@apollo/client'
import { Control, Controller, DeepMap, FieldError } from 'react-hook-form'

import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputGroup,
} from 'tribe-components'
import { Trans } from 'tribe-translation'

import { CustomDomainFormValues } from 'containers/AdminSettings/containers/network/domain/forms/CustomDomain/@types'

interface FormInputProps {
  apolloError?: ApolloError
  control: Control<CustomDomainFormValues>
  formErrors: DeepMap<CustomDomainFormValues, FieldError>
  isDisabled?: boolean
}

const FormInput: React.FC<FormInputProps> = ({
  apolloError,
  control,
  formErrors,
  isDisabled = false,
}) => {
  let errorMessage

  if (apolloError?.graphQLErrors && apolloError.graphQLErrors.length > 0) {
    errorMessage = apolloError?.graphQLErrors[0]?.message
  } else if (formErrors?.domain?.type === 'required') {
    errorMessage = (
      <Trans
        i18nKey="admin:domain.general.formErrors.newDomainOrSubdomainIsRequired"
        defaults="New Domain or Subdomain is required"
      />
    )
  }

  const isInvalid = !!formErrors.domain || !!apolloError?.message

  return (
    <FormControl id="tribe-domain" isInvalid={isInvalid}>
      <FormLabel textStyle="regular/medium" color="label.primary">
        <Trans
          i18nKey="admin:domain.general.newDomainOrSubdomain"
          defaults="New Domain or Subdomain"
        />
      </FormLabel>

      <InputGroup>
        <Controller
          name="domain"
          control={control}
          rules={{
            required: true,
          }}
          render={({ onChange, onBlur, value, name }) => (
            <Input
              data-testid="network-domain-field"
              isDisabled={isDisabled}
              onBlur={onBlur}
              onChange={onChange}
              name={name}
              placeholder="community.yourdomain.com"
              size="lg"
              value={value}
            />
          )}
        />
      </InputGroup>

      <FormErrorMessage data-testid="network-domain-field-error">
        {errorMessage}
      </FormErrorMessage>
    </FormControl>
  )
}

export default FormInput
