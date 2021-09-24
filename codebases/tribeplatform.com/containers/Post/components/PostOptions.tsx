import React, { useCallback } from 'react'

import { HStack, useDisclosure } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import DeleteBinLineIcon from 'remixicon-react/DeleteBinLineIcon'
import EditBoxLineIcon from 'remixicon-react/EditBoxLineIcon'
import EyeLineIcon from 'remixicon-react/EyeLineIcon'
import EyeOffLineIcon from 'remixicon-react/EyeOffLineIcon'
import MoreLineIcon from 'remixicon-react/MoreLineIcon'
import PushpinLineIcon from 'remixicon-react/PushpinLineIcon'

import { Post, PostStatus, ThemeTokens } from 'tribe-api/interfaces'
import { hasActionPermission } from 'tribe-api/permissions'
import {
  confirm,
  Dropdown,
  DropdownIconButton,
  DropdownItem,
  DropdownList,
  Icon,
  Tooltip,
} from 'tribe-components'
import { Features, useTribeFeature } from 'tribe-feature-flag'
import { Trans, useTranslation } from 'tribe-translation'

import useThemeSettings from 'containers/AdminSettings/hooks/useThemeSettings'
import usePinPost from 'containers/Post/hooks/usePinPost'
import useRemovePost from 'containers/Post/hooks/useRemovePost'
import { decodePostAddress } from 'containers/Post/utils'
import Composer from 'containers/Space/Composer'

import { useSpace } from 'hooks/space/useSpace'

import useHidePost from '../hooks/useHidePost'

const BUTTON_SIZE = 8

interface PostOptions {
  post: Post
}

