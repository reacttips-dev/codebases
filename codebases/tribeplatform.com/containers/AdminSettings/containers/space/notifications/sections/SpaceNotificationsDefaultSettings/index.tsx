import React, { FC, memo, useCallback, useEffect, useMemo } from 'react'

import { Box, HStack } from '@chakra-ui/react'
import isEmpty from 'lodash/isEmpty'
import { useForm } from 'react-hook-form'

import { Space, SpaceNotificationPreference } from 'tribe-api'
import { NotificationChannel } from 'tribe-api/interfaces'
import {
  Accordion,
  Button,
  Divider,
  Skeleton,
  SkeletonProvider,
  useToast,
} from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import { SpaceNotificationDefaultSettingsCheckboxFormControl } from 'containers/AdminSettings/containers/space/notifications/sections/SpaceNotificationsDefaultSettings/components/SpaceNotificationDefaultSettingsCheckboxFormControl'
import { SpaceNotificationDefaultSettingsRadioGroupFormControl } from 'containers/AdminSettings/containers/space/notifications/sections/SpaceNotificationsDefaultSettings/components/SpaceNotificationDefaultSettingsRadioGroupFormControl'
import { SpaceNotificationDefaultSettingsSelectFormControl } from 'containers/AdminSettings/containers/space/notifications/sections/SpaceNotificationsDefaultSettings/components/SpaceNotificationDefaultSettingsSelectFormControl'

import { useMemberNotificationSettings } from 'hooks/members/useMemberNotificationSettings'
import { useUpdateMemberSpaceNotificationSettings } from 'hooks/members/useUpdateMemberSpaceNotificationSettings'
import useAuthMember from 'hooks/useAuthMember'

import { logger } from 'lib/logger'

import {
  SpaceNotificationPreferenceOption,
  SpaceNotificationsDefaultSettingsFormValues,
} from './@types'

