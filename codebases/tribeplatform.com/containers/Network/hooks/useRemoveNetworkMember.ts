import { useCallback } from 'react'

import { useMutation } from '@apollo/client'
import { ApolloCache } from '@apollo/client/cache/core/cache'
import produce from 'immer'
import DeleteBinLineIcon from 'remixicon-react/DeleteBinLineIcon'

import {
  GET_NETWORK_MEMBERS,
  GetNetworkMembersQuery,
  RemoveMemberMutation,
  RemoveMemberMutationVariables,
} from 'tribe-api/graphql'
import { REMOVE_MEMBER } from 'tribe-api/graphql/members.gql'
import {
  ActionStatus,
  Member,
  PaginatedMember,
  ThemeTokens,
} from 'tribe-api/interfaces'
import { confirm, useToast } from 'tribe-components'
import { useTranslation } from 'tribe-translation'

import useThemeSettings from 'containers/AdminSettings/hooks/useThemeSettings'
import useGetNetwork from 'containers/Network/useGetNetwork'

import { logger } from 'lib/logger'

export type UseRemoveNetworkMemberProps = () => {
  removeMember: (member: Member) => Promise<any>
}

export const useRemoveNetworkMember: UseRemoveNetworkMemberProps = () => {
  const { network } = useGetNetwork()
  const [callRemoveMember] = useMutation<
    RemoveMemberMutation,
    RemoveMemberMutationVariables
  >(REMOVE_MEMBER)
  const toast = useToast()
  const { t } = useTranslation()
  const { themeSettings } = useThemeSettings()

  const updateNetworkMembersCache = (
    cache: ApolloCache<RemoveMemberMutation>,
    member: Member,
  ) => {
    const { getMembers: members } =
      cache.readQuery<GetNetworkMembersQuery>({
        query: GET_NETWORK_MEMBERS,
      }) || {}

    const newMembers = produce(members as PaginatedMember, draft => {
      if (draft.edges) {
        const index = draft.edges.findIndex(edge => edge.node.id === member.id)
        if (index !== -1) {
          draft.edges?.splice(index, 1)
        }
      }
    })

    cache.writeQuery<GetNetworkMembersQuery>({
      query: GET_NETWORK_MEMBERS,
      data: {
        getMembers: newMembers,
      },
    })
  }

  const removeMember = useCallback(
    async member => {
      const confirmed = await confirm({
        title: t('network:member.remove.confirm.title', {
          defaultValue: 'Remove user from {{network}}',
          network: network?.name,
        }),
        body: t('network:member.remove.confirm.description', {
          defaultValue:
            'Are you sure you want to remove {{member}} from {{network}}? This cannot be undone.',
          network: network?.name,
          member: member.name,
        }),
        themeSettings: themeSettings as ThemeTokens,
      })
      if (!confirmed) {
        return
      }

      const memberId = member.id

      const fetchResult = await callRemoveMember({
        variables: { memberId },
        optimisticResponse: {
          __typename: 'Mutation',
          removeMember: {
            __typename: 'Action',
            status: ActionStatus.SUCCEEDED,
          },
        },
        update: (cache: ApolloCache<RemoveMemberMutation>) => {
          try {
            updateNetworkMembersCache(cache, member)
          } catch (e) {
            logger.debug(
              'error - updating GET_NETWORK_MEMBERS for useRemoveNetworkMember',
              e,
            )
          }
        },
      })

      if (!fetchResult.errors) {
        toast({
          title: t('network:member.remove.success.title', {
            defaultValue: 'User removed',
          }),
          description: t('network:member.remove.success.description', {
            defaultValue: '{{member}} has been removed from {{network}}.',
            network: network?.name,
            member: member.name,
          }),
          icon: DeleteBinLineIcon,
        })
      }

      return fetchResult
    },
    [callRemoveMember, network?.name, t, themeSettings, toast],
  )

  return {
    removeMember,
  }
}
