import React, { Suspense, useEffect, useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'

import PageTitle from '../../components/PageTitle'
import safeError from '../../utils/safeError'
import AuthenticationTemplate from '../../components/templates/Sites/Settings/Authentication'
const Feedback = React.lazy(() => import('../../components/templates/Feedback'))

import { Get, Update } from '../../queries/AuthenticationQueries.gql'

const Authentication = ({
  match: {
    params: { teamId, siteId }
  }
}) => {
  const intl = useIntl()
  const [feedback, setFeedback] = useState()
  const [editing, setEditing] = useState(false)
  const [attributes, setAttributes] = useState({})
  const variables = { teamId, siteId }
  const { loading, data } = useQuery(Get, {
    variables
  })

  const { team } = data || {}
  const { site, organisation } = team || {}
  const { name: organisationName, slug: orgId } = organisation || {}
  const { name, authenticationSettings } = site || {}

  const [updateAuthenticationMutation, { loading: saving }] = useMutation(
    Update,
    {
      onCompleted: ({
        updateSiteSettings: {
          authenticationSettings: { warningMessage, ...authenticationSettings }
        }
      }) => {
        const message = intl.formatMessage({
          id: 'site.settings.authentication.success'
        })
        if (warningMessage) {
          setFeedback({
            type: 'warning',
            message: `${message} ${warningMessage}`
          })
        } else {
          setFeedback({
            type: 'success',
            message
          })
        }
        setEditing(!editing)
        authenticationSettings.required
          ? setAttributes(authenticationSettings)
          : setAttributes({})
      },
      onError: error => {
        setFeedback({
          type: 'error',
          message: safeError(error)
        })
      }
    }
  )

  const updateAuthentication = ({
    username,
    usernameSelector,
    ...authenticationSettings
  }) => {
    updateAuthenticationMutation({
      variables: {
        orgId,
        siteId,
        attributes: {
          authenticationSettings: {
            ...authenticationSettings,
            username: username || '',
            usernameSelector: usernameSelector || '',
            __typename: undefined,
            required: true
          }
        }
      }
    })
  }

  const deleteAuthentication = () => {
    updateAuthenticationMutation({
      variables: {
        orgId,
        siteId,
        attributes: {
          authenticationSettings: {
            required: false
          }
        }
      }
    })
  }

  useEffect(() => {
    let attributes = {}
    if (authenticationSettings && authenticationSettings.required) {
      attributes = authenticationSettings
    }
    setAttributes(attributes)
    setEditing(!attributes.required)
  }, [loading])

  return (
    <>
      <PageTitle
        id="site.settings.authentication.title"
        breadcrumbs={[name, organisationName]}
      />
      {!feedback || (
        <Suspense fallback={<div />}>
          <Feedback
            {...feedback}
            p={null}
            pt={4}
            px={4}
            pb={0}
            onDismiss={() => setFeedback(null)}
          />
        </Suspense>
      )}
      <AuthenticationTemplate
        key={`authentication-${attributes.required}`}
        {...attributes}
        editing={editing}
        loading={loading}
        saving={saving}
        onUpdate={updateAuthentication}
        onDelete={deleteAuthentication}
        onCancel={attributes.required ? () => setEditing(false) : undefined}
        onEdit={() => setEditing(true)}
      />
    </>
  )
}

export default Authentication