export const SpaceNotificationsDefaultSettings: FC<{
  slug: Space['slug']
}> = memo(({ slug }) => {
  const { t } = useTranslation()
  const { authUser } = useAuthMember()

  const {
    loading: isUpdatingMemberSpaceNotificationSettings,
    updateMemberSpaceNotificationSettings,
  } = useUpdateMemberSpaceNotificationSettings()

  const {
    loading: isLoadingMemberNotificationSettings,
    memberNotificationSettings,
  } = useMemberNotificationSettings({
    variables: {
      id: authUser?.id,
    },
  })

  const toast = useToast()

  const SPACE_NOTIFICATIONS_PREFERENCE_OPTIONS: SpaceNotificationPreferenceOption[] = useMemo(
    () => [
      {
        description: t(
          'admin:notifications.allPostsAndReplies.description',
          'New posts and replies in this space.',
        ),
        label: t(
          'admin:notifications.allPostsAndReplies.label',
          'All posts and replies',
        ),
        value: SpaceNotificationPreference.ALL,
      },
      {
        description: t(
          'admin:notifications.newPosts.description',
          'Only new posts in this space.',
        ),
        label: t('admin:notifications.newPosts.label', 'New posts'),
        value: SpaceNotificationPreference.NEW_POST,
      },
      // TODO: Add this option when follow/unfollow logic for individual posts will be implemented
      // {
      //   description: t(
      //     'admin:notifications.onlyRelatedNotifications.description',
      //     'Replies to followed posts.',
      //   ),
      //   label: t(
      //     'admin:notifications.onlyRelatedNotifications.label',
      //     'Only related notifications',
      //   ),
      //   value: SpaceNotificationPreference.RELATED,
      // },
      {
        description: t(
          'admin:notifications.mute.description',
          'No notifications from this space.',
        ),
        label: t('admin:notifications.mute.label', 'Mute'),
        value: SpaceNotificationPreference.NONE,
      },
    ],
    [t],
  )

  const currentSpaceNotificationSettings = memberNotificationSettings?.spaces?.filter(
    ({ space }) => space?.slug === slug,
  )

  const currentSpaceAppNotificationSettings = currentSpaceNotificationSettings?.find(
    ({ channel }) => channel === NotificationChannel.IN_APP,
  )

  const currentSpaceEmailNotificationSettings = currentSpaceNotificationSettings?.find(
    ({ channel }) => channel === NotificationChannel.EMAIL,
  )

  const onSubmit = useCallback(
    async (input: SpaceNotificationsDefaultSettingsFormValues) => {
      const spaceId = currentSpaceNotificationSettings[0]?.space?.id

      if (spaceId) {
        const promises = await Promise.all([
          updateMemberSpaceNotificationSettings({
            channel: NotificationChannel.IN_APP,
            input: {
              preference: input?.preference,
            },
            memberId: authUser?.id,
            spaceId,
          }),
          updateMemberSpaceNotificationSettings({
            channel: NotificationChannel.EMAIL,
            input: {
              preference: input?.emailPreference,
              sameAsDefault: input?.sameAsDefault,
            },
            memberId: authUser?.id,
            spaceId,
          }),
        ])

        if (isEmpty(promises[0]?.errors) && isEmpty(promises[1]?.errors)) {
          toast({
            description: t('admin:notifications.defaultNotificationsUpdated', {
              defaultValue: 'Default notifications updated.',
            }),
            title: t('admin:notifications.changesSaved', {
              defaultValue: 'Changes saved',
            }),
            status: 'success',
          })
        } else {
          toast({
            description: t('admin:notifications.somethingWentWrong', {
              defaultValue:
                'Something went wrong during default notifications update. Please try again.',
            }),
            title: t('common:error', {
              defaultValue: 'Error',
            }),
            status: 'error',
          })

          logger.warn(
            `Notifications default settings update for ${slug} error => `,
          )
        }
      }
    },
    [
      authUser?.id,
      currentSpaceNotificationSettings,
      slug,
      t,
      toast,
      updateMemberSpaceNotificationSettings,
    ],
  )

  const { control, handleSubmit, watch, setValue } = useForm<
    SpaceNotificationsDefaultSettingsFormValues
  >({
    defaultValues: {
      emailPreference: currentSpaceEmailNotificationSettings?.preference as SpaceNotificationPreference,
      preference: currentSpaceAppNotificationSettings?.preference as SpaceNotificationPreference,
      sameAsDefault: currentSpaceEmailNotificationSettings?.sameAsDefault,
    },
  })

  const emailPreference = watch('emailPreference')
  const preference = watch('preference')
  const sameAsDefault = watch('sameAsDefault')
  const isTouched = useMemo(
    () =>
      emailPreference !== currentSpaceEmailNotificationSettings?.preference ||
      preference !== currentSpaceAppNotificationSettings?.preference ||
      sameAsDefault !== currentSpaceEmailNotificationSettings?.sameAsDefault,
    [
      currentSpaceAppNotificationSettings?.preference,
      currentSpaceEmailNotificationSettings?.preference,
      currentSpaceEmailNotificationSettings?.sameAsDefault,
      emailPreference,
      preference,
      sameAsDefault,
    ],
  )

  useEffect(() => {
    setValue(
      'emailPreference',
      currentSpaceEmailNotificationSettings?.preference as SpaceNotificationPreference,
    )
    setValue(
      'preference',
      currentSpaceAppNotificationSettings?.preference as SpaceNotificationPreference,
    )
    setValue(
      'sameAsDefault',
      currentSpaceEmailNotificationSettings?.sameAsDefault,
    )
  }, [
    currentSpaceAppNotificationSettings?.preference,
    currentSpaceEmailNotificationSettings?.preference,
    currentSpaceEmailNotificationSettings?.sameAsDefault,
    setValue,
  ])

  return (
    <SkeletonProvider loading={isLoadingMemberNotificationSettings}>
      <Box as="form" onSubmit={handleSubmit(onSubmit)}>
        <Skeleton>
          <Accordion
            title={t('admin:notifications.defaultSettings', 'Default settings')}
            subtitle={t(
              'admin:notifications.configureWhatTheDefaultNotificationSettings',
              'Configure what the default notification setting should be when new users join this space.',
            )}
          >
            <SpaceNotificationDefaultSettingsRadioGroupFormControl
              control={control}
              isDisabled={
                isUpdatingMemberSpaceNotificationSettings ||
                isLoadingMemberNotificationSettings
              }
              options={SPACE_NOTIFICATIONS_PREFERENCE_OPTIONS}
            />

            <Divider my={6} />

            <SpaceNotificationDefaultSettingsCheckboxFormControl
              control={control}
              isDisabled={
                isUpdatingMemberSpaceNotificationSettings ||
                isLoadingMemberNotificationSettings
              }
              sameAsDefault={sameAsDefault}
            />

            <SpaceNotificationDefaultSettingsSelectFormControl
              control={control}
              isDisabled={
                isUpdatingMemberSpaceNotificationSettings ||
                isLoadingMemberNotificationSettings
              }
              options={SPACE_NOTIFICATIONS_PREFERENCE_OPTIONS}
              sameAsDefault={sameAsDefault}
            />

            <HStack justifyContent="flex-end">
              <Button
                isLoading={
                  isUpdatingMemberSpaceNotificationSettings ||
                  isLoadingMemberNotificationSettings
                }
                buttonType="primary"
                type="submit"
                isDisabled={
                  isUpdatingMemberSpaceNotificationSettings ||
                  isLoadingMemberNotificationSettings ||
                  !isTouched
                }
                mt={6}
                data-testid="update-button"
              >
                <Trans i18nKey="admin:update" defaults="Update" />
              </Button>
            </HStack>
          </Accordion>
        </Skeleton>
      </Box>
    </SkeletonProvider>
  )
})
