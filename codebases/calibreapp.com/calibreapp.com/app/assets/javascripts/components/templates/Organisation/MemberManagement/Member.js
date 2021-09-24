import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useInView } from 'react-intersection-observer'
import { isAfter, subDays, formatDistanceToNow, parseISO } from 'date-fns'

import { Flex, Box } from '../../../Grid'
import { Td, Tr } from '../../../Table'
import { Text } from '../../../Type'
import { Remove, Edit, Resend } from '../../../Actions'
import Tooltip from '../../../Tooltip'
import Avatar from '../../../Avatar'

const formatLastSeen = date => {
  if (!date) return ''
  const parsedDate = parseISO(date)

  let startOfDay = new Date(Date.now())
  startOfDay.setHours(0)
  startOfDay.setMinutes(0)
  startOfDay.setSeconds(0)

  if (isAfter(subDays(startOfDay, 30), parsedDate))
    return `${formatDistanceToNow(parsedDate)} ago`
  if (isAfter(subDays(startOfDay, 7), parsedDate)) return 'This month'
  if (isAfter(subDays(startOfDay, 1), parsedDate)) return 'This week'

  return 'Today'
}

const Member = ({
  orgId,
  organisationName,
  uuid,
  displayName,
  state,
  invitationEmail,
  invitationName,
  user,
  role,
  roleLabel,
  stateLabel,
  lastSeenAt,
  isLastAdmin,
  isCurrentMember,
  attributes,
  teamNames,
  shortTeamNames,
  onResendInvite,
  onRemove
}) => {
  const [inViewRef, inView] = useInView({
    triggerOnce: false,
    rootMargin: '50% 0% 50%'
  })
  const invited = state === 'invited'
  const canEdit = role === 'member' || !isLastAdmin
  const canRemove = !(isCurrentMember && isLastAdmin)

  return (
    <Tr key={uuid} ref={inViewRef}>
      {inView ? (
        <>
          <Td py="15px">
            <Flex alignItems="center">
              <Box mr="15px">
                <Avatar
                  size="medium"
                  name={user?.name || invitationName}
                  url={user?.avatar}
                  variant={role}
                />
              </Box>
              <Box
                alignItems="center"
                flex={1}
                style={{ overflow: 'hidden' }}
                mr={3}
              >
                <Text>{displayName}</Text>
                <Text as="div" level="xs" color="grey300">
                  {user?.email || invitationEmail}
                </Text>
              </Box>
            </Flex>
          </Td>
          <Td disabled={invited}>{roleLabel}</Td>
          {attributes.includes('teamNames') ? (
            <Td disabled={invited}>
              {teamNames === shortTeamNames ? (
                teamNames
              ) : (
                <Tooltip label={teamNames}>
                  <>{shortTeamNames}</>
                </Tooltip>
              )}
            </Td>
          ) : null}
          <Td disabled={invited}>{stateLabel}</Td>
          <Td disabled={invited} data-testid="member-last-seen-at">
            {formatLastSeen(lastSeenAt)}
          </Td>
          <Td textAlign="left" alignItems="center">
            <Flex justifyContent="flex-start">
              {invited ? (
                <Resend
                  p="0px"
                  mr="15px"
                  label={
                    <FormattedMessage
                      id={`memberManagement.actions.reinvite`}
                    />
                  }
                  onClick={() => {
                    onResendInvite(uuid)
                  }}
                />
              ) : (
                canEdit && (
                  <Edit
                    p="0px"
                    label={
                      <FormattedMessage id={`memberManagement.actions.edit`} />
                    }
                    mr="15px"
                    to={`/organisations/${orgId}/members/${uuid}/edit`}
                  />
                )
              )}
              <>
                {canRemove && (
                  <>
                    <FormattedMessage
                      id={`memberManagement.prompts.${
                        isCurrentMember ? 'leave' : 'removeUser'
                      }`}
                      values={{
                        member: displayName,
                        organisation: organisationName
                      }}
                    >
                      {message => (
                        <Remove
                          data-testid={`remove-${uuid}`}
                          p="0px"
                          label={
                            <FormattedMessage
                              id={`memberManagement.actions.${
                                isCurrentMember ? 'leave' : 'remove'
                              }`}
                            />
                          }
                          onClick={() => {
                            const matchText = isCurrentMember
                              ? organisationName
                              : displayName
                            const response = prompt(message)
                            if (response === matchText) {
                              onRemove(uuid)
                            }
                          }}
                        />
                      )}
                    </FormattedMessage>
                  </>
                )}
              </>
            </Flex>
          </Td>
        </>
      ) : (
        <Td colSpan="5" py="37px"></Td>
      )}
    </Tr>
  )
}

Member.defaultProps = {
  attributes: []
}

export default Member
