import React from 'react'

import { Flex, Box } from '../Grid'

import Avatar from './'

const AvatarStack = ({ avatars, ...props }) => (
  <Flex>
    {avatars
      .sort((a, b) => (a?.url ? -1 : b?.url ? 1 : 0))
      .map((avatar, index) => (
        <Box
          key={`avatarstack-${index}`}
          ml={!index || -17}
          style={{ zIndex: avatars.length - index }}
          {...props}
        >
          <Avatar {...avatar} />
        </Box>
      ))}
  </Flex>
)

export default AvatarStack
