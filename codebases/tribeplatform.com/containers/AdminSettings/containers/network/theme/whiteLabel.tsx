import React, { useState, useCallback } from 'react'

import { Box } from '@chakra-ui/react'

import { Content, Sidebar, SidebarLayout } from 'components/Layout'

import Explore from 'containers/Explore/Explore'
import Navbar from 'containers/Network/components/Navbar'
import useNavbar from 'containers/Network/hooks/useNavbar'
import useGetNetwork from 'containers/Network/useGetNetwork'
import SpaceSidebar from 'containers/Space/components/SpaceSidebar'

import useUpdateNetwork from 'hooks/useUpdateNetwork'

import { AdminWhiteLabelSidebar } from '../../../components/navigation/AdminWhiteLabelSidebar'
import { BrowserTabs } from './components/BrowserTabs'

const containerProps = {
  w: { base: 'full', md: 'full' },
  my: 8,
  mx: 'auto',
  px: [0, 12],
}

export const NetworkWhiteLabelSettings = () => {
  const { network, loading: loadingNetwork } = useGetNetwork()
  const [isWhiteLabelEnabled, setIsWhiteLabelEnabled] = useState(
    Boolean(network?.tribeBranding),
  )
  const { updateNetwork, loading: updateNetworkLoading } = useUpdateNetwork()

  const handleWhiteLabelVisibility = (visibility: boolean) => {
    setIsWhiteLabelEnabled(visibility)
  }

  const { hasNavbar: isNavigationEnabled } = useNavbar()

  const handleWhiteLabelSave = useCallback(() => {
    updateNetwork({
      tribeBranding: isWhiteLabelEnabled,
    })
  }, [updateNetwork, isWhiteLabelEnabled])

  return (
    <SidebarLayout>
      <Sidebar>
        <AdminWhiteLabelSidebar
          enabled={isWhiteLabelEnabled}
          loading={loadingNetwork}
          handleWhiteLabelVisibility={handleWhiteLabelVisibility}
          handleWhiteLabelSave={handleWhiteLabelSave}
          handleWhiteLabelSaveLoading={updateNetworkLoading}
        />
      </Sidebar>
      <Content>
        <Box {...containerProps}>
          <Box overflow="hidden" boxShadow="sm">
            <BrowserTabs />
            {isNavigationEnabled && <Navbar isPreview />}

            <SidebarLayout>
              <Sidebar isPreview>
                <SpaceSidebar
                  isPreview
                  isWhiteLabelPreviewEnabled={isWhiteLabelEnabled}
                  isNavigationPreviewEnabled={isNavigationEnabled}
                />
              </Sidebar>
              <Content>
                <Explore isPreview />
              </Content>
            </SidebarLayout>
          </Box>
        </Box>
      </Content>
    </SidebarLayout>
  )
}
