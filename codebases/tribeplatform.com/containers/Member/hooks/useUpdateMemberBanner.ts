import { useCallback } from 'react'

import { FetchResult, gql } from '@apollo/client'

import { Member } from 'tribe-api/interfaces'
import { BannerSaveData } from 'tribe-components'

import useUpdateMember from 'containers/Member/hooks/useUpdateMember'

import useCreateImages from 'hooks/useCreateImages'

import { logger } from 'lib/logger'

type UseUpdateMemberBannerResult = {
  updateBanner: (
    payload: BannerSaveData,
  ) => Promise<
    FetchResult<any, Record<string, any>, Record<string, any>> | undefined
  >
}

export type UseUpdateMemberBannerProps = {
  member?: Member
}

export const useUpdateMemberBanner = ({
  member,
}: UseUpdateMemberBannerProps): UseUpdateMemberBannerResult => {
  const { updateMember } = useUpdateMember()

  const { upload } = useCreateImages()

  const updateBanner = useCallback(
    async (payload: BannerSaveData) => {
      let uploadResult

      if (payload.imageFile) {
        uploadResult = await upload([payload as Required<BannerSaveData>])
      }

      if (!uploadResult?.[0]) {
        logger.error('could not upload banner image')
        return
      }

      const [uploadedImage] = uploadResult

      return updateMember(
        {
          bannerId: uploadedImage.mediaId,
        },
        member?.id,
        {
          update: cache => {
            try {
              if (member) {
                cache.writeFragment({
                  id: cache.identify(member),
                  fragment: gql`
                    fragment _ on Member {
                      banner {
                        ... on Image {
                          cropX
                          cropY
                          cropHeight
                          cropWidth
                          url
                          urls {
                            full
                          }
                        }
                      }
                    }
                  `,
                  data: {
                    banner: {
                      cropX: payload.cropX,
                      cropY: payload.cropY,
                      cropWidth: payload.cropWidth,
                      cropHeight: payload.cropHeight,
                      url: uploadedImage.mediaUrl,
                      urls: {
                        full: uploadedImage.mediaUrl,
                      },
                    },
                  },
                })
              }
            } catch (e) {
              logger.error('could not update banner image', e)
            }
          },
        },
      )
    },
    [updateMember, member, upload],
  )

  return {
    updateBanner,
  }
}
