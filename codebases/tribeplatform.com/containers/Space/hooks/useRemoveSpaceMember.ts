import { useCallback } from 'react'

import { FetchResult, gql, useApolloClient } from '@apollo/client'
import { ApolloCache } from '@apollo/client/cache/core/cache'
import UserReceivedLineIcon from 'remixicon-react/UserReceivedLineIcon'

import {
  REMOVE_SPACE_MEMBERS,
  RemoveSpaceMembersMutation,
  RemoveSpaceMembersMutationVariables,
  SpaceQuery,
} from 'tribe-api/graphql'
import { ActionStatus, Member, ThemeTokens } from 'tribe-api/interfaces'
import { confirm, useToast } from 'tribe-components'
import { useTranslation } from 'tribe-translation'

import useThemeSettings from 'containers/AdminSettings/hooks/useThemeSettings'

import { logger } from 'lib/logger'

export type UseRemoveSpaceMemberProps = (
  space: SpaceQuery['space'],
) => {
  removeSpaceMember: (
    member: Member,
  ) => Promise<
    | FetchResult<
        RemoveSpaceMembersMutation,
        Record<string, any>,
        Record<string, any>
      >
    | undefined
  >
}

export const useRemoveSpaceMember: UseRemoveSpaceMemberProps = space => {
  const apolloClient = useApolloClient()
  const toast = useToast()
  const { t } = useTranslation()
  const { themeSettings } = useThemeSettings()

  const updateSpace = (
    cache: ApolloCache<RemoveSpaceMembersMutation>,
    space: SpaceQuery['space'],
  ) => {
    cache.writeFragment({
      id: cache.identify(space),
      fragment: gql`
        fragment _ on Space {
          membersCount
        }
      `,
      data: {
        membersCount: Math.max(space.membersCount - 1, 0),
      },
    })
  }

  const updateSpaceMembers = (
    cache: ApolloCache<RemoveSpaceMembersMutation>,
    member: Member,
  ) => {
    const removeSpaceMember = (existingRefs, { readField }) => {
      if (Array.isArray(existingRefs?.edges)) {
        return {
          ...existingRefs,
          edges: existingRefs?.edges?.filter(
            memberRef =>
              member?.id !== readField('id', memberRef?.node?.member),
          ),
        }
      }
      return existingRefs
    }
    cache.modify({
      fields: {
        getSpaceMembers(existingRepliesRefs, details) {
          return removeSpaceMember(existingRepliesRefs, details)
        },
      },
    })
  }

  const removeSpaceMembers = useCallback(
    async member => {
      const confirmed = await confirm({
        title: t('space.member.remove.confirm.title', 'Remove user from space'),
        body: t('space.member.remove.confirm.description', {
          defaultValue:
            'Are you sure you want to remove {{user}} from {{space}}?',
          user: member.name,
          space: space.name,
        }),
        themeSettings: themeSettings as ThemeTokens,
      })

      if (!confirmed) {
        return
      }

      const fetchResult = await apolloClient.mutate<
        RemoveSpaceMembersMutation,
        RemoveSpaceMembersMutationVariables
      >({
        mutation: REMOVE_SPACE_MEMBERS,
        variables: { memberIds: [member.id], spaceId: space.id },
        optimisticResponse: {
          __typename: 'Mutation',
          removeSpaceMembers: [
            {
              __typename: 'Action',
              status: ActionStatus.SUCCEEDED,
            },
          ],
        },
        update: (cache: ApolloCache<RemoveSpaceMembersMutation>) => {
          try {
            updateSpace(cache, space)
          } catch (e) {
            logger.error(
              'error - updating GET_SPACE for useRemoveSpaceMember',
              e,
            )
          }
          try {
            updateSpaceMembers(cache, member)
          } catch (e) {
            // this is normal when there is no GET_SPACE_MEMBERS query in ROOT_QUERY
            logger.debug(
              'error - updating GET_SPACE_MEMBERS for useRemoveSpaceMember',
              e,
            )
          }
        },
      })

      if (!fetchResult.errors) {
        toast({
          title: t('space.member.remove.success.title', {
            defaultValue: 'User removed',
          }),
          description: t('space.member.remove.success.description', {
            defaultValue: '{{member}} has been removed from {{space}}.',
            space: space.name,
            member: member.name,
          }),
          icon: UserReceivedLineIcon,
        })
      }

      return fetchResult
    },
    [t, space, themeSettings, apolloClient, toast],
  )

  return {
    removeSpaceMember: removeSpaceMembers,
  }
}
