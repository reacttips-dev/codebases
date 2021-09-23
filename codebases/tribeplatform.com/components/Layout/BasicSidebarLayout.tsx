import React, { useCallback } from 'react'

import { SidebarKind } from '@types'

import { Content, SidebarLayout, Sidebar } from 'components/Layout'

import AdminSidebar from 'containers/AdminSettings/components/AdminSidebar'
import NetworkAppsSidebar from 'containers/Apps/components/NetworkAppsSidebar'
import SpaceAppsSidebar from 'containers/Apps/components/SpaceAppsSidebar'
import MemberSidebar from 'containers/Member/components/MemberSidebar'
import SpaceSidebar from 'containers/Space/components/SpaceSidebar'

interface BasicSidebarLayoutProps {
  sidebarKind: keyof typeof SidebarKind
}

const BasicSidebarLayout: React.FC<BasicSidebarLayoutProps> = ({
  children,
  sidebarKind,
}) => {
  const renderSidebar = useCallback(() => {
    switch (sidebarKind) {
      case 'admin':
        return <AdminSidebar />

      case 'member':
        return <MemberSidebar />

      case 'networkApps':
        return <NetworkAppsSidebar />

      case 'spaceApps':
        return <SpaceAppsSidebar />

      case 'spaces':
        return <SpaceSidebar />

      default:
    }
  }, [sidebarKind])

  return (
    <SidebarLayout>
      <Sidebar>{renderSidebar()}</Sidebar>
      <Content zIndex="default">{children}</Content>
    </SidebarLayout>
  )
}

export default BasicSidebarLayout
