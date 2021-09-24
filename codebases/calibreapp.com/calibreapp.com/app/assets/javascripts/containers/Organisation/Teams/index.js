import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { FormattedMessage, useIntl } from 'react-intl'
import matchSorter from 'match-sorter'

import { ListTeams, DeleteTeam } from '../../../queries/TeamQueries.gql'

import { Flex, Box } from '../../../components/Grid'
import { Banner } from '../../../components/Layout'
import Feedback from '../../../components/templates/Feedback'
import FeedbackBlock from '../../../components/FeedbackBlock'
import { LoadingLayout } from '../../../components/Loading/'
import Breadcrumbs from '../../../components/Breadcrumbs'
import PageTitle from '../../../components/PageTitle'
import Button from '../../../components/Button'
import { Heading, Strong, TextLink } from '../../../components/Type'
import Search from '../../../components/Forms/Search'
import TeamsTemplate from '../../../components/templates/Organisation/Teams'
import BlankSlate from '../../../components/BlankSlate'

import safeError from '../../../utils/safeError'
import useFeedback from '../../../hooks/useFeedback'
import { useSession } from '../../../providers/SessionProvider'

const Teams = ({
  match: {
    params: { orgId }
  }
}) => {
  const intl = useIntl()
  const { features } = useSession({ orgId })
  const { feedback, setFeedback, clearFeedback } = useFeedback()
  const [initialLoadComplete, setInitialLoadComplete] = useState(false)
  const [searchTerm, setSearchTerm] = useState(null)
  const [teams, setTeams] = useState(false)
  const [filtered, setFiltered] = useState(false)

  const { loading, data } = useQuery(ListTeams, {
    variables: {
      orgId: orgId
    },
    fetchPolicy: 'cache-and-network',
    onError: error => {
      setFeedback({
        type: 'error',
        message: safeError(error),
        location: 'teamsList'
      })
    },
    onCompleted: () => {
      setInitialLoadComplete(true)
    }
  })

  const { organisation } = data || {}
  const { name: organisationName, teams: initialTeams, subscription } =
    organisation || {}

  const {
    plan: { name: planName }
  } = subscription || { plan: {} }

  const [deleteTeam] = useMutation(DeleteTeam, {
    onCompleted: ({ deleteTeam }) => {
      const updatedTeams = teams.filter(
        team => !(team.slug === deleteTeam.slug)
      )

      setTeams(updatedTeams)

      setFeedback({
        type: 'success',
        location: 'teamsList',
        message: (
          <FormattedMessage
            id="teams.notifications.removeSuccess"
            values={{
              team: <Strong color={'green400'}>{deleteTeam.name}</Strong>
            }}
          />
        )
      })
    },
    onError: error => {
      setFeedback({
        type: 'error',
        message: safeError(error),
        location: 'teamsList'
      })
    }
  })

  useEffect(() => {
    if (!loading) {
      setTeams(
        initialTeams.map(team => ({
          ...team,
          sitesCount: team.sitesList?.totalCount,
          membersCount: team.membersCount?.totalCount,
          members: (team.membersList?.edges || []).map(({ node }) => node)
        }))
      )
      setFiltered(searchTerm?.length)
    }
  }, [loading, searchTerm])

  const handleRemove = slug => {
    deleteTeam({ variables: { organisation: orgId, slug } })
  }

  if (loading) return <LoadingLayout />

  const filteredTeams = searchTerm?.length
    ? matchSorter(teams, searchTerm, {
        keys: ['name', 'description']
      })
    : teams || []

  return (
    <>
      <PageTitle id="teams.title" breadcrumbs={[organisationName]} />

      <Banner variant="button">
        <Box flex={1} mb={[4, 0]}>
          <Breadcrumbs>
            <FormattedMessage
              id="teams.heading"
              values={{
                organisation: organisationName
              }}
            />
          </Breadcrumbs>
        </Box>
        <Box pr={1} width={[1, 'auto']}>
          <Button
            data-testid="addSite"
            to={`/organisations/${orgId}/teams/new`}
            disabled={!features.includes('multipleTeams')}
          >
            <FormattedMessage id="teams.actions.add" />
          </Button>
        </Box>
      </Banner>

      {!initialLoadComplete ? (
        <LoadingLayout />
      ) : (
        <>
          <Flex
            flexWrap={['wrap', 'nowrap']}
            alignItems="center"
            justifyContent="space-between"
            mx={4}
            mt={3}
          >
            <Box flex={1} width={[1, 'auto']}>
              <Heading as={'h2'} level="sm" color="grey400">
                <FormattedMessage
                  id={`teams.summary.${filtered ? 'filtered' : 'teams'}`}
                  values={{
                    count: (
                      <Strong>
                        {filteredTeams.length}{' '}
                        <FormattedMessage
                          id={`teams.summary.${
                            filteredTeams.length === 1 ? 'singular' : 'plural'
                          }`}
                        />
                      </Strong>
                    )
                  }}
                />
              </Heading>
            </Box>
            <Box width={[1, 'auto']} mt={[2, 0]}>
              <Search
                width={1}
                type="search"
                onChange={searchTerm =>
                  setSearchTerm(searchTerm?.length ? searchTerm : null)
                }
                placeholder={intl.formatMessage({
                  id: `teams.actions.search`
                })}
                loading={searchTerm && loading}
              />
            </Box>
          </Flex>
        </>
      )}
      {feedback?.location === 'teamsList' ? (
        <Feedback
          data-qa="teamsList"
          p={null}
          pt={4}
          px={4}
          pb={0}
          duration={0}
          onDismiss={() => clearFeedback()}
          {...feedback}
        />
      ) : null}
      {!features.includes('multipleTeams') ? (
        <Box mt={4} mx={4}>
          <FeedbackBlock data-qa="noMultipleTeams" type="warning">
            <FormattedMessage
              id="teams.notifications.upgrade.description"
              values={{ plan: planName }}
            />{' '}
            <TextLink to={`/organisations/${orgId}/billing/plans`}>
              <FormattedMessage id="teams.notifications.upgrade.link" />
            </TextLink>
          </FeedbackBlock>
        </Box>
      ) : null}

      {!initialLoadComplete ? null : searchTerm?.length ||
        filteredTeams.length ? (
        <Box mx={4} mt={feedback.location === 'teamsList' ? 3 : '50px'}>
          <TeamsTemplate
            teams={filteredTeams}
            orgId={orgId}
            onRemove={handleRemove}
          />
        </Box>
      ) : (
        <BlankSlate id="teams" offset={190} offsets={[317, 190]} />
      )}
    </>
  )
}

export default Teams
