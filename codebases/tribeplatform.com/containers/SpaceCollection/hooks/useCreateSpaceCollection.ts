import { useCallback } from 'react'

import { ApolloCache, useApolloClient } from '@apollo/client'
import { nanoid } from 'nanoid'

import {
  CREATE_SPACE_COLLECTION,
  CreateSpaceCollectionMutation,
  CreateSpaceCollectionMutationVariables,
  GET_SPACE_COLLECTIONS,
  GetSpaceCollectionsQuery,
} from 'tribe-api/graphql'
import { Collection, CreateCollectionInput } from 'tribe-api/interfaces'
import { useToast } from 'tribe-components'
import { useTranslation } from 'tribe-translation'

import { logger } from 'lib/logger'

export type UseCreateSpaceCollectionResult = {
  create: (variables: CreateCollectionInput) => Promise<any>
}

export const useCreateSpaceCollection = (): UseCreateSpaceCollectionResult => {
  const apolloClient = useApolloClient()
  const toast = useToast()
  const { t } = useTranslation()

  const updateSpaceCollectionsCache = (
    cache: ApolloCache<CreateSpaceCollectionMutation>,
    newData: Collection,
  ) => {
    if (!newData) {
      return
    }

    const { getGroups: collections } =
      cache.readQuery<GetSpaceCollectionsQuery>({
        query: GET_SPACE_COLLECTIONS,
      }) || {}

    if (!collections) {
      return
    }

    // Since GetSpaceColletion query need spaces and CREATE_SPACE_COLLECTION does not return spaces then we should add it manually to make the optimistic response work
    newData.spaces = null
    cache.writeQuery<GetSpaceCollectionsQuery>({
      query: GET_SPACE_COLLECTIONS,
      data: {
        getGroups: [...collections, newData],
      },
    })
  }

  const create = useCallback(
    async (input: CreateCollectionInput) => {
      const optimisticCollection: Collection = {
        __typename: 'Collection',
        id: `optimistic-${nanoid()}`,
        ...input,
        slug: '',
        customOrderingIndex: 100,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const mutateResult = await apolloClient.mutate<
        CreateSpaceCollectionMutation,
        CreateSpaceCollectionMutationVariables
      >({
        mutation: CREATE_SPACE_COLLECTION,
        variables: {
          input,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          addGroup: optimisticCollection,
        },
        update: (
          cache: ApolloCache<CreateSpaceCollectionMutation>,
          { data },
        ) => {
          try {
            updateSpaceCollectionsCache(cache, data?.addGroup as Collection)
          } catch (e) {
            logger.error('error updating cache for useCreateSpaceCollection', e)
          }
        },
      })

      if (mutateResult.errors) {
        toast({
          title: t('spaceCollection:newCollection.createError.title', 'Error'),
          description: t(
            'spaceCollection:newCollection.createError.description',
            'Could not create space collection',
          ),
          status: 'error',
        })
        return null
      }
      return mutateResult?.data?.addGroup
    },
    [apolloClient, toast, t],
  )

  return {
    create,
  }
}