const PostOptions = ({ post }: PostOptions) => {
  const router = useRouter()
  const isReply = !!post?.repliedTo
  const isSpace = router?.query['space-slug'] != null
  const { t } = useTranslation()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { remove: removePost } = useRemovePost(post)
  const { isPinned, pin: pinPost, unpin: unpinPost } = usePinPost(post)
  const { hide: hidePost, unhide: unhidePost } = useHidePost(post)
  const { themeSettings } = useThemeSettings()
  const { space } = useSpace({
    returnPartialData: true,
    fetchPolicy: 'cache-only',
    variables: {
      slug: post?.space?.slug,
    },
  })

  const isPostDeleted = post?.status === PostStatus.DELETED

  const { authorized: hasPinPostPermission } = hasActionPermission(
    space?.authMemberProps?.permissions as any,
    'pinPostToSpace',
  )

  const { authorized: hasUpdatePostPermission } = hasActionPermission(
    post?.authMemberProps?.permissions || [],
    'updatePost',
  )

  const { authorized: hasRemovePostPermission } = hasActionPermission(
    post?.authMemberProps?.permissions || [],
    'removePost',
  )

  const { authorized: hasHidePostPermission } = hasActionPermission(
    post?.authMemberProps?.permissions || [],
    'hidePost',
  )

  const { isEnabled: isHidePostEnabled } = useTribeFeature(
    Features.HidePostStatus,
  )

  const onPin = useCallback(async () => {
    await pinPost()
  }, [pinPost])

  const onUnpin = useCallback(async () => {
    await unpinPost()
  }, [unpinPost])

  const onEdit = useCallback(() => onOpen(), [])

  const _onDelete = useCallback(async () => {
    if (
      await confirm({
        title: t('post:actions.delete', 'Delete post'),
        body: t(
          'post:delete.confirm',
          'Are you sure you want to delete this post? This cannot be undone.',
        ),
        danger: true,
        proceedLabel: t('common:actions.delete', 'Delete'),
        themeSettings: themeSettings as ThemeTokens,
      })
    ) {
      await removePost()
      const { 'space-slug': spaceSlug } = router?.query || {}
      const postId = decodePostAddress(String(router?.query['post-address']))
        ?.id

      if (post?.id === postId) {
        router.replace('/[space-slug]/[section]', `/${spaceSlug}/posts`)
      }
    }
  }, [post?.id, removePost, router, t, themeSettings])

  const hasAnyPermissions =
    hasRemovePostPermission ||
    hasUpdatePostPermission ||
    hasPinPostPermission ||
    hasHidePostPermission

  if (!hasAnyPermissions) {
    return null
  }

  return (
    <HStack>
      {!isReply && post.isHidden && hasHidePostPermission && (
        <Tooltip
          label={
            <Trans
              i18nKey="post:hidden.tooltip"
              defaults="People won’t see this post in their Feed. It will still be available for the author and in search results."
            />
          }
          closeOnClick={false}
        >
          <span>
            <Icon
              borderRadius="base"
              bgColor="bg.secondary"
              as={EyeOffLineIcon}
              w={BUTTON_SIZE}
              h={BUTTON_SIZE}
              p={2}
              color="label.secondary"
            />
          </span>
        </Tooltip>
      )}
      <div>
        <Dropdown placement="bottom-end">
          <DropdownIconButton
            w={BUTTON_SIZE}
            minW={BUTTON_SIZE}
            h={BUTTON_SIZE}
            p="6px"
            icon={<MoreLineIcon size="20px" />}
            data-testid="post-options-dd"
          />
          <DropdownList>
            {hasPinPostPermission && isSpace && !isReply && (
              <>
                {isPinned ? (
                  <DropdownItem
                    isDisabled={isPostDeleted}
                    onClick={onUnpin}
                    icon={PushpinLineIcon}
                  >
                    <Trans i18nKey="post:actions.unpin" defaults="Unpin post" />
                  </DropdownItem>
                ) : (
                  <DropdownItem
                    isDisabled={isPostDeleted}
                    onClick={onPin}
                    icon={PushpinLineIcon}
                  >
                    <Trans i18nKey="post:actions.pin" defaults="Pin post" />
                  </DropdownItem>
                )}
              </>
            )}
            {hasUpdatePostPermission && (
              <DropdownItem
                isDisabled={isPostDeleted}
                onClick={onEdit}
                icon={EditBoxLineIcon}
                data-testid="post-edit-ddi"
              >
                {isReply ? (
                  <Trans
                    i18nKey="post:actions.editReply"
                    defaults="Edit reply"
                  />
                ) : (
                  <Trans i18nKey="post:actions.edit" defaults="Edit post" />
                )}
              </DropdownItem>
            )}
            {isHidePostEnabled && hasHidePostPermission && !isReply && (
              <>
                {post.isHidden ? (
                  <DropdownItem
                    onClick={unhidePost}
                    icon={EyeLineIcon}
                    data-testid="post-unhide-ddi"
                  >
                    <Trans
                      i18nKey="post:actions.unhide"
                      defaults="Unhide post"
                    />
                  </DropdownItem>
                ) : (
                  <DropdownItem
                    onClick={hidePost}
                    icon={EyeOffLineIcon}
                    data-testid="post-hide-ddi"
                  >
                    <Trans i18nKey="post:actions.hide" defaults="Hide post" />
                  </DropdownItem>
                )}
              </>
            )}
            {hasRemovePostPermission && (
              <DropdownItem
                isDisabled={isPostDeleted}
                onClick={_onDelete}
                icon={DeleteBinLineIcon}
                danger
                data-testid="post-delete-ddi"
              >
                {isReply ? (
                  <Trans
                    i18nKey="post:actions.deleteReply"
                    defaults="Delete reply"
                  />
                ) : (
                  <Trans i18nKey="post:actions.delete" defaults="Delete post" />
                )}
              </DropdownItem>
            )}
          </DropdownList>
        </Dropdown>
      </div>
      {hasUpdatePostPermission && isOpen && (
        <Composer
          post={post}
          space={space as any}
          onCloseCallback={onClose}
          defaultIsOpen
          hasTitle={!post.repliedTo}
        />
      )}
    </HStack>
  )
}

export default PostOptions
