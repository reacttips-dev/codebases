import React, { useCallback } from 'react'

import { Box, HStack } from '@chakra-ui/react'
import { Controller, useForm } from 'react-hook-form'

import { SpaceQuery } from 'tribe-api'
import { Space } from 'tribe-api/interfaces'
import {
  Skeleton,
  Accordion,
  FormControl,
  UserBar,
  Switch,
  Button,
  FormHelperText,
  FormLabel,
} from 'tribe-components'
import { Trans } from 'tribe-translation'

import { useUpdateSpace } from 'containers/Space/hooks/useUpdateSpace'

import SettingsGroupHeader from '../../../components/SettingsGroupHeader'

export type AccessFormValues = {
  private: Space['private']
  hidden: Space['hidden']
  inviteOnly: Space['inviteOnly']
  nonAdminsCanInvite: Space['nonAdminsCanInvite']
}

const HIDDEN_SPACE_CHECKBOX_NAME = 'hidden'

const SpaceAccessSettings = ({ space }: { space: SpaceQuery['space'] }) => {
  const { updateSpace, loading: updatingSpace } = useUpdateSpace({
    spaceId: space?.id,
  })

  const onSubmit = useCallback(
    async (data: AccessFormValues) => {
      await updateSpace(data)
    },
    [updateSpace],
  )

  const { handleSubmit, control, watch, setValue } = useForm<AccessFormValues>({
    defaultValues: {
      private: space?.private || false,
      hidden: space?.hidden || false,
      inviteOnly: space?.inviteOnly || false,
      nonAdminsCanInvite: space?.nonAdminsCanInvite || false,
    },
  })

  const isPrivateSpace = watch('private')

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <SettingsGroupHeader>
        <Trans i18nKey="admin:access.title" defaults="Access" />
      </SettingsGroupHeader>
      <Skeleton>
        <Accordion title="Access">
          <FormControl id="network-privacy">
            <HStack justify="space-between" mb={6}>
              <UserBar
                withPicture={false}
                title={
                  <Trans
                    i18nKey="admin:access.make_private"
                    defaults="Make private"
                  />
                }
                subtitle={
                  <Trans
                    i18nKey="admin:space.access.privateDescription"
                    defaults="Only members can see who's in the space and what they post."
                  />
                }
              />
              <Controller
                name="private"
                render={({ onChange, value }) => (
                  <Switch
                    data-testid="access-settings-make-private-switch"
                    onChange={() => {
                      onChange(!value)

                      if (value) {
                        setValue(HIDDEN_SPACE_CHECKBOX_NAME, false)
                      }
                    }}
                    isChecked={value}
                  />
                )}
                defaultValue={space?.private}
                control={control}
              />
            </HStack>
          </FormControl>
          <FormControl isDisabled={!isPrivateSpace} id="space-visibility">
            <HStack justify="space-between" mb={6}>
              <UserBar
                withPicture={false}
                title={
                  <FormLabel mb={0}>
                    <Trans
                      i18nKey="admin:space.access.hide"
                      defaults="Hide space"
                    />
                  </FormLabel>
                }
                subtitle={
                  <FormHelperText mt={0}>
                    <Trans
                      i18nKey="admin:space.access.hide_description"
                      defaults="Hide this space from non-space members."
                    />
                  </FormHelperText>
                }
              />
              <Controller
                name={HIDDEN_SPACE_CHECKBOX_NAME}
                render={({ onChange, value }) => (
                  <Switch
                    data-testid="access-settings-hide-space-switch"
                    onChange={() => onChange(!value)}
                    isChecked={value}
                    isDisabled={!isPrivateSpace}
                  />
                )}
                control={control}
                defaultValue={space?.hidden}
              />
            </HStack>
          </FormControl>
          <FormControl id="space-inviteOnly">
            <HStack justify="space-between" mb={6}>
              <UserBar
                withPicture={false}
                title={
                  <Trans
                    i18nKey="admin:access.make_invite_only"
                    defaults="Make invite-only"
                  />
                }
                subtitle={
                  <Trans
                    i18nKey="admin:space.access.invite_only_description"
                    defaults="Allow only people with an invite to join as space members."
                  />
                }
              />
              <Controller
                name="inviteOnly"
                render={({ onChange, value }) => (
                  <Switch
                    data-testid="access-settings-invite-only-switch"
                    onChange={() => onChange(!value)}
                    isChecked={value}
                  />
                )}
                control={control}
                defaultValue={space?.inviteOnly}
              />
            </HStack>
          </FormControl>
          <FormControl id="space-nonAdminsCanInvite">
            <HStack justify="space-between" mb={6}>
              <UserBar
                withPicture={false}
                title={
                  <Trans
                    i18nKey="admin:access.anyone_can_invite"
                    defaults="Anyone can invite"
                  />
                }
                subtitle={
                  <Trans
                    i18nKey="admin:space.access.anyone_can_invite_description"
                    defaults="Allow non-admin members to invite others to the space."
                  />
                }
              />
              <Controller
                name="nonAdminsCanInvite"
                render={({ onChange, value }) => (
                  <Switch
                    data-testid="access-settings-non-admin-can-invite-switch"
                    onChange={() => onChange(!value)}
                    isChecked={value}
                  />
                )}
                control={control}
                defaultValue={space?.nonAdminsCanInvite}
              />
            </HStack>
          </FormControl>
          <Button
            isLoading={updatingSpace}
            buttonType="primary"
            isDisabled={updatingSpace}
            type="submit"
            data-testid="access-settings-update-button"
          >
            <Trans i18nKey="admin:update" defaults="Update" />
          </Button>
        </Accordion>
      </Skeleton>
    </Box>
  )
}

export default SpaceAccessSettings
