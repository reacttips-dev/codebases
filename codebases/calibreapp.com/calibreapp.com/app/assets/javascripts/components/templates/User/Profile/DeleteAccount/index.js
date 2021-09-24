import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'

import { Lockup } from '../../../../Layout'
import { Text, TextLink } from '../../../../Type'
import Button from '../../../../Button'
import { Box } from '../../../../Grid'

import FeedbackBlock from '../../../../FeedbackBlock'
import useFeedback from '../../../../../hooks/useFeedback'

import safeError from '../../../../../utils/safeError'

import { DeleteAccount as DeleteAccountQuery } from '../../../../../queries/UserQueries.gql'

import { useSession } from '../../../../../providers/SessionProvider'

const DeleteAccount = () => {
  const { currentUser } = useSession()
  const intl = useIntl()
  const helpLink = intl.formatMessage({
    id: `you.settings.profile.deleteAccount.descriptionLinkUrl`
  })

  const { feedback, setFeedback } = useFeedback()

  const [updatePasswordMutation, { loading: saving, data }] = useMutation(
    DeleteAccountQuery,
    {
      onCompleted: () => {
        window.location = '/'
      },
      onError: error => {
        setFeedback({
          type: 'error',
          message: safeError(error),
          location: 'deleteUserAccount'
        })
      }
    }
  )

  const deleteUserAccount = () => {
    updatePasswordMutation()
  }

  return (
    <>
      <Lockup id="you.settings.profile.deleteAccount" mb={2}>
        <Text>
          <FormattedMessage
            id="you.settings.profile.deleteAccount.extendedDescription"
            values={{
              descriptionLink: (
                <TextLink href={helpLink}>
                  <FormattedMessage id="you.settings.profile.deleteAccount.descriptionLinkText" />
                </TextLink>
              )
            }}
          />
        </Text>
      </Lockup>

      {feedback && feedback.location === 'deleteUserAccount' && (
        <Box mb={4}>
          <FeedbackBlock {...feedback}>{feedback.message}</FeedbackBlock>
        </Box>
      )}

      <FormattedMessage
        id="you.settings.profile.deleteAccount.action.prompt"
        values={{ confirmText: currentUser.email }}
      >
        {message => (
          <Button
            variant="danger"
            disabled={saving}
            loading={saving}
            onClick={() => {
              const response = prompt(message)
              if (response === currentUser.email) {
                deleteUserAccount()
              }
            }}
          >
            <FormattedMessage id="you.settings.profile.deleteAccount.action.label" />
          </Button>
        )}
      </FormattedMessage>
    </>
  )
}

export default DeleteAccount
