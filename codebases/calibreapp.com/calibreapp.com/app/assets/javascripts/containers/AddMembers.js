import React, { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { FormattedMessage } from 'react-intl'

import { ListMembers, UpdateMembers } from '../queries/TeamMemberQueries.gql'

import { Flex, Box } from '../components/Grid'
import { Banner } from '../components/Layout'
import Feedback from '../components/templates/Feedback'
import Breadcrumbs from '../components/Breadcrumbs'
import PageTitle from '../components/PageTitle'
import { GuideButton } from '../components/Button'
import { Heading, TextLink } from '../components/Type'
import AddMembersTemplate from '../components/templates/Team/Members/Add'

import safeError from '../utils/safeError'
import { useSession } from '../providers/SessionProvider'

const AddMembers = ({
  match: {
    params: { teamId }
  },
  history
}) => {
  const { organisation, team } = useSession({ teamId })
  const [feedback, setFeedback] = useState({})

  const { loading, data } = useQuery(ListMembers, {
    variables: { teamId },
    fetchPolicy: 'cache-and-network'
  })

  const { slug: orgId, name: organisationName } = organisation || {}
  const { name: teamName } = team || {}
  const {
    team: { members }
  } = data || { team: { members: [] } }

  const [updateMembers, { loading: saving }] = useMutation(UpdateMembers, {
    onCompleted: () => {
      history.push(`/teams/${teamId}/team`)
    },
    onError: error => {
      setFeedback({
        type: 'error',
        message: safeError(error)
      })
    }
  })

  const handleSave = ({ members: newMembers }) => {
    const updatedMembers = members.map(({ uuid }) => uuid).concat(newMembers)
    updateMembers({
      variables: {
        organisation: orgId,
        team: teamId,
        attributes: { members: updatedMembers }
      }
    })
  }

  return (
    <>
      <PageTitle
        id="team.members.add.title"
        breadcrumbs={[teamName, organisationName]}
      />

      <Banner>
        <Box flex={1} mb={[4, 0]}>
          <Breadcrumbs flexWrap={['wrap', 'nowrap']}>
            <TextLink to={`/teams/${teamId}/team`}>
              <FormattedMessage
                id="team.members.heading"
                values={{
                  team: teamName
                }}
              />
            </TextLink>
            <FormattedMessage id={'team.members.add.title'} />
          </Breadcrumbs>
        </Box>
        <Box pr={1} width={[1, 'auto']}>
          <GuideButton href="/docs/account-and-billing/manage-users">
            <FormattedMessage id="team.members.add.guide" />
          </GuideButton>
        </Box>
      </Banner>

      <Flex mx={4} my={4}>
        <Heading as={'h2'} level="sm">
          <FormattedMessage id="team.members.add.heading" />
        </Heading>
      </Flex>

      {feedback && feedback.type && (
        <Feedback
          data-qa="addMembers"
          p={null}
          pt={4}
          px={4}
          pb={0}
          duration={0}
          {...feedback}
        />
      )}
      <Box mx={4}>
        <AddMembersTemplate
          onSave={handleSave}
          teamId={teamId}
          orgId={orgId}
          loading={saving}
        />
      </Box>
    </>
  )
}

export default AddMembers
