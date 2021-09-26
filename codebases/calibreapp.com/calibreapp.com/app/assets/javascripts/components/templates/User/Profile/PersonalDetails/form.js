import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useMutation } from '@apollo/client'

import { UpdateProfile } from '../../../../../queries/UserQueries.gql'

import { Box } from '../../../../Grid'
import Button from '../../../../Button'
import { FieldSet, FieldGroup, Input } from '../../../../Forms'

import useFeedback from '../../../../../hooks/useFeedback'
import safeError from '../../../../../utils/safeError'

const Form = ({ name, email }) => {
  const { setFeedback } = useFeedback()
  const [attributes, setAttributes] = useState({
    name: name,
    email: email
  })

  const [updateProfileMutation, { loading: saving, data }] = useMutation(
    UpdateProfile,
    {
      onCompleted: () => {
        setFeedback({
          location: 'userProfile',
          type: 'success',
          message: (
            <FormattedMessage id="you.settings.profile.personalDetails.update.success" />
          )
        })
      },
      onError: error => {
        setFeedback({
          type: 'error',
          message: safeError(error),
          location: 'userProfile'
        })
      }
    }
  )

  const updateProfile = attrs => {
    updateProfileMutation({
      variables: {
        attributes: attrs
      }
    })
  }

  const handleSubmit = event => {
    event.preventDefault()

    updateProfile(attributes)
  }

  return (
    <form onSubmit={handleSubmit} data-qa="personal-details-form">
      <FieldSet mb={0}>
        <FieldGroup
          labelid="you.settings.profile.personalDetails.update.name.label"
          helpid="you.settings.profile.personalDetails.update.name.help"
          span={2}
        >
          <Input
            name="name"
            defaultValue={name}
            required={true}
            maxLength={255}
            onChange={name => setAttributes({ ...attributes, name })}
            autoComplete="name"
          />
        </FieldGroup>
        <FieldGroup
          labelid="you.settings.profile.personalDetails.update.email.label"
          helpid="you.settings.profile.personalDetails.update.email.help"
          span={2}
        >
          <Input
            name="email"
            type="email"
            defaultValue={email}
            required={true}
            maxLength={255}
            onChange={email => setAttributes({ ...attributes, email })}
            autoComplete="new-password"
          />
        </FieldGroup>
      </FieldSet>
      <Box mr={2}>
        <Button type="submit" variant="primary" loading={saving}>
          <FormattedMessage id="you.settings.profile.personalDetails.update.action.label" />
        </Button>
      </Box>
    </form>
  )
}

export default Form
