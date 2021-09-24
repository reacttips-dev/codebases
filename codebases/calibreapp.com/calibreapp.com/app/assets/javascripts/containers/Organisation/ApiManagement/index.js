import React, { useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useQuery, useMutation } from '@apollo/client'
import matchSorter from 'match-sorter'

import { ListApiKeys, Delete } from '../../../queries/ApiManagementQueries.gql'

import BlankSlate from '../../../components/BlankSlate'
import { Banner } from '../../../components/Layout'
import { Flex, Box } from '../../../components/Grid'
import useFeedback from '../../../hooks/useFeedback'
import Feedback from '../../../components/templates/Feedback'
import Button from '../../../components/Button'
import Breadcrumbs from '../../../components/Breadcrumbs'
import PageTitle from '../../../components/PageTitle'
import ApiTokens from '../../../components/templates/Organisation/ApiManagement/ApiTokens'
import { LoadingLayout } from '../../../components/Loading/'
import { Heading, Strong, TextLink } from '../../../components/Type'
import Search from '../../../components/Forms/Search'

import safeError from '../../../utils/safeError'
import { useSession } from '../../../providers/SessionProvider'

const ApiManagement = ({
  match: {
    params: { orgId }
  }
}) => {
  const { currentUser } = useSession()
  const intl = useIntl()
  const { feedback, setFeedback, clearFeedback } = useFeedback()
  const [searchTerm, setSearchTerm] = useState(null)
  const [initialLoadComplete, setInitialLoadComplete] = useState(false)
  const [apiTokens, setApiTokens] = useState([])
  const [counts, setCounts] = useState({
    totalOrganisationCount: 0,
    totalUserCount: 0
  })
  const [filtered, setFiltered] = useState(false)

  const { loading, data, fetchMore } = useQuery(ListApiKeys, {
    variables: { orgId: orgId },
    fetchPolicy: 'cache-and-network',
    onError: error => {
      setFeedback({
        type: 'error',
        message: safeError(error),
        location: 'apiKeyList'
      })
    },
    onCompleted: () => {
      setInitialLoadComplete(true)
    }
  })

  const { organisation } = data || {}
  const {
    organisationKeysList: { totalCount: totalOrganisationCount },
    userKeysList: { totalCount: totalUserCount },
    apiKeys: { edges, pageInfo }
  } = organisation || {
    organisationKeysList: {},
    userKeysList: {},
    apiKeys: {}
  }
  const { uuid: currentUserUuid } = currentUser || {}

  useEffect(() => {
    if (!loading) {
      const apiTokens = (edges || []).map(({ node }) => {
        const updatedToken = {
          ...node,
          displayName: node.description,
          displayTeam:
            node.team?.name || intl.formatMessage({ id: 'apiToken.noTeam' }),
          displayType: intl.formatMessage({ id: `apiToken.${node.tag}Token` })
        }

        if (updatedToken.creator) {
          updatedToken.creator = {
            ...updatedToken.creator,
            displayName:
              updatedToken.creator.uuid === currentUserUuid
                ? intl.formatMessage({ id: 'currentUser.displayName' })
                : updatedToken.creator.name
          }
        }

        return updatedToken
      })

      setApiTokens(apiTokens)
      setCounts({ totalOrganisationCount, totalUserCount })
      setFiltered(searchTerm?.length)
    }
  }, [loading, searchTerm])

  const nextPage = () => {
    fetchMore({
      variables: {
        cursor: pageInfo?.endCursor
      },
      updateQuery: (prev, { fetchMoreResult }) =>
        Object.assign({}, prev, {
          organisation: {
            ...prev.organisation,
            // To get around a bug in @apollo/client and to force a re-render
            // we update the top level object …
            bustCache: 1,
            apiKeys: {
              ...prev.organisation.apiKeys,
              edges: [
                ...prev.organisation.apiKeys.edges,
                ...fetchMoreResult.organisation.apiKeys.edges
              ],
              pageInfo: fetchMoreResult.organisation.apiKeys.pageInfo
            }
          }
        })
    })
  }
  const [deleteApiToken] = useMutation(Delete, {
    onCompleted: ({ deleteApiKey }) => {
      const { uuid, description } = deleteApiKey || {}
      let updatedTotalOrganisationCount = totalOrganisationCount
      let updatedTotalUserCount = totalUserCount

      const updatedApiTokens = apiTokens.filter(apiToken => {
        if (apiToken.uuid === uuid) {
          if (apiToken.type === 'organisation') {
            updatedTotalOrganisationCount -= 1
          } else {
            updatedTotalUserCount -= 1
          }
          return false
        }

        return true
      })

      setCounts({
        totalOrganisationCount: updatedTotalOrganisationCount,
        totalUserCount: updatedTotalUserCount
      })

      setApiTokens(updatedApiTokens)

      setFeedback({
        type: 'success',
        location: 'apiKeyList',
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

  const handleRevoke = uuid => {
    deleteApiToken({
      variables: {
        organisation: orgId,
        uuid: uuid
      }
    })
  }

  let attributes = [
    'displayName',
    'displayTeam',
    'displayType',
    'creator',
    'expiresAt'
  ]

  const filteredApiTokens = searchTerm?.length
    ? matchSorter(apiTokens, searchTerm, {
        keys: [
          'displayName',
          'creator.displayName',
          'displayTeam',
          'displayType'
        ]
      })
    : apiTokens

  return (
    <Box pb={4}>
      {!loading && (
        <PageTitle
          id="apiManagement.title"
          breadcrumbs={[data.organisation.name]}
        />
      )}

      <Banner variant="button">
        <Box flex={1} mb={[4, 0]}>
          <Breadcrumbs>
            <FormattedMessage id="apiManagement.heading" />
          </Breadcrumbs>
        </Box>
        <Button to={`/organisations/${orgId}/api/new`}>
          <FormattedMessage id="apiManagement.actions.new" />
        </Button>
      </Banner>

      {feedback && feedback.location === 'apiKeyList' && (
        <Feedback
          data-qa="apiManagementFeedback"
          p={null}
          pt={4}
          px={4}
          pb={0}
          duration={0}
          onDismiss={() => clearFeedback()}
          {...feedback}
        />
      )}

      {!initialLoadComplete ? (
        <LoadingLayout />
      ) : (
        <>
          <Flex
            alignItems="center"
            justifyContent="space-between"
            mx={4}
            mt={3}
          >
            <Heading as={'h2'} level="sm" color="grey400">
              {filtered ? (
                <FormattedMessage
                  id="apiManagement.summary.filtered"
                  values={{
                    filterCount: (
                      <Strong>
                        {filteredApiTokens.length}{' '}
                        {filteredApiTokens.length === 1 ? 'token' : 'tokens'}
                      </Strong>
                    )
                  }}
                />
              ) : (
                <FormattedMessage
                  id="apiManagement.summary.tokens"
                  values={{
                    organisationTokens: (
                      <Strong>
                        {counts.totalOrganisationCount} API{' '}
                        {counts.totalOrganisationCount === 1
                          ? 'token'
                          : 'tokens'}
                      </Strong>
                    ),
                    userTokens: counts.totalUserCount ? (
                      <>
                        and{' '}
                        <Strong>
                          {counts.totalUserCount} Personal Access{' '}
                          {counts.totalUserCount === 1 ? 'Token' : 'Tokens'}
                        </Strong>
                      </>
                    ) : null
                  }}
                />
              )}
            </Heading>
            <Box ml="auto">
              <FormattedMessage id="apiManagement.actions.search">
                {placeholder => (
                  <Search
                    type="search"
                    onChange={searchTerm =>
                      setSearchTerm(searchTerm?.length ? searchTerm : null)
                    }
                    placeholder={placeholder}
                    loading={
                      initialLoadComplete ? searchTerm && loading : false
                    }
                  />
                )}
              </FormattedMessage>
            </Box>
          </Flex>
        </>
      )}

      {!initialLoadComplete ? null : searchTerm?.length ||
        filteredApiTokens.length ? (
        <Box mx={4} mt={feedback.message ? 3 : '50px'}>
          <ApiTokens
            attributes={attributes}
            apiTokens={filteredApiTokens}
            loading={loading}
            pageInfo={pageInfo}
            nextPage={nextPage}
            orgId={orgId}
            handleRevoke={handleRevoke}
            feedback={feedback.message ? true : false}
          />
        </Box>
      ) : (
        <BlankSlate id={'apiManagement'} offset={190} offsets={[317, 190]}>
          <FormattedMessage
            id={`apiManagement.blankSlate.description`}
            values={{
              automateLink: (
                <TextLink
                  href={
                    'https://calibreapp.com/docs/automation/cli#export-data-with-the-cli-or-nodejs-api'
                  }
                  target="_blank"
                >
                  <FormattedMessage id="apiManagement.blankSlate.automateLink" />
                </TextLink>
              ),
              exportDataLink: (
                <TextLink
                  href={
                    'https://calibreapp.com/docs/account-and-billing/export-data#export-data-with-the-cli-or-nodejs-api'
                  }
                  target="_blank"
                >
                  <FormattedMessage id="apiManagement.blankSlate.exportDataLink" />
                </TextLink>
              )
            }}
          />
        </BlankSlate>
      )}
    </Box>
  )
}

export default ApiManagement
