import { ReactElement, useCallback } from 'react'

import { useApolloClient } from '@apollo/client'
import { useRouter } from 'next/router'
import DeleteBinLineIcon from 'remixicon-react/DeleteBinLineIcon'

import {
  GET_SPACE_COLLECTIONS,
  GetSpaceCollectionsQuery,
  GetSpaceCollectionsQueryVariables,
  REMOVE_SPACE_COLLECTION,
  RemoveSpaceCollectionMutation,
  RemoveSpaceCollectionMutationVariables,
} from 'tribe-api'
import { SpaceCollection, ThemeTokens } from 'tribe-api/interfaces'
import { confirm, useToast } from 'tribe-components'
import { useTranslation } from 'tribe-translation'

import useThemeSettings from 'containers/AdminSettings/hooks/useThemeSettings'

import { logger } from 'lib/logger'

export const useRemoveSpaceCollection = (spaceCollection: SpaceCollection) => {
  const router = useRouter()
  const toast = useToast()
  const { t } = useTranslation()
  const apolloClient = useApolloClient()

  const { themeSettings } = useThemeSettings()

  const remove = useCallback(async () => {
    if (!spaceCollection?.id) {
      logger.error('spaceCollection id is undefined')
      return
    }

    const { data } = await apolloClient.query<
      GetSpaceCollectionsQuery,
      GetSpaceCollectionsQueryVariables
    >({
      query: GET_SPACE_COLLECTIONS,
    })
    const { getGroups: spaceCollections } = data

    const isEmpty = spaceCollection?.spaces?.totalCount === 0

    const hasOneCollection = spaceCollections?.length === 1
    const canDeleteCollection = !hasOneCollection && isEmpty

    let body: ReactElement = t('spaceCollection:delete.confirm.description', {
      defaultValue: 'Are you sure you want to delete {{name}} collection?',
      name: spaceCollection?.name,
    })
    let actionButtonProps: any = {
      proceedButtonProps: {
        disabled: !canDeleteCollection,
        buttonType: !canDeleteCollection ? 'danger' : 'primary',
      },
    }

    if (!canDeleteCollection) {
      if (!isEmpty) {
        body = t(
          'spaceCollection:delete.confirm.containsSpaces',
          "To delete this collection, you have to first remove the spaces within it. Go to each space's settings to either delete the spaces or move them to a different collection.",
        )
      } else if (hasOneCollection) {
        body = t(
          'spaceCollection:delete.confirm.hasOneCollection',
          'You can’t delete this collection because there is only one.',
        )
      }

      actionButtonProps = {
        proceedLabel: '',
        cancelLabel: t('spaceCollection:delete.confirm.button', 'Got it'),
        cancelButtonProps: {
          variant: 'outline',
          mr: 0,
        },
      }
    }

    const confirmed = await confirm({
      title: t('spaceCollection:delete.confirm.title', {
        defaultValue: 'Delete {{name}} collection',
        name: spaceCollection?.name,
      }),
      body,
      ...actionButtonProps,
      themeSettings: themeSettings as ThemeTokens,
    })
    if (!confirmed) {
      return
    }

    await apolloClient.mutate<
      RemoveSpaceCollectionMutation,
      RemoveSpaceCollectionMutationVariables
    >({
      mutation: REMOVE_SPACE_COLLECTION,
      variables: {
        groupId: spaceCollection?.id,
      },
    })

    try {
      const removeSpaceCollection = (existingPostsRefs, { readField }) => {
        if (Array.isArray(existingPostsRefs)) {
          return existingPostsRefs?.filter(
            edgeRef => spaceCollection?.id !== readField('id', edgeRef),
          )
        }
        return existingPostsRefs
      }
      apolloClient.cache.modify({
        fields: {
          getGroups(existingRepliesRefs, details) {
            return removeSpaceCollection(existingRepliesRefs, details)
          },
        },
      })
    } catch (e) {
      logger.error(
        "couldn't invalidate spaceCollections cache",
        spaceCollection?.id,
        e,
      )
    }

    toast({
      title: t('spaceCollection:delete.success.title', 'Collection deleted'),
      description: t(
        'spaceCollection:delete.success.description',
        'Collection has been deleted.',
      ),
      icon: DeleteBinLineIcon,
    })

    const spaceCollectionId = String(router?.query['collection-id'])

    if (spaceCollection?.id === spaceCollectionId) {
      router.push(`/`)
    }
  }, [spaceCollection, apolloClient, t, toast, router, themeSettings])

  return {
    remove,
  }
}
