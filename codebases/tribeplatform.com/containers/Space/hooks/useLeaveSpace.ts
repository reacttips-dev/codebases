import { useCallback } from 'react'

import { FetchResult, useApolloClient } from '@apollo/client'
import UserReceivedLineIcon from 'remixicon-react/UserReceivedLineIcon'

import {
  LeaveSpaceMutation,
  LeaveSpaceMutationVariables,
  LEAVE_SPACE,
  SPACE,
  SpaceQuery,
} from 'tribe-api/graphql'
import { ThemeTokens } from 'tribe-api/interfaces'
import { confirm, useToast } from 'tribe-components'
import { useTranslation } from 'tribe-translation'

import useThemeSettings from 'containers/AdminSettings/hooks/useThemeSettings'

export interface UseLeaveSpaceProps {
  space: SpaceQuery['space']
}

export type UseLeaveSpace = (
  props: UseLeaveSpaceProps,
) => {
  leaveSpace: () => Promise<
    | FetchResult<LeaveSpaceMutation, Record<string, any>, Record<string, any>>
    | undefined
  >
}

export const useLeaveSpace: UseLeaveSpace = ({ space }: UseLeaveSpaceProps) => {
  const apolloClient = useApolloClient()
  const toast = useToast()
  const { t } = useTranslation()
  const { themeSettings } = useThemeSettings()

  const leaveSpace = useCallback(async () => {
    const confirmed = await confirm({
      title: t('space:leave.confirm.title', 'Leave space'),
      body: t('space:leave.confirm.description', {
        defaultValue: 'Are you sure you want to leave {{ space }}?',
        space: space?.name,
      }),
      danger: true,
      themeSettings: themeSettings as ThemeTokens,
    })

    if (!confirmed) {
      return
    }

    const mutateResult = await apolloClient.mutate<
      LeaveSpaceMutation,
      LeaveSpaceMutationVariables
    >({
      mutation: LEAVE_SPACE,
      variables: { spaceId: space?.id },
      refetchQueries: [
        {
          query: SPACE,
          variables: {
            slug: space?.slug,
          },
        },
      ],
    })

    if (!mutateResult.errors) {
      toast({
        title: t('space:leave.success.title', {
          defaultValue: 'You left {{space}} space',
          space: space?.name,
        }),
        description: t('space:leave.success.description', {
          defaultValue: 'You’re not a member of this space anymore.',
          space: space?.name,
        }),
        icon: UserReceivedLineIcon,
      })
    }
    return mutateResult
  }, [
    apolloClient,
    space?.id,
    space?.name,
    space?.slug,
    t,
    themeSettings,
    toast,
  ])

  return {
    leaveSpace,
  }
}
