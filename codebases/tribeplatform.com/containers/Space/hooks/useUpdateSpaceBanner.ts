import { useCallback } from 'react'

import { FetchResult, gql } from '@apollo/client'

import { SpaceQuery, UpdateSpaceMutation } from 'tribe-api'
import { BannerSaveData } from 'tribe-components'

import { useUpdateSpace } from 'containers/Space/hooks/useUpdateSpace'

import useCreateImages, { UploadedImage } from 'hooks/useCreateImages'

import { logger } from 'lib/logger'

type UseUpdateSpaceBannerResult = {
  updateBanner: (
    payload: BannerSaveData,
  ) => Promise<
    | FetchResult<
        UpdateSpaceMutation,
        Record<string, unknown>,
        Record<string, unknown>
      >
    | undefined
  >
}

export type UseUpdateSpaceBannerProps = {
  space: SpaceQuery['space']
}

export const useUpdateSpaceBanner = ({
  space,
}: UseUpdateSpaceBannerProps): UseUpdateSpaceBannerResult => {
  const { updateSpace } = useUpdateSpace({
    spaceId: space?.id,
  })
  const { upload } = useCreateImages()

  const updateBanner = useCallback(
    async (payload: BannerSaveData) => {
      let uploadResult: UploadedImage[] | undefined

      if (payload.imageFile) {
        uploadResult = await upload([payload as Required<BannerSaveData>])
      }

      if (!uploadResult?.[0]) {
        logger.error('could not upload banner image')
        return
      }

      const [uploadedImage] = uploadResult

      return updateSpace(
        {
          bannerId: uploadedImage.mediaId,
        },
        {
          update: cache => {
            const newBannerData = {
              __typename: 'Image',
              id: uploadedImage.mediaId,
              cropX: payload.cropX,
              cropY: payload.cropY,
              cropWidth: payload.cropWidth,
              cropHeight: payload.cropHeight,
              url: uploadedImage.mediaUrl,
              urls: {
                full: uploadedImage.mediaUrl,
              },
            }

            try {
              cache.writeFragment({
                id: cache.identify(space),
                fragment: gql`
                  fragment _ on Space {
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
                  banner: newBannerData,
                },
              })

              cache.modify({
                id: cache.identify(space),
                fields: {
                  banner() {
                    return newBannerData
                  },
                },
              })
            } catch (e) {
              logger.error('could not update banner image', e)
            }
          },
        },
      )
    },
    [updateSpace, space, upload],
  )

  return {
    updateBanner,
  }
}
