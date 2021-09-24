import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useLazyQuery } from '@apollo/client'
import { FormattedMessage, useIntl } from 'react-intl'

import { SearchMembers } from '../../../../queries/TeamMemberQueries.gql'

import Feedback from '../../Feedback'
import Button from '../../../Button'
import { Flex, Box } from '../../../Grid'
import { Text, Strong } from '../../../Type'
import { FieldSet, FieldGroup, Search } from '../../../Forms'
import Pagination from '../../../Pagination'

import safeError from '../../../../utils/safeError'
import { transition } from '../../../../utils/style'

import MemberDetails from './MemberDetails'

const Member = styled(Flex)`
  background-color: ${({ theme }) => theme.colors.grey50};
  margin-bottom: 10px;
  ${transition('background-color')};

  &:hover {
    background-color: ${({ theme }) => theme.colors.green100};
  }

  &:last-child {
    margin-bottom: 0;
  }
`
Member.defaultProps = {
  flexWrap: ['wrap', 'nowrap'],
  bg: 'grey50',
  p: 3,
  alignItems: 'center'
}

const Form = ({
  currentMembershipUuid,
  orgId,
  teamId,
  onUpdate,
  labelId,
  members: initialMembers
}) => {
  const intl = useIntl()
  const [feedback, setFeedback] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [newMembers, setNewMembers] = useState(initialMembers || [])
  const [data, setData] = useState({ loading: true })
  const { members, searchedOn, count } = data

  const [
    getData,
    { loading: searching, data: queryData, fetchMore }
  ] = useLazyQuery(SearchMembers, {
    fetchPolicy: 'cache-and-network',
    onError: error => {
      setFeedback({
        type: 'error',
        message: safeError(error),
        location: 'membersList'
      })
    }
  })

  const { organisation } = queryData || {}
  const {
    membersList: { totalCount, edges, pageInfo }
  } = organisation || {
    membersList: {}
  }
  const { endCursor } = pageInfo || {}

  useEffect(() => {
    if (searchTerm?.length) {
      setData({ ...data, loading: true })

      var filter = {
        emailContains: searchTerm,
        OR: { nameContains: searchTerm }
      }

      if (teamId) filter.NOT = { team: [teamId] }

      getData({
        variables: {
          orgId,
          filter
        }
      })
    } else {
      setData({ loading: false, members: [], searchedOn: null })
    }
  }, [searchTerm])

  useEffect(() => {
    if (!searching && queryData) {
      const updatedMembers = (edges || []).map(({ node }) => ({
        ...node,
        displayName:
          node.uuid === currentMembershipUuid
            ? intl.formatMessage({ id: 'currentUser.displayName' })
            : node.user?.name || node.invitationName
      }))
      setData({
        members: updatedMembers,
        loading: false,
        count: totalCount,
        searchedOn: searchTerm
      })
    }
  }, [searching])

  useEffect(() => {
    if (initialMembers) setNewMembers(initialMembers)
  }, [initialMembers])

  const nextPage = () => {
    fetchMore({
      variables: {
        cursor: endCursor
      },
      updateQuery: (prev, { fetchMoreResult }) =>
        Object.assign({}, prev, {
          organisation: {
            ...prev.organisation,
            // To get around a bug in @apollo/client and to force a re-render
            // we update the top level object …
            bustCache: 1,
            membersList: {
              ...prev?.organisation?.membersList,
              edges: [
                ...prev?.organisation?.membersList?.edges,
                ...fetchMoreResult?.organisation?.membersList?.edges
              ],
              pageInfo: fetchMoreResult?.organisation?.membersList?.pageInfo
            }
          }
        })
    })
  }

  const addMember = newMember => {
    if (!newMembers.find(member => member.uuid === newMember.uuid)) {
      const updatedMembers = [...newMembers, newMember]
      setNewMembers(updatedMembers)
      onUpdate && onUpdate(updatedMembers)
    }
  }

  const removeMember = newMember => {
    const updatedMembers = newMembers.filter(
      member => !(member.uuid === newMember.uuid)
    )
    setNewMembers(updatedMembers)
    onUpdate && onUpdate(updatedMembers)
  }

  const filteredMembers = members?.filter(
    member => !newMembers.find(newMember => newMember.uuid === member.uuid)
  )

  return (
    <>
      {newMembers.length ? (
        <FieldSet mb={0} data-testid="addTeamMemberNewMembers">
          <FieldGroup span={2}>
            <Box mb={2}>
              <Text>
                <FormattedMessage
                  id={labelId}
                  values={{
                    prefix: (
                      <FormattedMessage
                        id={`team.members.summary.prefix.${
                          newMembers.length === 1 ? 'singular' : 'plural'
                        }`}
                      />
                    ),
                    count: (
                      <Strong>
                        {newMembers.length}{' '}
                        <FormattedMessage
                          id={`team.members.summary.${
                            newMembers.length === 1 ? 'singular' : 'plural'
                          }`}
                        />
                      </Strong>
                    )
                  }}
                />
              </Text>
            </Box>
            <div>
              {newMembers.map(member => (
                <Member
                  data-testid={`newMember-${member.uuid}`}
                  key={member.uuid}
                >
                  <Box flex={1} width={[1, 'auto']}>
                    <MemberDetails {...member} />
                  </Box>
                  <Box mt={[2, 0]} ml={[0, '100px']} width={[1, 'auto']}>
                    <Button
                      variant="tertiary"
                      onClick={() => removeMember(member)}
                    >
                      <FormattedMessage id="team.members.add.actions.remove" />
                    </Button>
                  </Box>
                </Member>
              ))}
            </div>
          </FieldGroup>
        </FieldSet>
      ) : null}

      <FieldSet mb={0}>
        <FieldGroup span={2} mb={0}>
          <FormattedMessage id="team.members.add.actions.search">
            {label => (
              <Search
                data-testid="teamMemberSearch"
                width={1}
                placeholder={label}
                onChange={searchTerm =>
                  setSearchTerm(searchTerm?.length ? searchTerm : null)
                }
                loading={(searchTerm && searching) || false}
              />
            )}
          </FormattedMessage>
        </FieldGroup>
      </FieldSet>

      {feedback && feedback.type && (
        <FieldSet mb={0}>
          <FieldGroup span={2}>
            <Feedback
              data-qa="addMembers"
              p={null}
              duration={0}
              {...feedback}
            />
          </FieldGroup>
        </FieldSet>
      )}

      {!searchedOn?.length ? null : filteredMembers?.length ? (
        <FieldSet mb={0} mt="15px" data-testid="addTeamMemberResults">
          <FieldGroup span={2} mb={0}>
            <Box mb="15px">
              <Text as={'h3'} level="sm" color="grey400">
                <FormattedMessage
                  id="team.members.add.found.label"
                  values={{
                    count: (
                      <Strong>
                        {count}{' '}
                        <FormattedMessage
                          id={`team.members.add.found.${
                            count === 1 ? 'singular' : 'plural'
                          }`}
                        />
                      </Strong>
                    )
                  }}
                />
              </Text>
            </Box>
            <div>
              {filteredMembers.map(member => (
                <Member key={member.uuid}>
                  <Box flex={1} width={[1, 'auto']}>
                    <MemberDetails {...member} />
                  </Box>
                  <Box mt={[2, 0]} ml={[0, '100px']} width={[1, 'auto']}>
                    <Button onClick={() => addMember(member)}>
                      <FormattedMessage id="team.members.add.actions.add" />
                    </Button>
                  </Box>
                </Member>
              ))}
            </div>
            {pageInfo?.hasNextPage ? (
              <Box my={3}>
                <Pagination pageInfo={pageInfo} onNext={nextPage} />
              </Box>
            ) : null}
          </FieldGroup>
        </FieldSet>
      ) : (
        <FieldSet mt={4} mb={0}>
          <FieldGroup span={2} mb={0}>
            <Flex bg="grey50" p={3} alignItems="center">
              <Box flex={1} width={[1, 'auto']}>
                <Text>
                  <FormattedMessage
                    id="team.members.add.notFound"
                    values={{
                      found: members.map(({ displayName }) => displayName)
                    }}
                  />
                </Text>
              </Box>
              <Box mt={[2, 0]} ml={[0, '100px']} width={[1, 'auto']}>
                <Button to={`/organisations/${orgId}/members/new`}>
                  <FormattedMessage id="team.members.add.actions.invite" />
                </Button>
              </Box>
            </Flex>
          </FieldGroup>
        </FieldSet>
      )}
    </>
  )
}

Form.defaultProps = {
  labelId: 'team.members.add.selected'
}

export default Form
