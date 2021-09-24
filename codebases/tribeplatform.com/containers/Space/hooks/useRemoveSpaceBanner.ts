import { useCallback } from 'react'

import { SpaceQuery } from 'tribe-api'

import { useUpdateSpace } from 'containers/Space/hooks/useUpdateSpace'

type UseRemoveSpaceBannerResult = {
  removeBanner: () => void
}

export type UseRemoveSpaceBannerProps = {
  space: SpaceQuery['space']
}

export const useRemoveSpaceBanner = ({
  space,
}: UseRemoveSpaceBannerProps): UseRemoveSpaceBannerResult => {
  const { updateSpace } = useUpdateSpace({
    spaceId: space?.id,
  })

  const removeBanner = useCallback(() => {
    updateSpace(
      { bannerId: null },
      {
        update(cache, { data }) {
          cache.modify({
            id: cache.identify(data.updateSpace),
            fields: {
              banner(imageRef, details) {
                return details.DELETE
              },
            },
          })
        },
      },
    )
  }, [updateSpace])

  return {
    removeBanner,
  }
}
