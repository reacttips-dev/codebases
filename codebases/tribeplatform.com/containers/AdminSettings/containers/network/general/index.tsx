import React from 'react'

import { Box } from '@chakra-ui/react'

import {
  Skeleton,
  Text,
  Accordion,
  SkeletonProvider,
  Divider,
} from 'tribe-components'
import { Features, useTribeFeature } from 'tribe-feature-flag'
import { Trans } from 'tribe-translation'

import { LayoutHeader } from 'components/Layout'

import NetworkForm from 'containers/AdminSettings/containers/network/general/forms/NetworkForm'
import useGetNetwork from 'containers/Network/useGetNetwork'

import { useResponsive } from 'hooks/useResponsive'

import SettingsGroupHeader from '../../../components/SettingsGroupHeader'
import Access from './Access'
import DefaultSpaces from './DefaultSpaces'
import NetworkLandingPageSettings from './Landing'

const staticProps = {
  networkAccordion: {
    titleProps: { ellipsis: true },
  },
}

const NetworkGeneralSetting = () => {
  const { network, loading: networkLoading } = useGetNetwork()
  const { isMobile } = useResponsive()

  const { isEnabled: isCustomLandingPagesEnabled } = useTribeFeature(
    Features.CustomLandingPages,
  )

  const { isEnabled: isDefaultSpacesSettingsEnabled } = useTribeFeature(
    Features.DefaultSpacesSettings,
  )
  const loading = !network || networkLoading

  return (
    <SkeletonProvider loading={loading}>
      <Box>
        {!isMobile && (
          <LayoutHeader h="auto" pb={0}>
            <Text textStyle="bold/2xlarge">
              <Trans
                i18nKey="admin:sidebar.settings"
                defaults="Administration"
              />
            </Text>
          </LayoutHeader>
        )}

        <SettingsGroupHeader>
          <Trans i18nKey="admin:general.title" defaults="General" />
        </SettingsGroupHeader>

        <Skeleton>
          <Accordion
            title={network?.name}
            {...staticProps.networkAccordion}
            defaultIndex={0}
            borderBottomLeftRadius="0 !important"
            borderBottomRightRadius="0 !important"
            groupProps={{
              boxShadow: 'none !important',
            }}
          >
            <NetworkForm network={network} />
          </Accordion>
          {isCustomLandingPagesEnabled && (
            <>
              <Divider m={0} />
              <NetworkLandingPageSettings />
            </>
          )}
        </Skeleton>

        {isDefaultSpacesSettingsEnabled && <DefaultSpaces />}
        <Access />
      </Box>
    </SkeletonProvider>
  )
}

export default NetworkGeneralSetting
