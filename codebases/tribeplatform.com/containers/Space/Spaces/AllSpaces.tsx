import React from 'react'

import { SpacesGrid } from 'containers/Space/Spaces/SpacesGrid'

import ErrorPage from '../../../pages/_error'
import useGetExploreSpaces from '../useGetExploreSpaces'

export const AllSpaces = ({ collectionId }: { collectionId?: string }) => {
  const { spaces, loading, isInitialLoading, error } = useGetExploreSpaces({
    limit: 500,
    collectionId,
  })

  if (!loading && error) {
    return <ErrorPage err={error} />
  }

  return <SpacesGrid spaces={spaces} loading={isInitialLoading} />
}
