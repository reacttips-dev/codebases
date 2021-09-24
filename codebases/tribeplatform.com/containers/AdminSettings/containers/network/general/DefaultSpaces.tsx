import { useCallback, useEffect } from 'react'

import { Box, Skeleton, VStack } from '@chakra-ui/react'
import { Controller, useForm } from 'react-hook-form'

import { GET_NETWORK_INFO } from 'tribe-api/graphql'
import { Space } from 'tribe-api/interfaces/interface.generated'
import {
  Accordion,
  AutocompleteMultiple,
  Avatar,
  Button,
  FormControl,
  FormErrorMessage,
  SelectOption,
  useToast,
} from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import SettingsGroupHeader from 'containers/AdminSettings/components/SettingsGroupHeader'
import useGetNetwork from 'containers/Network/useGetNetwork'
import useGetSpaces from 'containers/Space/useGetSpaces'

import useUpdateNetwork from 'hooks/useUpdateNetwork'

import DefaultSpacesAccordionSubtitle from './DefaultSpacesAccordionSubtitle'

const spaceToOption = (space: Space): SelectOption<Space> => ({
  label: space.name,
  icon: (
    <Box mr={1}>
      <Avatar src={space?.image} size="xs" name={space?.name} />
    </Box>
  ),
  value: space,
})

const DefaultSpaces = () => {
  const { t } = useTranslation()
  const toast = useToast()
  const { network, isInitialLoading: initialNetworkLoading } = useGetNetwork({
    withDefaultSpaces: true,
  })
  const { updateNetwork, loading: updating } = useUpdateNetwork({
    mutationOptions: {
      onCompleted: () => {
        toast({
          title: t('admin:onboarding.defaultSpaces.done', 'Done'),
          description: t(
            'admin:onboarding.defaultSpaces.successful',
            'Changes have been saved',
          ),
          status: 'success',
        })
      },
      update: undefined,
      awaitRefetchQueries: true,
      refetchQueries: [
        {
          query: GET_NETWORK_INFO,
          variables: {
            withDefaultSpaces: true,
            withRoles: true,
          },
        },
      ],
    },
  })
  const { control, errors, handleSubmit, setValue } = useForm({
    defaultValues: {
      spaces: network?.defaultSpaces || [],
    },
  })
  const { query: querySpaces, loading, spaces: queryResult } = useGetSpaces()

  const onSubmit = useCallback(
    ({ spaces }: { spaces: Array<Space> }) => {
      const defaultSpaceIds = spaces?.map(s => s.id)
      updateNetwork({
        defaultSpaceIds,
      })
    },
    [updateNetwork],
  )

  useEffect(() => {
    if (!updating && network?.defaultSpaces) {
      setValue('spaces', network?.defaultSpaces)
    }
  }, [network, setValue, updating])

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <SettingsGroupHeader>
        <Trans i18nKey="admin:onboarding.title" defaults="Member onboarding" />
      </SettingsGroupHeader>

      <Accordion
        title={
          <Trans
            i18nKey="admin:onboarding.defaultSpaces.title"
            defaults="Default spaces"
          />
        }
        subtitle={
          <DefaultSpacesAccordionSubtitle spaces={network?.defaultSpaces} />
        }
      >
        <VStack spacing={6}>
          <Skeleton isLoaded={!initialNetworkLoading} w="full">
            <FormControl isInvalid={!!errors?.spaces}>
              <Controller
                control={control}
                name="spaces"
                defaultValue={network?.defaultSpaces || []}
                render={({ onChange, onBlur, value }) => (
                  <AutocompleteMultiple
                    value={value}
                    loading={loading}
                    onBlur={onBlur}
                    options={queryResult?.map(spaceToOption) || []}
                    onChange={onChange}
                    optionConverter={spaceToOption}
                    onSearch={async input => {
                      const result = await querySpaces({
                        query: input,
                      })

                      return (
                        result?.data?.getSpaces?.edges?.map(({ node }) =>
                          spaceToOption(node as Space),
                        ) || []
                      )
                    }}
                    placeholder={t(
                      'admin:onboarding.defaultSpaces.placeholder',
                      'Search spaces',
                    )}
                  />
                )}
                rules={{
                  required: {
                    value: true,
                    message: t('common:validation.empty', {
                      defaultValue: "This field can't be empty",
                    }),
                  },
                  validate: {
                    minlength: value =>
                      Array.isArray(value) && value.length > 0,
                  },
                }}
              />
              {errors?.spaces && (errors?.spaces as any)?.type === 'minlength' && (
                <FormErrorMessage>
                  <Trans
                    i18nKey="admin:onboarding.defaultSpaces.error.empty"
                    defaults="Select at least one space"
                  />
                </FormErrorMessage>
              )}
            </FormControl>
          </Skeleton>
          <Button
            isLoading={updating}
            isDisabled={updating}
            buttonType="primary"
            type="submit"
            data-testid="network-default-spaces-update-button"
            alignSelf="flex-end"
          >
            <Trans i18nKey="admin:update" defaults="Update" />
          </Button>
        </VStack>
      </Accordion>
    </Box>
  )
}

export default DefaultSpaces
