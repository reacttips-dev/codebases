import { useCallback } from 'react'

import { gql, useMutation } from '@apollo/client'

import {
  UpdateImageMutation,
  UpdateImageMutationVariables,
} from 'tribe-api/graphql'
import { UPDATE_IMAGE } from 'tribe-api/graphql/media.gql'
import { Image, UpdateImageInput } from 'tribe-api/interfaces'

const useUpdateImage = (imageId?: Image['id']) => {
  const [updateImageMutation, { loading }] = useMutation<
    UpdateImageMutation,
    UpdateImageMutationVariables
  >(UPDATE_IMAGE)

  const updateImage = useCallback(
    async (input: UpdateImageInput) => {
      if (imageId) {
        updateImageMutation({
          variables: {
            id: imageId,
            input,
          },
          update: cache => {
            cache.writeFragment({
              id: cache.identify({ id: imageId, __typename: 'Image' }),
              fragment: gql`
                fragment Banner on Image {
                  cropX
                  cropY
                  cropHeight
                  cropWidth
                }
              `,
              data: {
                cropX: input.cropX,
                cropY: input.cropY,
                cropWidth: input.cropWidth,
                cropHeight: input.cropHeight,
              },
            })
          },
        })
      }
    },
    [updateImageMutation, imageId],
  )

  return {
    updateImage,
    loading,
  }
}

export default useUpdateImage
