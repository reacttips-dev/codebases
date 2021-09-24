import React from 'react'

import { Box } from '@chakra-ui/react'

import { Card, Text } from 'tribe-components'
import { Trans } from 'tribe-translation'

import { LayoutHeader } from 'components/Layout'

import SettingsGroupHeader from 'containers/AdminSettings/components/SettingsGroupHeader'
import Title from 'containers/AdminSettings/containers/network/domain/components/Title'
import CustomDomainForm from 'containers/AdminSettings/containers/network/domain/forms/CustomDomain'
import useGetNetwork from 'containers/Network/useGetNetwork'

import { useResponsive } from 'hooks/useResponsive'

const NetworkDomainSettings = () => {
  const { network } = useGetNetwork()
  const { isMobile } = useResponsive()

  return (
    <Box data-testid="network-domain-settings-container" maxW="100vw">
      {!isMobile && (
        <LayoutHeader
          data-testid="network-domain-settings-header"
          h="auto"
          pb={0}
        >
          <Text textStyle="bold/2xlarge">
            <Trans i18nKey="admin:domain.title" defaults="Domain" />
          </Text>
        </LayoutHeader>
      )}

      <SettingsGroupHeader>
        <Trans i18nKey="admin:domain.general.title" defaults="General" />
      </SettingsGroupHeader>

      <Card data-testid="network-domain-settings-card">
        <Title subdomain={network?.domain}>
          <Trans i18nKey="admin:domain.title" defaults="Domain" />
        </Title>

        <CustomDomainForm />
      </Card>
    </Box>
  )
}

export default NetworkDomainSettings
