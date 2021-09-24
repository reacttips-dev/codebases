import React, { Suspense } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'

import {
  List,
  DeleteGitHub,
  Delete
} from '../../queries/IntegrationQueries.gql'

import IntegrationsTemplate from '../../components/templates/Sites/Settings/Integrations'
import PageTitle from '../../components/PageTitle'
import { Strong } from '../../components/Type'

import useFeedback from '../../hooks/useFeedback'
import safeError from '../../utils/safeError'

const Feedback = React.lazy(() => import('../../components/templates/Feedback'))

const Integrations = ({
  match: {
    params: { teamId, siteId }
  }
}) => {
  const intl = useIntl()
  const { feedback, setFeedback, clearFeedback } = useFeedback()
  const { loading, data } = useQuery(List, {
    variables: { teamId, siteId },
    fetchPolicy: 'cache-and-network'
  })

  const { team } = data || {}
  const { organisation, site } = team || {}
  const { name: organisationName, slug: orgId } = organisation || {}
  const { name: siteName, integrationsList, reviewSite } = site || {}
  const { edges = [] } = integrationsList || {}

  const [deleteGitHubMutation] = useMutation(DeleteGitHub, {
    onCompleted: () =>
      setFeedback({
        location: 'integrations',
        type: 'success',
        message: intl.formatMessage(
          {
            id: 'site.settings.integrations.delete.success'
          },
          { provider: 'GitHub' }
        )
      }),
    onError: error =>
      setFeedback({
        location: 'integrations',
        type: 'error',
        message: safeError(error)
      })
  })

  const [deleteMutation] = useMutation(Delete, {
    onCompleted: ({ deleteIntegration: { provider } }) =>
      setFeedback({
        location: 'integrations',
        type: 'success',
        message: intl.formatMessage(
          {
            id: 'site.settings.integrations.delete.success'
          },
          {
            provider: intl.formatMessage({
              id: `site.settings.integrations.${provider}.title`
            })
          }
        )
      }),
    onError: error =>
      setFeedback({
        location: 'integrations',
        type: 'error',
        message: safeError(error)
      })
  })

  const handleDelete = ({ provider, uuid }) => {
    if (provider === 'github') {
      deleteGitHubMutation({
        variables: { orgId, siteId, uuid },
        optimisticResponse: {
          __typename: 'Mutation',
          updateGitHub: {
            id: uuid,
            __typename: 'ReviewSite',
            deleted: true
          }
        }
      })
    } else {
      deleteMutation({
        variables: { orgId, siteId, uuid },
        optimisticResponse: {
          __typename: 'Mutation',
          updateGitHub: {
            id: uuid,
            __typename: 'Integration',
            deleted: true
          }
        }
      })
    }
  }

  const integrations = edges.map(({ node }) => node)

  if (reviewSite && reviewSite.repository) {
    integrations.push({
      provider: 'github',
      ...reviewSite,
      formattedRepository: <Strong>{reviewSite.repository}</Strong>
    })
  }

  return (
    <>
      <PageTitle
        id="integrations.title"
        breadcrumbs={[siteName, organisationName]}
      />
      {(feedback.location === 'integrations' && (
        <Suspense fallback={<div />}>
          <Feedback
            p={0}
            px={4}
            pt={4}
            duration={0}
            onDismiss={clearFeedback}
            {...feedback}
          />
        </Suspense>
      )) ||
        null}
      <IntegrationsTemplate
        loading={loading}
        teamId={teamId}
        siteId={siteId}
        integrations={integrations}
        onDelete={handleDelete}
      />
    </>
  )
}

export default Integrations
