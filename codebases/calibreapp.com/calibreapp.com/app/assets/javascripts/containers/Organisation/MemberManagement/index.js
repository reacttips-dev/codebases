import React, { useMemo, useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { FormattedMessage, injectIntl } from 'react-intl'
import matchSorter from 'match-sorter'

import {
  ListMembers,
  DeleteMember,
  SendMemberInvite
} from '../../../queries/MemberManagementQueries.gql'

import { Flex, Box } from '../../../components/Grid'
import { Banner } from '../../../components/Layout'
import useFeedback from '../../../hooks/useFeedback'
import Feedback from '../../../components/templates/Feedback'
import { LoadingLayout } from '../../../components/Loading/'
import Breadcrumbs from '../../../components/Breadcrumbs'
import PageTitle from '../../../components/PageTitle'
import Button from '../../../components/Button'
import { Heading, Strong } from '../../../components/Type'
import Search from '../../../components/Forms/Search'
import MembersList from '../../../components/templates/Organisation/MemberManagement/MembersList'
import FeedbackBlock from '../../../components/FeedbackBlock'

import safeError from '../../../utils/safeError'
import { useSession } from '../../../providers/SessionProvider'
import { collectionLabel } from '../../../utils/labels'

const MemberManagement = injectIntl(
  ({
    intl,
    match: {
      params: { orgId }
    }
  }) => {
    const { membership } = useSession({ orgId })
    const { feedback, setFeedback, clearFeedback } = useFeedback()
    const [searchTerm, setSearchTerm] = useState(null)
    const [initialLoadComplete, setInitialLoadComplete] = useState(false)
    const [members, setMembers] = useState([])
    const [counts, setCounts] = useState({
      totalActiveCount: 0,
      totalInvitedCount: 0
    })
    const [filtered, setFiltered] = useState(false)

    const { loading, data, fetchMore } = useQuery(ListMembers, {
      variables: {
        orgId: orgId
      },
      fetchPolicy: 'cache-and-network',
      onError: error => {
        setInitialLoadComplete(true)
        setFeedback({
          type: 'error',
          message: safeError(error),
          location: 'membersList'
        })
      },
      onCompleted: () => {
        setInitialLoadComplete(true)
      }
    })

    const { organisation } = data || {}
    const {
      activeMembersList: { totalCount: totalActiveCount },
      invitedMembersList: { totalCount: totalInvitedCount },
      membersList: { edges, pageInfo }
    } = organisation || {
      activeMembersList: {},
      invitedMembersList: {},
      membersList: {}
    }
    const { endCursor } = pageInfo || {}
    const { uuid: currentMemberUuid } = membership || {}

    const [deleteMember] = useMutation(DeleteMember, {
      onCompleted: ({ deleteMember: member }) => {
        const { uuid, user, invitationName, state } = member || {}
        const samlUser = state === 'saml'

        if (uuid === currentMemberUuid) {
          window.location = '/home'
        } else {
          let updatedTotalActiveCount = totalActiveCount
          let updatedTotalInviteCount = totalInvitedCount

          const updatedMembers = members.filter(member => {
            if (member.uuid === uuid) {
              if (member.state === 'invited') {
                updatedTotalInviteCount -= 1
              } else {
                updatedTotalActiveCount -= 1
              }
              return false
            }

            return true
          })

          setCounts({
            totalActiveCount: updatedTotalActiveCount,
            totalInvitedCount: updatedTotalInviteCount
          })

          setMembers(updatedMembers)

          setFeedback({
            type: 'success',
            location: 'membersList',
            message: (
              <FormattedMessage
                id={`memberManagement.notifications.${
                  samlUser ? 'samlRemoveSuccess' : 'removeSuccess'
                }`}
                values={{
                  member: (
                    <Strong color={'green400'}>
                      {user?.name || invitationName}
                      {samlUser ? '' : '‘s'}
                    </Strong>
                  ),
                  organisation: organisationName
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
          location: 'membersList'
        })
      }
    })

    const [resendInvite] = useMutation(SendMemberInvite, {
      onCompleted: ({ sendMemberInvite: invitedMember }) => {
        setFeedback({
          type: 'success',
          location: 'membersList',
          message: (
            <FormattedMessage
              id={'memberManagement.notifications.reinviteSuccess'}
              values={{
                member: (
                  <Strong color={'green400'}>
                    {invitedMember?.invitationName}
                  </Strong>
                )
              }}
            />
          )
        })
      },
      onError: error => {
        setFeedback({
          type: 'error',
          message: safeError(error),
          location: 'membersList'
        })
      }
    })

    useEffect(() => {
      if (!loading) {
        const members = (edges || []).map(({ node }) => {
          const teamNames = (node.teams || []).map(({ name }) => name)
          return {
            ...node,
            displayName:
              node.uuid === currentMemberUuid
                ? intl.formatMessage({ id: 'currentUser.displayName' })
                : node.user?.name || node.invitationName,
            roleLabel: intl.formatMessage({
              id: `memberManagement.label.role.${node.role}`
            }),
            stateLabel: intl.formatMessage({
              id: `memberManagement.authentication.label.${
                node.user?.authMethod || node.state
              }`
            }),
            shortTeamNames: collectionLabel(teamNames),
            teamNames: teamNames.join(', ')
          }
        })
        setMembers(members)

        setCounts({ totalActiveCount, totalInvitedCount })
        setFiltered(searchTerm?.length)
      }
    }, [loading, searchTerm])

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

    const handleRemove = uuid => {
      deleteMember({ variables: { organisation: orgId, uuid } })
    }

    const handleResendInvite = uuid => {
      resendInvite({
        variables: {
          organisation: orgId,
          uuid: uuid
        }
      })
    }

    const organisationName = useMemo(() => organisation?.name, [
      initialLoadComplete
    ])
    const saml = useMemo(() => organisation?.saml, [initialLoadComplete])

    if (!initialLoadComplete) return <LoadingLayout />

    const filteredMembers = searchTerm?.length
      ? matchSorter(members, searchTerm, {
          keys: [
            'displayName',
            'user.name',
            'user.email',
            'teams',
            'invitationName',
            'invitationEmail',
            'roleLabel',
            'stateLabel'
          ]
        })
      : members

    return (
      <>
        <PageTitle
          id="memberManagement.title"
          breadcrumbs={[organisationName]}
        />

        <Banner variant="button">
          <Box flex={1} mb={[4, 0]}>
            <Breadcrumbs>
              <FormattedMessage
                id="memberManagement.heading"
                values={{
                  organisation: organisationName
                }}
              />
            </Breadcrumbs>
          </Box>
          <Box pr={1} width={[1, 'auto']}>
            <Button to={`/organisations/${orgId}/members/new`}>
              <FormattedMessage
                id="memberManagement.actions.invite"
                values={{
                  organisation: organisationName
                }}
              />
            </Button>
          </Box>
        </Banner>

        {feedback &&
          (feedback.type === 'error' || feedback.type === 'info') &&
          feedback.location === 'membersList' && (
            <Feedback
              data-qa="memberManagementWarningError"
              p={null}
              pt={4}
              px={4}
              pb={2}
              duration={0}
              onDismiss={() => clearFeedback()}
              {...feedback}
            />
          )}
        {loading ? null : (
          <>
            {saml && (
              <FeedbackBlock m={4} type="info">
                <FormattedMessage id="memberManagement.notifications.samlInfo" />
              </FeedbackBlock>
            )}
            <Flex
              alignItems="center"
              justifyContent="space-between"
              mx={4}
              mt={3}
            >
              <Heading as={'h2'} level="sm" color="grey400">
                {filtered ? (
                  <FormattedMessage
                    id="memberManagement.memberSummary.filtered"
                    values={{
                      filterCount: <Strong>{filteredMembers.length}</Strong>,
                      filterPeople: (
                        <Strong>
                          <FormattedMessage
                            id={`memberManagement.memberSummary.${
                              filteredMembers.length === 1 ? 'person' : 'people'
                            }`}
                          />
                        </Strong>
                      )
                    }}
                  />
                ) : (
                  <FormattedMessage
                    id={`memberManagement.memberSummary.${
                      counts.totalInvitedCount === 0
                        ? 'members'
                        : 'membersAndInvites'
                    }`}
                    values={{
                      count: <Strong>{counts.totalActiveCount}</Strong>,
                      people: (
                        <Strong>
                          {counts.totalActiveCount === 1 ? 'person' : 'people'}
                        </Strong>
                      ),
                      invitationCount: (
                        <Strong>{counts.totalInvitedCount}</Strong>
                      ),
                      pendingInvitations: (
                        <Strong>
                          <FormattedMessage
                            id={`memberManagement.memberSummary.pendingInvitation${
                              counts.totalInvitedCount === 1 ? '' : 's'
                            }`}
                          />
                        </Strong>
                      )
                    }}
                  />
                )}
              </Heading>
              <Search
                type="search"
                onChange={searchTerm =>
                  setSearchTerm(searchTerm?.length ? searchTerm : null)
                }
                placeholder={intl.formatMessage({
                  id: `memberManagement.actions.search`
                })}
                loading={initialLoadComplete ? searchTerm && loading : false}
              />
            </Flex>
          </>
        )}
        {feedback &&
          feedback.location === 'membersList' &&
          feedback.type === 'success' && (
            <Feedback
              data-qa="memberManagementSuccess"
              p={null}
              pt={4}
              px={4}
              pb={0}
              duration={0}
              onDismiss={() => clearFeedback()}
              {...feedback}
            />
          )}
        <Box mx={4} mt={feedback.location === 'membersList' ? 3 : '50px'}>
          <MembersList
            pageInfo={pageInfo}
            members={filteredMembers}
            orgId={orgId}
            currentMemberUuid={currentMemberUuid}
            nextPage={nextPage}
            organisationName={organisationName}
            onRemove={handleRemove}
            onResendInvite={handleResendInvite}
          />
        </Box>
      </>
    )
  }
)

export default MemberManagement
