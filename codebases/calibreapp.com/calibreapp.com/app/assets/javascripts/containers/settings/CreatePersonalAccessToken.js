import React, { useState } from 'react'
import { useMutation } from '@apollo/client'

import { Create } from '../../queries/PersonalAccessTokenQueries.gql'

import PageTitle from '../../components/PageTitle'
import Form from '../../components/templates/User/PersonalAccessTokens/Manage'
import Confirmation from '../../components/templates/User/PersonalAccessTokens/Confirmation'

import safeError from '../../utils/safeError'
import useFeedback from '../../hooks/useFeedback'
import { useSession } from '../../providers/SessionProvider'

const CreatePersonalAccessToken = () => {
  const { memberships, currentUser } = useSession()
  const { feedback, setFeedback } = useFeedback()
  const [showConfirmation, setShowConfirmation] = useState(false)

  const [createApiTokenMutation, { loading: saving, data }] = useMutation(
    Create,
    {
      onCompleted: () => {
        setShowConfirmation(true)
      },
      onError: error => {
        setFeedback({
          type: 'error',
          message: safeError(error),
          location: 'manageApiForm'
        })
      }
    }
  )

  const createApiToken = ({ organisation, ...attributes }) => {
    createApiTokenMutation({
      variables: {
        organisation,
        attributes: {
          ...attributes,
          user: currentUser.uuid
        }
      }
    })
  }

  const {
    createApiKey: { key, description }
  } = data || { createApiKey: {} }

  return (
    <>
      <PageTitle
        id={`you.settings.accessTokens.${
          showConfirmation ? 'confirmation' : 'new'
        }.title`}
      />
      {showConfirmation ? (
        <Confirmation apiToken={key} tokenName={description} />
      ) : (
        <Form
          onSubmit={createApiToken}
          permissions={[]}
          saving={saving}
          action="create"
          error={feedback}
          organisations={memberships.map(({ organisation }) => organisation)}
        />
      )}
    </>
  )
}

export default CreatePersonalAccessToken
