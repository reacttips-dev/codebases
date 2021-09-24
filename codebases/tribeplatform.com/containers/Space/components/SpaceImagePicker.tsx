import React, { useCallback } from 'react'

import { useApolloClient } from '@apollo/client'
import { EmojiData } from 'emoji-mart'

import {
  ActionPermissions,
  SPACE,
  SpaceQuery,
  UpdateSpaceMutation,
} from 'tribe-api'
import { hasActionPermission } from 'tribe-api/permissions'
import { Avatar, EmojiPicker, ImagePickerDropdown } from 'tribe-components'
import { useTribeFeature, Features } from 'tribe-feature-flag'

import { useUpdateSpace } from 'containers/Space/hooks/useUpdateSpace'

import { useCreateEmojis } from 'hooks/useCreateEmojis'
import useCreateImages from 'hooks/useCreateImages'

type SpaceImagePickerProps = {
  space: SpaceQuery['space']
  preview?: boolean
}

export const SpaceImagePicker = ({
  space,
  preview = false,
}: SpaceImagePickerProps) => {
  const { loading: isUpdatingSpace, updateSpace } = useUpdateSpace({
    spaceId: space?.id,
  })
  const { createEmojis, loading: isCreatingEmojis } = useCreateEmojis()
  const apolloClient = useApolloClient()
  const { upload, isUploading } = useCreateImages()

  const permissions = space?.authMemberProps?.permissions as ActionPermissions[]

  const { authorized: canUpdateSpace } = hasActionPermission(
    permissions || [],
    'updateSpace',
  )

  const { isEnabled: isImagePickerDropdownEnabled } = useTribeFeature(
    Features.ImagePickerDropdown,
  )

  const handleEmojiSelect = useCallback(
    async (emoji: EmojiData) => {
      if (emoji?.id) {
        const emojis = await createEmojis([{ text: emoji?.id }])
        let data: UpdateSpaceMutation | null | undefined

        if (emojis[0]?.id) {
          const updateSpaceResult = await updateSpace({
            imageId: emojis[0]?.id,
          })

          data = updateSpaceResult?.data
        }

        if (data?.updateSpace) {
          apolloClient?.writeQuery<SpaceQuery>({
            query: SPACE,
            variables: {
              id: space?.id,
            },
            data: {
              space: {
                ...space,
                image: data?.updateSpace?.image,
              },
            },
          })
        }
      }
    },
    [createEmojis, apolloClient, space, updateSpace],
  )

  const handleFileUpload = useCallback(
    async (file: File) => {
      const result = await upload([
        {
          imageFile: file,
        },
      ])

      const { mediaId, mediaUrl } = (result && result[0]) || {}

      if (mediaId && mediaUrl) {
        const { data } = await updateSpace({
          imageId: mediaId,
        })

        if (data?.updateSpace) {
          apolloClient?.writeQuery<SpaceQuery>({
            query: SPACE,
            variables: {
              id: space?.id,
            },
            data: {
              space: {
                ...space,
                image: data?.updateSpace?.image,
              },
            },
          })
        }
      }
    },
    [apolloClient, space, updateSpace, upload],
  )

  if (!isImagePickerDropdownEnabled) {
    return preview || !canUpdateSpace ? (
      <Avatar src={space?.image} size="lg" name={space?.name} />
    ) : (
      <EmojiPicker onSelect={handleEmojiSelect}>
        <Avatar src={space?.image} size="lg" name={space?.name} />
      </EmojiPicker>
    )
  }

  return (
    <ImagePickerDropdown
      emojiSize="md"
      image={space?.image}
      imageBoxSize={10}
      isDisabled={preview || !canUpdateSpace}
      isLoading={isUploading || isCreatingEmojis || isUpdatingSpace}
      onEmojiSelect={handleEmojiSelect}
      onFileUpload={handleFileUpload}
      onLinkUpload={handleFileUpload}
    />
  )
}
