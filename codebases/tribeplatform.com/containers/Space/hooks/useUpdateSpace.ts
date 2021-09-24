import { useCallback } from 'react'

import { FetchResult, MutationHookOptions, useMutation } from '@apollo/client'

import {
  UPDATE_SPACE,
  UpdateSpaceMutation,
  UpdateSpaceMutationVariables,
} from 'tribe-api/graphql'
import { UpdateSpaceInput } from 'tribe-api/interfaces'

type UseUpdateSpaceResult = {
  updateSpace: (
    input: UpdateSpaceInput,
    options?: Record<string, unknown>,
  ) => Promise<
    FetchResult<
      UpdateSpaceMutation,
      Record<string, unknown>,
      Record<string, unknown>
    >
  >
  loading: boolean
}

export type UseUpdateSpaceProps = {
  spaceId: string
  mutationOptions?: MutationHookOptions<
    UpdateSpaceMutation,
    UpdateSpaceMutationVariables
  >
}

export const useUpdateSpace = ({
  spaceId,
  mutationOptions,
}: UseUpdateSpaceProps): UseUpdateSpaceResult => {
  const [callUpdateSpace, { loading }] = useMutation<
    UpdateSpaceMutation,
    UpdateSpaceMutationVariables
  >(UPDATE_SPACE, {
    ...mutationOptions,
  })

  const updateSpace = useCallback(
    async (input: UpdateSpaceInput, options) =>
      callUpdateSpace({
        variables: {
          input,
          id: spaceId,
        },
        ...options,
      }),
    [callUpdateSpace, spaceId],
  )

  return {
    updateSpace,
    loading,
  }
}
