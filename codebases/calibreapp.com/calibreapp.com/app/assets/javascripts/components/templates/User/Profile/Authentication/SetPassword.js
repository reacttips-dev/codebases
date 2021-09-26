import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useMutation } from '@apollo/client'

import { SetPassword as SetPasswordQuery } from '../../../../../queries/UserQueries.gql'

import { Text } from '../../../../Type'
import { Flex, Box } from '../../../../Grid'
import Button from '../../../../Button'
import { FieldSet, FieldGroup, Input } from '../../../../Forms'

import FeedbackBlock from '../../../../FeedbackBlock'
import useFeedback from '../../../../../hooks/useFeedback'

import safeError from '../../../../../utils/safeError'

const Form = () => {
  const initialState = {
    newPassword: '',
    newPasswordConfirmation: ''
  }
  const { feedback, setFeedback } = useFeedback()
  const [modified, setModified] = useState(false)
  const [attributes, setAttributes] = useState(initialState)

  const [updatePasswordMutation, { loading: saving, data }] = useMutation(
    SetPasswordQuery,
    {
      onCompleted: () => {
        setAttributes({ ...initialState })
        setFeedback({
          location: 'userPassword',
          type: 'success',
          message: (
            <FormattedMessage id="you.settings.profile.authentication.password.success" />
          )
        })
      },
      onError: error => {
        setFeedback({
          type: 'error',
          message: safeError(error),
          location: 'userPassword'
        })
      }
    }
  )

  const updateProfile = attrs => {
    updatePasswordMutation({
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
    <>
      <form onSubmit={handleSubmit} data-qa="set-password-form">
        {feedback && feedback.location === 'userPassword' && (
          <Box mb={4}>
            <FeedbackBlock {...feedback}>{feedback.message}</FeedbackBlock>
          </Box>
        )}
        <FieldSet gridTemplateColumns={['1fr', '1fr 1fr']} mb={0}>
          <FieldGroup
            labelid="you.settings.profile.authentication.password.newPassword.label"
            span={1}
          >
            <Input
              name="newPassword"
              type="password"
              autoComplete="new-password"
              value={attributes.newPassword}
              required={true}
              maxLength={255}
              onChange={newPassword => {
                setAttributes({ ...attributes, newPassword })
                setModified(true)
              }}
            />
          </FieldGroup>
          <FieldGroup
            labelid="you.settings.profile.authentication.password.confirmationPassword.label"
            span={1}
          >
            <Input
              name="newPasswordConfirmation"
              type="password"
              autoComplete="new-password"
              value={attributes.newPasswordConfirmation}
              required={true}
              maxLength={255}
              onChange={newPasswordConfirmation => {
                setAttributes({ ...attributes, newPasswordConfirmation })
                setModified(true)
              }}
            />
          </FieldGroup>
        </FieldSet>

        <Box mb={4}>
          <Text>
            <FormattedMessage id="you.settings.profile.authentication.password.passwordHelp" />
          </Text>
        </Box>
        <Box mr={2} order={1}>
          <Button
            type="submit"
            variant="primary"
            disabled={!modified || saving}
            loading={saving}
          >
            <FormattedMessage id="you.settings.profile.authentication.password.setAction.label" />
          </Button>
        </Box>
      </form>
    </>
  )
}

const SetPassword = () => {
  const [showForm, setShowForm] = useState(false)

  return showForm ? (
    <Form />
  ) : (
    <Flex alignItems="center">
      <Box mr={4} flex={2}>
        <FormattedMessage id="you.settings.profile.authentication.password.switch" />
      </Box>
      <Box textAlign="right" flex={1}>
        <Button type="primary" onClick={() => setShowForm(true)}>
          <FormattedMessage id="you.settings.profile.authentication.password.setAction.label" />
        </Button>
      </Box>
    </Flex>
  )
}

export default SetPassword
