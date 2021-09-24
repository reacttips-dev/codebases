import { useCallback } from 'react'

import { MutationHookOptions, useMutation } from '@apollo/client'

import {
  UPDATE_MEMBER,
  UpdateMemberMutation,
  UpdateMemberMutationVariables,
} from 'tribe-api/graphql'
import { Member, UpdateMemberInput } from 'tribe-api/interfaces'

const useUpdateMember = () => {
  const [update, { data, error, loading }] = useMutation(UPDATE_MEMBER)

  const updateMember = useCallback(
    (
      memberEntity: Partial<UpdateMemberInput>,
      id?: Member['id'],
      options?: MutationHookOptions<
        UpdateMemberMutation,
        UpdateMemberMutationVariables
      >,
    ) => {
      return update({
        variables: {
          input: memberEntity,
          id,
        },
        ...options,
      })
    },
    [update],
  )

  return { updateMember, data, loading, error }
}

export default useUpdateMember
