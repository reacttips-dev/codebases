import { useCallback } from 'react'

import { Member } from 'tribe-api/interfaces'

import useUpdateMember from 'containers/Member/hooks/useUpdateMember'

type UseRemoveMemberBannerResult = {
  removeBanner: () => void
}

export type UseRemoveMemberBannerProps = {
  member?: Member
}

export const useRemoveMemberBanner = ({
  member,
}: UseRemoveMemberBannerProps): UseRemoveMemberBannerResult => {
  const { updateMember } = useUpdateMember()

  const removeBanner = useCallback(() => {
    updateMember(
      {
        bannerId: null,
      },
      member?.id,
      {
        update: (cache, { data }) => {
          if (data?.updateMember) {
            cache.modify({
              id: cache.identify(data.updateMember),
              fields: {
                banner(imageRef, details) {
                  return details.DELETE
                },
              },
            })
          }
        },
      },
    )
  }, [updateMember, member])

  return {
    removeBanner,
  }
}
