import { useCallback } from 'react'

import { useApolloClient } from '@apollo/client'

import {
  ADD_SPACE_MEMBERS,
  AddSpaceMembersMutation,
  AddSpaceMembersMutationVariables,
  GET_SPACE_MEMBERS,
} from 'tribe-api/graphql'
import { AddSpaceMemberInput } from 'tribe-api/interfaces'
import { useToast } from 'tribe-components'
import { useTranslation } from 'tribe-translation'

export type UseAddSpaceMembersProps = () => {
  addSpaceMembers: (
    spaceId: string,
    inputs: AddSpaceMemberInput[],
  ) => Promise<any>
}

export const useAddSpaceMembers: UseAddSpaceMembersProps = () => {
  const apolloClient = useApolloClient()
  const toast = useToast()
  const { t } = useTranslation()

  const addSpaceMembers = useCallback(
    async (spaceId: string, input: AddSpaceMemberInput[]) => {
      const mutateResult = await apolloClient.mutate<
        AddSpaceMembersMutation,
        AddSpaceMembersMutationVariables
      >({
        mutation: ADD_SPACE_MEMBERS,
        variables: {
          input,
          spaceId,
        },
        refetchQueries: [
          {
            query: GET_SPACE_MEMBERS,
            variables: {
              spaceId,
              limit: 100,
            },
          },
        ],
      })

      if (mutateResult.errors) {
        toast({
          title: t('space.addmembers.error.members.title', 'Error'),
          description: t(
            'space.addmembers.error.description',
            'Could not add space members',
          ),
          status: 'error',
        })
      }
      return mutateResult
    },
    [],
  )

  return {
    addSpaceMembers,
  }
}

export default useAddSpaceMembers
