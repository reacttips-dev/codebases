import { useCallback } from 'react'

import { useApolloClient } from '@apollo/client'

import {
  CREATE_SPACE,
  CreateSpaceMutation,
  CreateSpaceMutationVariables,
  SpaceFragmentFragment,
} from 'tribe-api/graphql'
import { useToast } from 'tribe-components'
import { useTranslation } from 'tribe-translation'

import { logger } from 'lib/logger'

export type UseCreateSpaceProps = () => {
  createSpace: (
    data: CreateSpaceMutationVariables,
  ) => Promise<SpaceFragmentFragment | null | undefined>
}

export const useCreateSpace: UseCreateSpaceProps = () => {
  const apolloClient = useApolloClient()
  const toast = useToast()
  const { t } = useTranslation()

  const createSpace = useCallback(
    async ({ input }: CreateSpaceMutationVariables) => {
      const { collectionId } = input || {}
      const mutateResult = await apolloClient.mutate<
        CreateSpaceMutation,
        CreateSpaceMutationVariables
      >({
        mutation: CREATE_SPACE,
        variables: {
          input,
        },
        update: (cache, { data }) => {
          if (!data?.addSpace) return
          try {
            cache.modify({
              fields: {
                getSpaces(existingSpacesRefs) {
                  return {
                    ...existingSpacesRefs,
                    edges: [
                      ...existingSpacesRefs?.edges,
                      {
                        cursor: '',
                        node: data?.addSpace,
                        __typename: 'SpacesEdge',
                      },
                    ],
                  }
                },
              },
            })

            if (collectionId) {
              cache.modify({
                id: `Collection:${collectionId}`,
                fields: {
                  spaces(spaceRef) {
                    return {
                      ...spaceRef,
                      edges: [
                        ...spaceRef.edges,
                        { __typename: ' SpaceEdge', node: data?.addSpace },
                      ],
                      totalCount: spaceRef.totalCount + 1,
                    }
                  },
                },
              })
            }
          } catch (e) {
            logger.error(
              'Error while updating cache for useCreateSpace mutation',
              e.message,
            )
          }
        },
      })

      if (mutateResult.errors) {
        toast({
          title: t('space:newspace.createError.title', 'Error'),
          description: t(
            'space:newspace.createError.description',
            'Could not create space',
          ),
          status: 'error',
        })
        return null
      }
      return mutateResult?.data?.addSpace
    },
    [apolloClient, toast, t],
  )

  return {
    createSpace,
  }
}
