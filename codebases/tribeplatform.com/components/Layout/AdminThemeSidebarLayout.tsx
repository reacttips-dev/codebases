import React from 'react'

import { Box } from '@chakra-ui/react'

import { Content, Sidebar, SidebarLayout } from 'components/Layout'
import ThemeSidebarFooter from 'components/Layout/ThemeSidebarFooter'

import AdminThemeSidebar from 'containers/AdminSettings/components/AdminThemeSidebar'
import { NetworkThemeSetting } from 'containers/AdminSettings/containers'
import { ThemeSettingsContextProvider } from 'containers/AdminSettings/hooks/useThemeSettings'

const AdminThemeSidebarLayout: React.FC = () => (
  <ThemeSettingsContextProvider>
    <SidebarLayout>
      <Sidebar footer={<ThemeSidebarFooter />}>
        <AdminThemeSidebar />
      </Sidebar>
      <Content>
        <Box w={{ base: 'full', md: 'full' }} my={8} mx="auto" px={[0, 12]}>
          <NetworkThemeSetting />
        </Box>
      </Content>
    </SidebarLayout>
  </ThemeSettingsContextProvider>
)

export default AdminThemeSidebarLayout
