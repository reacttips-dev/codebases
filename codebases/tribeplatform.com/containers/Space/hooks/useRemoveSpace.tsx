import React, { useCallback, useRef } from 'react'

import { useApolloClient, useMutation } from '@apollo/client'
import { Box, useClipboard, useToken } from '@chakra-ui/react'
import FileCopyLineIcon from 'remixicon-react/FileCopyLineIcon'

import {
  GET_SPACES,
  REMOVE_SPACE,
  RemoveSpaceMutation,
  RemoveSpaceMutationVariables,
  GET_SPACE_COLLECTIONS,
  SpaceQuery,
} from 'tribe-api/graphql'
import { ActionStatus, ThemeTokens } from 'tribe-api/interfaces'
import { useToast, Text, confirm, Input, Tag, TagLabel } from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import useThemeSettings from 'containers/AdminSettings/hooks/useThemeSettings'

import { logger } from 'lib/logger'

import { DEFAULT_SPACES_LIMIT } from '../useGetSpaces'

export type ConfirmationModalContentProps = {
  space: SpaceQuery['space']
}

const ConfirmationModalContent = React.forwardRef(
  (
    { space }: ConfirmationModalContentProps,
    ref: React.Ref<HTMLElementTagNameMap['input']>,
  ) => {
    const toast = useToast()
    const { t } = useTranslation()
    const [iconColor] = useToken('colors', ['border.strong'])
    const { onCopy } = useClipboard(space.name)
    const copy = useCallback(() => {
      onCopy()
      toast({
        title: t('common:post.copy.title', 'Copied!'),
        duration: 1000,
        icon: FileCopyLineIcon,
      })
    }, [onCopy, t, toast])

    return (
      <Box>
        <Text textStyle="regular/medium" color="label.primary">
          <Trans
            i18nKey="admin:space.general.delete.modal.description"
            defaults="You will lose posts, comments and all content related to the space."
          />
        </Text>
        <Text mt={6} textStyle="medium/medium" color="label.primary">
          <Trans
            i18nKey="admin:space.general.delete.modal.description2"
            defaults="Enter the name of the space to confirm"
          />
        </Text>
        <Tag my={2}>
          <TagLabel textStyle="regular/small" ml={1} mr={2}>
            {space.name}
          </TagLabel>
          <FileCopyLineIcon
            onClick={copy}
            cursor="pointer"
            color={iconColor}
            size="13px"
          />
        </Tag>
        <Input
          data-testid="delete-space-name-input"
          errorBorderColor="danger.base"
          ref={ref}
        />
      </Box>
    )
  },
)

export type UseRemoveSpaceProps = (
  space: SpaceQuery['space'],
) => {
  removeSpace: () => Promise<any>
}

export const useRemoveSpace: UseRemoveSpaceProps = (
  space: SpaceQuery['space'],
) => {
  const toast = useToast()
  const { t } = useTranslation()
  const apolloClient = useApolloClient()
  const spaceNameInputRef = useRef<HTMLInputElement>(null)
  const [removeSpaceMutation] = useMutation<
    RemoveSpaceMutation,
    RemoveSpaceMutationVariables
  >(REMOVE_SPACE)
  const { themeSettings } = useThemeSettings()

  const removeSpace = useCallback(async () => {
    const confirmed = await confirm({
      title: (
        <Trans
          i18nKey="admin:space.general.delete.modal.title"
          defaults="Are you sure you want to delete {{ spaceName }}?"
          values={{ spaceName: space.name }}
        />
      ),
      body: <ConfirmationModalContent space={space} ref={spaceNameInputRef} />,
      hideCloseIcon: true,
      hideHeaderDivider: true,
      cancelButtonProps: {
        variant: null,
        buttonType: 'secondary',
      },
      proceedButtonProps: {
        'data-testid': 'delete-space-confirm-button',
        buttonType: 'secondary',
        color: 'danger.base',
        _hover: {
          color: 'danger.base',
        },
      },
      validation: () => {
        const input = spaceNameInputRef.current
        const isValid = input?.value.toLowerCase() === space.name.toLowerCase()

        if (isValid) {
          input?.removeAttribute('data-invalid')
        } else {
          input?.setAttribute('data-invalid', 'true')
        }

        return isValid
      },
      themeSettings: themeSettings as ThemeTokens,
    })

    if (!confirmed) return false

    return removeSpaceMutation({
      variables: {
        spaceId: space.id,
      },
      refetchQueries: [
        {
          query: GET_SPACE_COLLECTIONS,
        },
        {
          query: GET_SPACES,
          variables: { limit: DEFAULT_SPACES_LIMIT },
        },
      ],
    }).then(res => {
      try {
        if (res.data?.removeSpace.status !== ActionStatus.SUCCEEDED) {
          throw res.errors?.[0]
        }

        apolloClient.cache.modify({
          fields: {
            getSpaces(existingSpacesRefs, options) {
              const { readField } = options
              const edges = existingSpacesRefs?.edges?.filter(
                spaceRef => space.id !== readField('id', spaceRef?.node),
              )
              return {
                ...existingSpacesRefs,
                edges,
              }
            },
          },
        })

        toast({
          title: t('common:space.deleted.title', 'Space deleted'),
          description: t(
            'common:space.deleted.description',
            '{{ spaceName }} space has been deleted',
            {
              spaceName: space.name,
            },
          ),
          status: 'success',
          position: 'top-right',
        })
      } catch (e) {
        logger.warn("couldn't invalidate spaces cache")
      }

      return res
    })
  }, [apolloClient.cache, removeSpaceMutation, space, t, themeSettings, toast])

  return {
    removeSpace,
  }
}
