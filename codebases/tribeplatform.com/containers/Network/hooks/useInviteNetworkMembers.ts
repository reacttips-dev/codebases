import { useCallback } from 'react'

import { useMutation } from '@apollo/client'

import {
  InviteMembersMutation,
  InviteMembersMutationVariables,
} from 'tribe-api/graphql'
import { INVITE_NETWORK_MEMBERS } from 'tribe-api/graphql/members.gql'
import { useToast } from 'tribe-components'
import { useTranslation } from 'tribe-translation'

import { logger } from 'lib/logger'

export type UseInviteNetworkMemberReturnType = {
  inviteNetworkMembers: (
    variables: InviteMembersMutationVariables,
  ) => Promise<any>
}

export const useInviteNetworkMembers = (): UseInviteNetworkMemberReturnType => {
  const [callInviteNetworkMembers] = useMutation<
    InviteMembersMutation,
    InviteMembersMutationVariables
  >(INVITE_NETWORK_MEMBERS)
  const toast = useToast()
  const { t } = useTranslation()

  const inviteNetworkMembers = useCallback(
    async ({ input }: InviteMembersMutationVariables) => {
      try {
        const fetchResult = await callInviteNetworkMembers({
          variables: {
            input,
          },
        })

        if (fetchResult.errors) {
          toast({
            title: t(
              'userimport:sentinvitations.error.title',
              'Something went wrong',
            ),
            description:
              (fetchResult.errors[0] as typeof fetchResult)?.errors?.[0]
                ?.message || fetchResult.errors[0]?.message,
            status: 'error',
          })
        } else {
          toast({
            title: t(
              'userimport:sentinvitations.success.title',
              '{{ count }} invitations sent',
              { count: fetchResult.data?.inviteMembers.length },
            ),
          })
        }

        return fetchResult
      } catch (e) {
        logger.error(e)
      }
    },
    [callInviteNetworkMembers, t, toast],
  )

  return {
    inviteNetworkMembers,
  }
}
