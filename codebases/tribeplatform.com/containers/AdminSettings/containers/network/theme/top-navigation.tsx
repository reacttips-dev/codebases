import React, { useState, useCallback } from 'react'

import { Box } from '@chakra-ui/react'

import {
  ThemeTokens,
  TopNavigationAlignment,
  UpdateNavigationItem,
} from 'tribe-api/interfaces'
import { TribeUIProvider } from 'tribe-components'

import { Content, Sidebar, SidebarLayout } from 'components/Layout'

import Explore from 'containers/Explore/Explore'
import Navbar from 'containers/Network/components/Navbar'
import useGetNetwork from 'containers/Network/useGetNetwork'
import SpaceSidebar from 'containers/Space/components/SpaceSidebar'

import useUpdateNetwork from 'hooks/useUpdateNetwork'

import { AdminTopNavigationSidebar } from '../../../components/navigation/AdminTopNavigationSidebar'
import useThemeSettings from '../../../hooks/useThemeSettings'
import { BrowserTabs } from './components/BrowserTabs'

const containerProps = {
  w: { base: 'full', md: 'full' },
  my: 8,
  mx: 'auto',
  px: [0, 12],
}

export const NetworkTopNavigationSettings = () => {
  const { themeSettings } = useThemeSettings()
  const { network, loading: loadingNetwork } = useGetNetwork()
  const [isNavigationEnabled, setIsNavigationEnabled] = useState(
    Boolean(network?.topNavigation?.enabled),
  )
  const [navigationPreviewItems, setNavigationPreviewItems] = useState<
    UpdateNavigationItem[]
  >([])
  const { updateNetwork, loading: updateNetworkLoading } = useUpdateNetwork()

  const handleShowNavigation = (visibility: boolean) => {
    setIsNavigationEnabled(visibility)
  }
  const handleNavigationSave = useCallback(() => {
    const navigationItems = navigationPreviewItems?.map(
      (item: UpdateNavigationItem) => {
        const { link, text, openInNewWindow, type } = item
        return { link, text, openInNewWindow, type }
      },
    )
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateNetwork({
      topNavigation: {
        enabled: isNavigationEnabled,
        alignment: TopNavigationAlignment.LEFT,
        items: navigationItems,
      },
    })
  }, [updateNetwork, isNavigationEnabled, navigationPreviewItems])

  const updatePreviewItems = items => {
    setNavigationPreviewItems(items)
  }
  return (
    <>
      <SidebarLayout>
        <Sidebar>
          <AdminTopNavigationSidebar
            enabled={isNavigationEnabled}
            loading={loadingNetwork}
            handleNavigationVisibility={handleShowNavigation}
            initialItems={network?.topNavigation?.items || []}
            updatePreviewItems={updatePreviewItems}
            handleNavigationSave={handleNavigationSave}
            handleNavigationSaveLoading={updateNetworkLoading}
          />
        </Sidebar>
        <Content>
          <Box {...containerProps}>
            <Box overflow="hidden" boxShadow="sm">
              <BrowserTabs />
              {isNavigationEnabled && (
                <Navbar previewItems={navigationPreviewItems} isPreview />
              )}

              <TribeUIProvider
                themeSettings={themeSettings as ThemeTokens}
                isPreview
              >
                <SidebarLayout>
                  <Sidebar isPreview>
                    <SpaceSidebar
                      isPreview
                      isNavigationPreviewEnabled={isNavigationEnabled}
                    />
                  </Sidebar>
                  <Content>
                    <Explore isPreview />
                  </Content>
                </SidebarLayout>
              </TribeUIProvider>
            </Box>
          </Box>
        </Content>
      </SidebarLayout>
    </>
  )
}
