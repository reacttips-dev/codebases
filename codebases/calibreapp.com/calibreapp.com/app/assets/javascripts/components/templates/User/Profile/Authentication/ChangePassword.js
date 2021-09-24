import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useMutation } from '@apollo/client'

import { UpdatePassword } from '../../../../../queries/UserQueries.gql'

import { Text } from '../../../../Type'
import Badge from '../../../../Badge'
import { Flex, Box } from '../../../../Grid'
import Button from '../../../../Button'
import { FieldSet, FieldGroup, Input } from '../../../../Forms'

import FeedbackBlock from '../../../../FeedbackBlock'
import useFeedback from '../../../../../hooks/useFeedback'

import safeError from '../../../../../utils/safeError'

const ChangePassword = () => {
  const initialState = {
    currentPassword: '',
    newPassword: '',
    newPasswordConfirmation: ''
  }
  const { feedback, setFeedback } = useFeedback()
  const [modified, setModified] = useState(false)
  const [attributes, setAttributes] = useState(initialState)

  const [updatePasswordMutation, { loading: saving, data }] = useMutation(
    UpdatePassword,
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
        setModified(false)
      },
      onError: error => {
        setFeedback({
          type: 'error',
          message: safeError(error),
          location: 'userPassword'
        })
        setModified(false)
      }
    }
  )

  const updateProfile = attrs => {
    updatePasswordMutation({
      variables: {
        currentPassword: attrs.currentPassword,
        attributes: {
          newPassword: attrs.newPassword,
          newPasswordConfirmation: attrs.newPasswordConfirmation
        }
      }
    })
  }

  const handleSubmit = event => {
    event.preventDefault()

    updateProfile(attributes)
  }

  return (
    <>
      <Flex mb={4}>
        <Box>
          <Text>
            <FormattedMessage id="you.settings.profile.authentication.password.description" />
          </Text>
        </Box>
        <Box textAlign="right" flex={1}>
          <Badge type="success">
            <FormattedMessage id="you.settings.profile.authentication.currentLabel" />
          </Badge>
        </Box>
      </Flex>

      <form onSubmit={handleSubmit} data-qa="change-password-form">
        {feedback && feedback.location === 'userPassword' && (
          <Box my={4}>
            <FeedbackBlock {...feedback}>{feedback.message}</FeedbackBlock>
          </Box>
        )}
        <FieldSet mb={0}>
          <FieldGroup
            labelid="you.settings.profile.authentication.password.currentPassword.label"
            span={3}
          >
            <Input
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              value={attributes.currentPassword}
              required={true}
              maxLength={255}
              onChange={currentPassword => {
                setAttributes({ ...attributes, currentPassword })
                setModified(true)
              }}
            />
          </FieldGroup>
        </FieldSet>
        <FieldSet gridTemplateColumns={['1fr', '1fr 1fr']}>
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

        <Box mt={2} mb={4}>
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
            <FormattedMessage id="you.settings.profile.authentication.password.changeAction.label" />
          </Button>
        </Box>
      </form>
    </>
  )
}

export default ChangePassword
