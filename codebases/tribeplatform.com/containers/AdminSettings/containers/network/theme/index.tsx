import React from 'react'

import { Box } from '@chakra-ui/react'

import { ThemeTokens } from 'tribe-api/interfaces'
import { TribeUIProvider } from 'tribe-components'

import { Content, SidebarLayout, Sidebar } from 'components/Layout'

import Explore from 'containers/Explore/Explore'
import Navbar from 'containers/Network/components/Navbar'
import useNavbar from 'containers/Network/hooks/useNavbar'
import SpaceSidebar from 'containers/Space/components/SpaceSidebar'

import useThemeSettings from '../../../hooks/useThemeSettings'
import { BrowserTabs } from './components/BrowserTabs'

const NetworkThemeSetting = () => {
  const { themeSettings } = useThemeSettings()
  const { hasNavbar } = useNavbar()

  return (
    <Box overflow="hidden" boxShadow="sm">
      <BrowserTabs />
      {hasNavbar && <Navbar isPreview />}
      <TribeUIProvider themeSettings={themeSettings as ThemeTokens} isPreview>
        <SidebarLayout>
          <Sidebar isPreview>
            <SpaceSidebar isPreview />
          </Sidebar>
          <Content>
            <Explore isPreview />
          </Content>
        </SidebarLayout>
      </TribeUIProvider>
    </Box>
  )
}

export default NetworkThemeSetting
