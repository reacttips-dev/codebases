import React from 'react'

import { Flex, Box } from '../../../Grid'
import { Strong, Text } from '../../../../components/Type'
import Avatar from '../../../Avatar'

const MemberDetail = ({
  displayName,
  role,
  user,
  invitationEmail,
  invitationName
}) => (
  <Flex alignItems="center">
    <Box mr="15px">
      <Avatar
        size="medium"
        name={user?.name || invitationName}
        url={user?.avatar}
        variant={role}
      />
    </Box>
    <Box alignItems="center" flex={1} style={{ overflow: 'hidden' }} mr={3}>
      <Text lineHeight={1} as="div">
        <Strong>{displayName}</Strong>
        <br />
        <Text color="grey400">{user?.email || invitationEmail}</Text>
      </Text>
    </Box>
  </Flex>
)

export default MemberDetail
