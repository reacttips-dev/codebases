import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useQuery, useMutation } from '@apollo/client'

import {
  ListApiKeys,
  Delete
} from '../../queries/PersonalAccessTokenQueries.gql'

import { TextLink, Strong } from '../../components/Type'
import BlankSlate from '../../components/BlankSlate'
import { Banner } from '../../components/Layout'
import Breadcrumbs from '../../components/Breadcrumbs'
import { Box } from '../../components/Grid'
import PageTitle from '../../components/PageTitle'
import Feedback from '../../components/templates/Feedback'
import { LoadingLayout } from '../../components/Loading/'
import Button from '../../components/Button'

import ApiTokens from '../../components/templates/User/PersonalAccessTokens'

import safeError from '../../utils/safeError'
import useFeedback from '../../hooks/useFeedback'

const PersonalAccessTokens = () => {
  const { feedback, setFeedback, clearFeedback } = useFeedback()
  const [apiTokens, setApiTokens] = useState([])
  const { loading, data, fetchMore } = useQuery(ListApiKeys, {
    fetchPolicy: 'cache-and-network',
    onError: error => {
      setFeedback({
        type: 'error',
        message: safeError(error),
        location: 'apiKeyList'
      })
    }
  })

  const { currentUser } = data || {}
  const {
    apiKeys: { edges, pageInfo }
  } = currentUser || {
    apiKeys: {}
  }

  useEffect(() => {
    if (!loading) {
      const apiTokens = (edges || []).map(({ node }) => ({
        ...node,
        displayName: node.description,
        displayTeam: node.team?.name || (
          <FormattedMessage id="apiToken.noTeam" />
        )
      }))
      setApiTokens(apiTokens)
    }
  }, [loading])

  const nextPage = () => {
    fetchMore({
      variables: {
        cursor: pageInfo?.endCursor
      },
      updateQuery: (prev, { fetchMoreResult }) =>
        Object.assign({}, prev, {
          currentUser: {
            ...prev.currentUser,
            // To get around a bug in @apollo/client and to force a re-render
            // we update the top level object …
            bustCache: 1,
            apiKeys: {
              ...prev.currentUser.apiKeys,
              edges: [
                ...prev.currentUser.apiKeys.edges,
                ...fetchMoreResult.currentUser.apiKeys.edges
              ],
              pageInfo: fetchMoreResult.currentUser.apiKeys.pageInfo
            }
          }
        })
    })
  }

  const [deleteApiToken] = useMutation(Delete, {
    onCompleted: ({ deleteApiKey }) => {
      const { uuid, description } = deleteApiKey || {}

      const updatedApiTokens = apiTokens.filter(
        apiToken => !(apiToken.uuid === uuid)
      )

      setApiTokens(updatedApiTokens)

      setFeedback({
        type: 'success',
        location: 'personalAccessTokens',
        message: (
          <FormattedMessage
            id={'apiToken.revokeMessage'}
            values={{
              token: <Strong color={'green400'}>{description}</Strong>
            }}
          />
        )
      })
    },
    onError: error => {
      setFeedback({
        type: 'error',
        message: safeError(error),
        location: 'apiKeyList'
      })
    }
  })

  const handleRevoke = ({ organisation, uuid }) => {
    deleteApiToken({
      variables: {
        organisation,
        uuid: uuid
      }
    })
  }

  if (loading) return <LoadingLayout />

  let attributes = ['displayName', 'displayTeam', 'expiresAt', 'lastUsed']

  return (
    <>
      <PageTitle id="accessTokens.title" />
      <Banner variant="button">
        <Box flex={1} mb={[4, 0]}>
          <Breadcrumbs>
            <FormattedMessage id="you.settings.accessTokens.heading" />
          </Breadcrumbs>
        </Box>
        <Button to={`/you/settings/tokens/new`}>
          <FormattedMessage id="you.settings.accessTokens.actions.new" />
        </Button>
      </Banner>
      {feedback && feedback.location === 'personalAccessTokens' && (
        <Feedback
          data-qa="accessTokensFeedback"
          p={null}
          pt={4}
          px={4}
          pb={0}
          duration={0}
          onDismiss={() => clearFeedback()}
          {...feedback}
        />
      )}
      {apiTokens.length ? (
        <Box mx={4} mt="50px">
          <ApiTokens
            attributes={attributes}
            apiTokens={apiTokens}
            loading={loading}
            pageInfo={pageInfo}
            nextPage={nextPage}
            handleRevoke={handleRevoke}
          />
        </Box>
      ) : (
        <BlankSlate
          id="you.settings.accessTokens"
          offset={190}
          offsets={[317, 190]}
          values={{
            automateLink: (
              <TextLink
                href={
                  '/docs/automation/cli#export-data-with-the-cli-or-nodejs-api'
                }
                target="_blank"
              >
                <FormattedMessage id="you.settings.accessTokens.blankSlate.automateLink" />
              </TextLink>
            ),
            exportDataLink: (
              <TextLink
                href={
                  '/docs/account-and-billing/export-data#export-data-with-the-cli-or-nodejs-api'
                }
                target="_blank"
              >
                <FormattedMessage id="you.settings.accessTokens.blankSlate.exportDataLink" />
              </TextLink>
            )
          }}
        />
      )}
    </>
  )
}

export default PersonalAccessTokens
