import React from 'react'

import { NextPageContextApp, SidebarKind } from '@types'

import { SpaceQuery, SpaceQueryVariables, SPACE } from 'tribe-api/graphql'
import { Space } from 'tribe-api/interfaces'

import SpaceContainer from 'containers/Space/SpaceContainer'

import { spaceSeo } from 'utils/seo.utils'

const SpacePage = props => <SpaceContainer {...props} />

SpacePage.getInitialProps = async (ctx: NextPageContextApp, { isServer }) => {
  const { apolloClient, query } = ctx

  const spaceQuery = await apolloClient?.query<SpaceQuery, SpaceQueryVariables>(
    {
      query: SPACE,
      fetchPolicy: isServer ? 'network-only' : 'cache-only',
      variables: {
        slug: query['space-slug'] ? String(query['space-slug']) : undefined,
      },
    },
  )

  return {
    namespacesRequired: ['common', 'userimport', 'settings', 'space'],
    sidebarKind: SidebarKind.spaces,
    seo: spaceSeo(spaceQuery?.data?.space as Space),
  }
}

SpacePage.options = {
  permissionScopes: ['exploreSpaces'],
  ssr: {
    Component: SpacePage,
  },
}

export default SpacePage
