import { useCallback } from 'react'

import { MutationResult, useMutation } from '@apollo/client'

import {
  CREATE_EMOJIS,
  CreateEmojisMutation,
  CreateEmojisMutationVariables,
} from 'tribe-api/graphql'
import { CreateEmojiInput, Emoji } from 'tribe-api/interfaces'

type UseCreateEmojisResult = MutationResult & {
  createEmojis: (input: CreateEmojiInput[]) => Promise<Emoji[]>
}

export const useCreateEmojis = (): UseCreateEmojisResult => {
  const [createEmojisMutation, { called, client, loading }] = useMutation<
    CreateEmojisMutation,
    CreateEmojisMutationVariables
  >(CREATE_EMOJIS)

  const createEmojis = useCallback(
    async (input: CreateEmojiInput[]) => {
      const { data } = await createEmojisMutation({
        variables: { input },
      })

      return data?.createEmojis as Emoji[]
    },
    [createEmojisMutation],
  )

  return { called, client, createEmojis, loading }
}
