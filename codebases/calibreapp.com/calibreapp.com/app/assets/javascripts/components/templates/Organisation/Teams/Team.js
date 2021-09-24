import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useInView } from 'react-intersection-observer'

import { Flex, Box } from '../../../Grid'
import { Td, Tr } from '../../../Table'
import { Strong, Text, TextLink } from '../../../../components/Type'
import { Delete, Edit } from '../../../Actions'
import AvatarStack from '../../../../components/Avatar/Stack'

const Team = ({
  orgId,
  name,
  description,
  slug,
  sitesCount,
  members,
  membersCount,
  onRemove
}) => {
  const [inViewRef, inView] = useInView({
    triggerOnce: false,
    rootMargin: '50% 0% 50%'
  })

  return (
    <Tr key={slug} ref={inViewRef}>
      {inView ? (
        <>
          <Td py="15px">
            <Flex alignItems="center">
              <Box alignItems="center" flex={1} mr={3}>
                <Strong>
                  <TextLink to={`/teams/${slug}`}>{name}</TextLink>
                </Strong>
                <Text as="div" level="xs">
                  {description}
                </Text>
              </Box>
            </Flex>
          </Td>
          <Td py="15px">
            <Flex alignItems="center">
              <Box alignItems="center" flex={1} mr={3}>
                <Text level="sm">
                  {sitesCount > 0 ? (
                    <>
                      {sitesCount}{' '}
                      <FormattedMessage
                        id={`teams.sites.${
                          sitesCount === 1 ? 'singular' : 'plural'
                        }`}
                      />
                    </>
                  ) : (
                    <FormattedMessage id="teams.sites.zero" />
                  )}
                </Text>
              </Box>
            </Flex>
          </Td>
          <Td py="15px">
            <Flex alignItems="center">
              <Box alignItems="center" flex={1} mr={3}>
                <Flex alignItems="center">
                  <Box mr={2} minWidth="100px">
                    <Text level="sm">
                      {membersCount > 0 ? (
                        <>
                          {membersCount}{' '}
                          <FormattedMessage
                            id={`teams.members.${
                              membersCount === 1 ? 'singular' : 'plural'
                            }`}
                          />
                        </>
                      ) : (
                        <FormattedMessage id="teams.members.zero" />
                      )}
                    </Text>
                  </Box>
                  <Box flex={1}>
                    <AvatarStack
                      avatars={members.map(({ user, invitationName }) => ({
                        name: user?.name || invitationName,
                        url: user?.avatar,
                        variant: 'secondary'
                      }))}
                    />
                  </Box>
                </Flex>
              </Box>
            </Flex>
          </Td>
          <Td textAlign="left" alignItems="center">
            <Edit
              label={'Edit'}
              to={`/organisations/${orgId}/teams/${slug}/edit`}
              mr="15px"
            />
            {onRemove && (
              <>
                <FormattedMessage
                  id="teams.prompts.remove"
                  values={{
                    team: name
                  }}
                >
                  {message => (
                    <Delete
                      data-testid={`remove-${slug}`}
                      p="0px"
                      onClick={() => {
                        const matchText = name
                        const response = prompt(message)
                        if (response === matchText) {
                          onRemove(slug)
                        }
                      }}
                    />
                  )}
                </FormattedMessage>
              </>
            )}
          </Td>
        </>
      ) : (
        <Td colSpan="5" py="37px"></Td>
      )}
    </Tr>
  )
}

export default Team
