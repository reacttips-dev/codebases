import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { FormattedMessage, useIntl } from 'react-intl'
import matchSorter from 'match-sorter'

import { ListMembers, UpdateMember } from '../queries/TeamMemberQueries.gql'

import { Flex, Box } from '../components/Grid'
import { Banner } from '../components/Layout'
import useFeedback from '../hooks/useFeedback'
import Feedback from '../components/templates/Feedback'
import { LoadingLayout } from '../components/Loading/'
import Breadcrumbs from '../components/Breadcrumbs'
import PageTitle from '../components/PageTitle'
import Button from '../components/Button'
import { Heading, Strong } from '../components/Type'
import Search from '../components/Forms/Search'
import Members from '../components/templates/Team/Members'

import safeError from '../utils/safeError'
import { useSession } from '../providers/SessionProvider'

const MemberManagement = ({
  match: {
    params: { teamId }
  }
}) => {
  const intl = useIntl()
  const { membership, can } = useSession({ teamId })
  const { feedback, setFeedback, clearFeedback } = useFeedback()
  const [searchTerm, setSearchTerm] = useState(null)
  const [members, setMembers] = useState([])
  const [filtered, setFiltered] = useState(false)

  const { loading, data } = useQuery(ListMembers, {
    variables: {
      teamId
    },
    fetchPolicy: 'cache-and-network',
    onError: error => {
      setFeedback({
        type: 'error',
        message: safeError(error),
        location: 'teamMembersList'
      })
    }
  })

  const { team } = data || {}
  const { name: teamName, members: initialMembers, organisation } = team || {}
  const { slug: orgId, name: organisationName } = organisation || {}
  const { uuid: currentMemberUuid, role } = membership || {}

  const [updateMember] = useMutation(UpdateMember, {
    onCompleted: ({ updateMember: member }) => {
      const { uuid, user, invitationName } = member || {}

      if (uuid === currentMemberUuid) {
        window.location = '/home'
      } else {
        const updatedMembers = members.filter(member => !(member.uuid === uuid))

        setMembers(updatedMembers)

        setFeedback({
          type: 'success',
          location: 'teamMembersList',
          message: (
            <FormattedMessage
              id="team.members.notifications.removeSuccess"
              values={{
                member: (
                  <Strong color={'green400'}>
                    {user?.name || invitationName}&rsquo;s
                  </Strong>
                ),
                team: teamName
              }}
            />
          )
        })
      }
    },
    onError: error => {
      setFeedback({
        type: 'error',
        message: safeError(error),
        location: 'teamMembersList'
      })
    }
  })

  useEffect(() => {
    if (!loading) {
      const members = (initialMembers || []).map(member => ({
        ...member,
        displayName:
          member.uuid === currentMemberUuid
            ? intl.formatMessage({ id: 'currentUser.displayName' })
            : member.user?.name || member.invitationName,
        displayEmail: can('readTeamMembers')
          ? member.user?.email || member.invitationEmail
          : null
      }))
      setMembers(members)

      setFiltered(searchTerm?.length)
    }
  }, [loading, searchTerm])

  const handleRemove = uuid => {
    const member = initialMembers.find(member => member.uuid === uuid)
    if (member) {
      const teams = member.teams
        .filter(({ slug }) => !(slug === teamId))
        .map(({ slug }) => slug)
      updateMember({
        variables: { organisation: orgId, uuid, attributes: { teams } }
      })
    }
  }

  if (loading) return <LoadingLayout />

  const filteredMembers = searchTerm?.length
    ? matchSorter(members, searchTerm, {
        keys: [
          'displayName',
          'user.name',
          'user.email',
          'invitationName',
          'invitationEmail'
        ]
      })
    : members

  return (
    <>
      <PageTitle
        id="team.members.title"
        breadcrumbs={[teamName, organisationName]}
      />

      <Banner variant="button">
        <Box flex={1} mb={[4, 0]}>
          <Breadcrumbs>
            <FormattedMessage
              id="team.members.heading"
              values={{
                team: teamName
              }}
            />
          </Breadcrumbs>
        </Box>
        {can('updateOrganisations') ? (
          <Box pr={1} width={[1, 'auto']}>
            <Button to={`/teams/${teamId}/team/add`}>
              <FormattedMessage
                id="team.members.actions.invite"
                values={{
                  team: teamName
                }}
              />
            </Button>
          </Box>
        ) : null}
      </Banner>

      {loading ? null : (
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
                  id={`team.members.summary.${
                    filtered ? 'filtered' : 'members'
                  }`}
                  values={{
                    count: (
                      <Strong>
                        {filteredMembers.length}{' '}
                        <FormattedMessage
                          id={`team.members.summary.${
                            filteredMembers.length === 1 ? 'singular' : 'plural'
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
                  id: `team.members.actions.search`
                })}
                loading={searchTerm && loading}
              />
            </Box>
          </Flex>
        </>
      )}
      {feedback &&
        feedback.location === 'teamMembersList' &&
        feedback.type === 'success' && (
          <Feedback
            data-qa="teamMembersList"
            p={null}
            pt={4}
            px={4}
            pb={0}
            duration={0}
            onDismiss={() => clearFeedback()}
            {...feedback}
          />
        )}
      <Box mx={4} mt={feedback.location === 'teamMembersList' ? 3 : '50px'}>
        <Members
          members={filteredMembers}
          teamId={teamId}
          orgId={orgId}
          currentMemberUuid={currentMemberUuid}
          isAdmin={role === 'admin'}
          teamName={teamName}
          onRemove={handleRemove}
        />
      </Box>
    </>
  )
}

export default MemberManagement
