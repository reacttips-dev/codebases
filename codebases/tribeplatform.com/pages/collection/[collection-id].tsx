import { NextPageContextApp, SidebarKind } from '@types'

import { GET_SPACE_COLLECTION } from 'tribe-api'

import { SpaceCollectionContainer } from 'containers/SpaceCollection/SpaceCollectionContainer'

const SpaceCollectionPage = () => <SpaceCollectionContainer />

SpaceCollectionPage.getInitialProps = async (
  context: NextPageContextApp,
  { isServer },
) => {
  const { apolloClient, query } = context
  const { 'collection-id': collectionId } = query || {}

  await apolloClient?.query({
    query: GET_SPACE_COLLECTION,
    variables: {
      groupId: collectionId,
    },
    fetchPolicy: isServer ? 'network-only' : 'cache-only',
  })

  return {
    namespacesRequired: ['common', 'userimport', 'spaceCollection'],
    sidebarKind: SidebarKind.spaces,
  }
}

SpaceCollectionPage.options = {
  permissionScopes: ['getGroup'],
}

export default SpaceCollectionPage
