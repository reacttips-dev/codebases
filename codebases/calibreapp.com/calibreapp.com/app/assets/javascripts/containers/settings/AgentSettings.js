import React, { Suspense, useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'

import PageTitle from '../../components/PageTitle'
import safeError from '../../utils/safeError'
import AgentSettingsTemplate from '../../components/templates/Sites/Settings/AgentSettings'
import HeadersTemplate from '../../components/templates/Sites/Settings/AgentSettings/Headers'
import CookieTemplate from '../../components/templates/Sites/Settings/AgentSettings/Cookies'
const Feedback = React.lazy(() => import('../../components/templates/Feedback'))

import {
  Get,
  Update,
  UpdateSiteSettings
} from '../../queries/AgentSettingsQueries.gql'

const AgentSettings = ({
  match: {
    params: { teamId, siteId }
  }
}) => {
  const intl = useIntl()
  const [feedback, setFeedback] = useState()
  const variables = { teamId, siteId }
  const { loading, data } = useQuery(Get, {
    variables
  })

  const { team, locations } = data || {}
  const { organisation, site, name: teamName } = team || {}
  const { name: organisationName, slug: orgId } = organisation || {}
  const {
    name,
    location: { tag: location },
    headers,
    cookies
  } = site || { location: {} }

  const [
    updateAgentSettingsMutation,
    { loading: savingAgentSettings }
  ] = useMutation(Update, {
    onCompleted: () => {
      setFeedback({
        location: 'agent',
        type: 'success',
        message: intl.formatMessage({ id: 'site.settings.agent.success' })
      })
    },
    onError: error => {
      setFeedback({
        type: 'error',
        message: safeError(error)
      })
    }
  })
  const [updateHeadersMutation, { loading: savingHeaders }] = useMutation(
    UpdateSiteSettings,
    {
      onCompleted: () => {
        setFeedback({
          location: 'headers',
          type: 'success',
          message: intl.formatMessage({
            id: 'site.settings.profiles.headers.success'
          })
        })
      },
      onError: error => {
        setFeedback({
          type: 'error',
          message: safeError(error)
        })
      }
    }
  )
  const [updateCookiesMutation, { loading: savingCookies }] = useMutation(
    UpdateSiteSettings,
    {
      onCompleted: () => {
        setFeedback({
          location: 'cookies',
          type: 'success',
          message: intl.formatMessage({
            id: 'site.settings.profiles.cookies.success'
          })
        })
      },
      onError: error => {
        setFeedback({
          type: 'error',
          message: safeError(error)
        })
      }
    }
  )

  const updateAgentSettings = attributes => {
    updateAgentSettingsMutation({
      variables: {
        orgId,
        siteId,
        attributes
      }
    })
  }

  const updateHeaders = headers => {
    updateHeadersMutation({
      variables: {
        orgId,
        siteId,
        attributes: {
          headers
        }
      },
      optimisticResponse: {
        __typename: 'Mutation',
        updateSiteHeaders: {
          id: siteId,
          __typename: 'Site',
          headers
        }
      }
    })
  }

  const updateCookies = cookies => {
    updateCookiesMutation({
      variables: {
        orgId,
        siteId,
        attributes: {
          cookies
        }
      },
      optimisticResponse: {
        __typename: 'Mutation',
        updateSiteHeaders: {
          id: siteId,
          __typename: 'Site',
          cookies
        }
      }
    })
  }

  return (
    <>
      <PageTitle
        id="site.settings.agent.title"
        breadcrumbs={[name, teamName, organisationName]}
      />
      {feedback && feedback.location === 'agent' ? (
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
      ) : null}
      <AgentSettingsTemplate
        orgId={orgId}
        siteId={siteId}
        {...site}
        location={location}
        locations={locations}
        loading={loading}
        saving={savingAgentSettings}
        onUpdate={updateAgentSettings}
      />
      {feedback && feedback.location === 'headers' ? (
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
      ) : null}
      <HeadersTemplate
        loading={loading}
        saving={savingHeaders}
        headers={headers}
        onUpdate={updateHeaders}
      />
      {feedback && feedback.location === 'cookies' ? (
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
      ) : null}
      <CookieTemplate
        saving={savingCookies}
        onUpdate={updateCookies}
        cookies={cookies}
      />
    </>
  )
}

export default AgentSettings
