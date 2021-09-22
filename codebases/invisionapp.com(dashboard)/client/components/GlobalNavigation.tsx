import React from 'react'
// @ts-ignore
import OriginalGlobalNavigation from '@invisionapp/global-navigation'

export const GlobalNavigation = (props: object) => (
  <div style={{ height: '67px' }}>
    <OriginalGlobalNavigation
      logoURL="/home"
      location=""
      darkBackground={false}
      avatarColor="dark"
      sidebarEnabled
      isDocument={false}
      {...props}
    />
  </div>
)
