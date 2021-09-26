import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useInView } from 'react-intersection-observer'

import { Flex, Box } from '../../../Grid'
import { Td, Tr } from '../../../Table'
import { Text } from '../../../../components/Type'
import { Remove } from '../../../Actions'
import Avatar from '../../../Avatar'

const Member = ({
  teamName,
  uuid,
  displayName,
  displayEmail,
  invitationEmail,
  invitationName,
  user,
  role,
  isCurrentMember,
  onRemove
}) => {
  const [inViewRef, inView] = useInView({
    triggerOnce: false,
    rootMargin: '50% 0% 50%'
  })

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
                <Text fontSize="16px">{displayName}</Text>
                {displayEmail ? (
                  <Text as="div" fontSize="14px" color="grey300">
                    {displayEmail}
                  </Text>
                ) : null}
              </Box>
            </Flex>
          </Td>
          <Td textAlign="left" alignItems="center">
            <Flex justifyContent="flex-start">
              {onRemove && (
                <>
                  <FormattedMessage
                    id={`team.members.prompts.${
                      isCurrentMember ? 'leave' : 'removeUser'
                    }`}
                    values={{
                      member: displayName,
                      team: teamName
                    }}
                  >
                    {message => (
                      <Remove
                        data-testid={`remove-${uuid}`}
                        p="0px"
                        label={
                          <FormattedMessage
                            id={`team.members.actions.${
                              isCurrentMember ? 'leave' : 'remove'
                            }`}
                          />
                        }
                        onClick={() => {
                          const matchText = isCurrentMember
                            ? teamName
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
            </Flex>
          </Td>
        </>
      ) : (
        <Td colSpan="5" py="37px"></Td>
      )}
    </Tr>
  )
}

export default Member
