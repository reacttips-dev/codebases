import React, { useCallback } from 'react'

import { Box, HStack, VStack } from '@chakra-ui/react'
import { Controller, useForm } from 'react-hook-form'

import {
  NetworkMembership,
  NetworkVisibility,
  RoleType,
} from 'tribe-api/interfaces'
import {
  Skeleton,
  Accordion,
  Switch,
  UserBar,
  Button,
  FormControl,
} from 'tribe-components'
import { Trans } from 'tribe-translation'

import useGetNetwork from 'containers/Network/useGetNetwork'

import useUpdateNetwork from 'hooks/useUpdateNetwork'

import SettingsGroupHeader from '../../../components/SettingsGroupHeader'

type NetworkAccessFormValues = {
  visibility: boolean
  nonAdminsCanInvite: boolean
  inviteOnly: boolean
}

const NetworkAccessSettings = () => {
  const { network } = useGetNetwork()
  const { updateNetwork, loading } = useUpdateNetwork()
  const isPrivateNetwork = network?.visibility === NetworkVisibility.PRIVATE
  const inviteOnly = network?.membership === NetworkMembership.INVITEONLY
  const nonAdminsCanInvite = network?.whoCanInvite?.length !== 0

  const onSubmit = useCallback(
    async (data: NetworkAccessFormValues) => {
      const { visibility, inviteOnly, nonAdminsCanInvite } = data
      await updateNetwork({
        visibility: visibility
          ? NetworkVisibility.PRIVATE
          : NetworkVisibility.PUBLIC,
        membership: inviteOnly
          ? NetworkMembership.INVITEONLY
          : NetworkMembership.OPEN,
        whoCanInviteIds: nonAdminsCanInvite
          ? network?.roles
              ?.filter?.(role =>
                role?.type
                  ? [RoleType.MEMBER, RoleType.MODERATOR].indexOf(role.type) >
                    -1
                  : false,
              )
              .map(role => role.id)
          : [],
      })
    },
    [network?.roles, updateNetwork],
  )

  const { handleSubmit, control } = useForm<NetworkAccessFormValues>({
    defaultValues: {
      visibility: isPrivateNetwork,
      nonAdminsCanInvite,
      inviteOnly,
    },
  })

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <SettingsGroupHeader>
        <Trans i18nKey="admin:permission.title" defaults="Permission" />
      </SettingsGroupHeader>
      <Skeleton>
        <Accordion title="Access" defaultIndex={0}>
          <VStack spacing={6}>
            <FormControl>
              <HStack justify="space-between">
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
                      i18nKey="admin:network.access.private_description"
                      defaults="Allow only network members to view and browse the network."
                    />
                  }
                />
                <Controller
                  id="privacy-settings"
                  name="visibility"
                  render={({ onChange, value }) => (
                    <Switch
                      data-testid="privacy-setting-privacy-switch"
                      onChange={() => onChange(!value)}
                      isChecked={value}
                    />
                  )}
                  defaultValue={isPrivateNetwork}
                  control={control}
                />
              </HStack>
            </FormControl>
            <FormControl>
              <HStack justify="space-between">
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
                      i18nKey="admin:network.access.invite_only_description"
                      defaults="Allow only people with an invite to join as network members."
                    />
                  }
                />
                <Controller
                  name="inviteOnly"
                  render={({ onChange, value }) => (
                    <Switch
                      data-testid="invite-only-switch"
                      onChange={() => onChange(!value)}
                      isChecked={value}
                    />
                  )}
                  control={control}
                />
              </HStack>
            </FormControl>
            <FormControl>
              <HStack justify="space-between">
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
                      i18nKey="admin:network.access.anyone_can_invite_description"
                      defaults="Allow non-admin members to invite others to the network."
                    />
                  }
                />
                <Controller
                  name="nonAdminsCanInvite"
                  render={({ onChange, value }) => (
                    <Switch
                      onChange={() => onChange(!value)}
                      isChecked={value}
                    />
                  )}
                  control={control}
                />
              </HStack>
            </FormControl>
            <Button
              isLoading={loading}
              buttonType="primary"
              isDisabled={loading}
              type="submit"
              data-testid="privacy-setting-update-button"
              alignSelf="flex-end"
            >
              <Trans i18nKey="admin:update" defaults="Update" />
            </Button>
          </VStack>
        </Accordion>
      </Skeleton>
    </Box>
  )
}

export default NetworkAccessSettings
