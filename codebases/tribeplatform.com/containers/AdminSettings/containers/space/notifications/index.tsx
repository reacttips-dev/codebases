import React, { FC } from 'react'

import { Box } from '@chakra-ui/react'

import { Space } from 'tribe-api'
import { Text } from 'tribe-components'
import { Trans } from 'tribe-translation'

import { LayoutHeader } from 'components/Layout'

import { SpaceNotificationsDefaultSettings } from 'containers/AdminSettings/containers/space/notifications/sections/SpaceNotificationsDefaultSettings'

const SpaceNotificationsSettings: FC<{ slug: Space['slug'] }> = ({ slug }) => (
  <Box>
    <LayoutHeader h="auto" pb={0} pl={[5, 0]} mb={8}>
      <Text textStyle="bold/2xlarge">
        <Trans i18nKey="admin:notifications.title" defaults="Notifications" />
      </Text>
    </LayoutHeader>

    <SpaceNotificationsDefaultSettings slug={slug} />
  </Box>
)

export default SpaceNotificationsSettings
