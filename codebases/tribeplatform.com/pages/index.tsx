import React from 'react'

import { NextPageContextApp, SidebarKind } from '@types'

import { NetworkLandingPage, RoleType } from 'tribe-api'

import LandingContainer from 'containers/Landing'

const LandingPage = props => <LandingContainer {...props} />

LandingPage.getInitialProps = async (ctx: NextPageContextApp) => {
  const { network, authToken } = ctx
  const { role } = authToken || {}
  const { landingPageForMember, landingPageForGuest } =
    network?.landingPages || {}

  const landingPage =
    role?.type === RoleType.GUEST ? landingPageForGuest : landingPageForMember

  switch (landingPage) {
    case NetworkLandingPage.SPACES:
      return {
        namespacesRequired: ['common', 'userimport', 'settings'],
        sidebarKind: SidebarKind.spaces,
        seo: {
          title: `Spaces ${network ? `- ${network?.name}` : ''}`,
        },
      }
    case NetworkLandingPage.EXPLORE:
      return {
        namespacesRequired: ['common', 'userimport', 'post', 'explore'],
        sidebarKind: SidebarKind.spaces,
      }
    case NetworkLandingPage.FEED:
    default:
      return {
        namespacesRequired: ['common', 'userimport', 'post'],
        sidebarKind: SidebarKind.spaces,
      }
  }
}

LandingPage.options = {
  permissionScopes: ['getNetwork', 'getFeed', 'exploreSpaces'],
  ssr: {
    Component: LandingPage,
  },
}

export default LandingPage
