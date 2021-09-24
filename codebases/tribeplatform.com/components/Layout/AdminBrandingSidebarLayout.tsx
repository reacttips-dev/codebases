import React from 'react'

import {
  Content,
  SidebarLayout,
  Sidebar,
  CenterLayout,
} from 'components/Layout'

import AdminBrandingSidebar from 'containers/AdminSettings/components/AdminBrandingSidebar'
import { NetworkThemeSetting } from 'containers/AdminSettings/containers'

const AdminBrandingSidebarLayout: React.FC = () => (
  <SidebarLayout>
    <Sidebar>
      <AdminBrandingSidebar />
    </Sidebar>
    <Content>
      <CenterLayout fullWidth px={12}>
        <NetworkThemeSetting />
      </CenterLayout>
    </Content>
  </SidebarLayout>
)

export default AdminBrandingSidebarLayout
