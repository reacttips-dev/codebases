import React from 'react'

import { SkeletonProvider, SkeletonText } from 'tribe-components'

import { useGetSpaceCollections } from 'containers/SpaceCollection/hooks'

import SpaceSidebarCollectionAccordion from './SpaceSidebarCollectionAccordion'

const SpaceSidebarCollections = () => {
  const { spaceCollections, isInitialLoading } = useGetSpaceCollections()

  return (
    <>
      <SkeletonProvider loading={isInitialLoading}>
        {isInitialLoading && (
          <>
            <SkeletonText mt={3} skeletonHeight={2} width="95%" noOfLines={1} />
            <SkeletonText mt={2} skeletonHeight={2} width="80%" noOfLines={1} />
            <SkeletonText mt={2} skeletonHeight={2} width="80%" noOfLines={1} />
            <SkeletonText mt={2} skeletonHeight={2} width="80%" noOfLines={1} />
          </>
        )}

        {spaceCollections.map(collection => (
          <SpaceSidebarCollectionAccordion
            key={collection?.id}
            collection={collection}
          />
        ))}
      </SkeletonProvider>
    </>
  )
}

export default SpaceSidebarCollections
