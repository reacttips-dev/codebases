import React, { FC, useCallback, useEffect } from 'react'

import { Box, Flex } from '@chakra-ui/react'
import { EmojiData } from 'emoji-mart'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import slugify from 'slugify'

import { GET_SPACE_COLLECTIONS } from 'tribe-api/graphql'
import { Media, Space, SpaceCollection } from 'tribe-api/interfaces'
import {
  Accordion,
  Button,
  Emoji,
  EmojiPicker,
  EmojiPickerResult,
  FormControl,
  FormErrorMessage,
  FormLabel,
  ImagePickerDropdown,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Skeleton,
  SkeletonProvider,
  Text,
  TextareaInput,
} from 'tribe-components'
import { Features, useTribeFeature } from 'tribe-feature-flag'
import { Trans } from 'tribe-translation'

import { LayoutHeader } from 'components/Layout'

import useGetNetwork from 'containers/Network/useGetNetwork'
import { useUpdateSpace } from 'containers/Space/hooks'
import { useGetSpaceCollections } from 'containers/SpaceCollection/hooks'

import { useSpace } from 'hooks/space/useSpace'
import { useCreateEmojis } from 'hooks/useCreateEmojis'
import useCreateImages from 'hooks/useCreateImages'

import SettingsGroupHeader from '../../../components/SettingsGroupHeader'
import Access from './Access'
import DeleteSpace from './DeleteSpace'

const requiredRules = { required: true }
const staticProps = {
  spaceCollectionListProps: {
    maxH: 'xs',
  },
}

const EmojiControlRenderer = ({ onChange, value }) => (
  <EmojiPicker
    onSelect={(emoji: EmojiPickerResult) =>
      onChange({
        __typename: 'Emoji',
        id: '',
        text: emoji.id,
      })
    }
  >
    {({ toggle }) => (
      <Box data-testid="space-emoji" onClick={toggle} minW="4" minH="4">
        <Emoji src={value} size="xs" />
      </Box>
    )}
  </EmojiPicker>
)

const SpaceGeneralSettings: FC<{ slug: Space['slug'] }> = ({ slug }) => {
  const { push } = useRouter()
  const { space, loading: loadingSpace } = useSpace({
    variables: {
      slug,
    },
  })
  const { network, loading: loadingNetwork } = useGetNetwork()
  const { updateSpace, loading: updatingSpace } = useUpdateSpace({
    spaceId: space?.id,
    mutationOptions: {
      refetchQueries: [
        {
          // in case the user change the collection let's refetch the collections so in the homepage user would see the updated version
          query: GET_SPACE_COLLECTIONS,
        },
      ],
    },
  })
  const { createEmojis } = useCreateEmojis()

  const { spaceCollections } = useGetSpaceCollections()

  const { isEnabled: isImagePickerDropdownEnabled } = useTribeFeature(
    Features.ImagePickerDropdown,
  )

  type FormValues = {
    name: Space['name']
    description: Space['description']
    emoji: Media | null
    slug: Space['slug']
    spaceCollection?: SpaceCollection | null
  }

  const onSubmit = useCallback(
    async (data: FormValues) => {
      const { emoji, spaceCollection, ...rest } = data

      let imageId: Media['id'] | undefined
      if (emoji) {
        imageId = emoji?.id

        if (emoji?.__typename === 'Emoji' && !imageId) {
          const uploadedEmoji = await createEmojis([{ text: emoji?.text }])
          imageId = uploadedEmoji[0].id
        }
      }

      await updateSpace({
        ...rest,
        imageId,
        collectionId: spaceCollection?.id,
      })

      push(
        '/admin/space/[space-slug]/[section]',
        `/admin/space/${data.slug}/settings`,
      )
    },
    [updateSpace, push, createEmojis],
  )

  const { handleSubmit, control, errors, reset, setValue } = useForm<
    FormValues
  >({
    defaultValues: {
      name: space?.name || '',
      description: space?.description || '',
      emoji: space?.image || null,
      slug: space?.slug || '',
      spaceCollection: space?.collection,
    },
  })

  const { upload, isUploading } = useCreateImages()

  const handleFileUpload = useCallback(
    async (file: File) => {
      try {
        const result = await upload([
          {
            imageFile: file,
          },
        ])

        const { mediaId, mediaUrl } = (result && result[0]) || {}

        if (mediaId && mediaUrl) {
          setValue('emoji', {
            __typename: 'Image',
            id: mediaId,
            url: mediaUrl,
          })
        }
      } catch (e) {
        if (space?.image) {
          setValue('emoji', space?.image)
        }
      }
    },
    [setValue, space?.image, upload],
  )

  useEffect(() => {
    reset({
      name: space?.name || '',
      description: space?.description || '',
      emoji: space?.image || null,
      slug: space?.slug || '',
      spaceCollection: space?.collection,
    })
  }, [space, reset])

  const loading = !space || loadingSpace || loadingNetwork || !network

  return (
    <SkeletonProvider loading={loading}>
      <Box>
        <LayoutHeader h="auto" pb={0} pl={[5, 0]}>
          <Text textStyle="bold/2xlarge">
            <Trans i18nKey="admin:sidebar.settings" defaults="Administration" />
          </Text>
        </LayoutHeader>
        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
          <SettingsGroupHeader>
            <Trans i18nKey="admin:general.title" defaults="General" />
          </SettingsGroupHeader>
          <Skeleton>
            <Accordion
              {...(isImagePickerDropdownEnabled && {
                header: (
                  <Flex flexGrow={1} alignItems="center" overflow="hidden">
                    <Box height={10} mr={2}>
                      <ImagePickerDropdown
                        emojiSize="md"
                        image={space?.image}
                        imageBoxSize={10}
                        isDisabled
                      />
                    </Box>
                    <Flex flex="1 0 auto" alignItems="center">
                      <Text textStyle="medium/medium">{space?.name}</Text>
                    </Flex>
                  </Flex>
                ),
              })}
              icon={space?.image}
              title={space?.name}
            >
              <FormControl id="tribe-name" isInvalid={Boolean(errors.name)}>
                <FormLabel textStyle="semibold/medium" color="label.primary">
                  <Trans
                    i18nKey="admin:space.general.name"
                    defaults="Space name and icon"
                  />
                </FormLabel>
                <InputGroup>
                  <InputLeftAddon>
                    <Controller
                      control={control}
                      name="emoji"
                      render={
                        isImagePickerDropdownEnabled
                          ? ({ onChange, value }) => (
                              <ImagePickerDropdown
                                image={value}
                                isLoading={isUploading}
                                onEmojiSelect={(emoji: EmojiData) =>
                                  onChange({
                                    __typename: 'Emoji',
                                    id: '',
                                    text: emoji.id,
                                  })
                                }
                                onFileUpload={handleFileUpload}
                                onLinkUpload={handleFileUpload}
                              />
                            )
                          : EmojiControlRenderer
                      }
                    />
                  </InputLeftAddon>
                  <Controller
                    withLeftAddon
                    as={Input}
                    name="name"
                    control={control}
                    defaultValue={space?.name}
                    rules={requiredRules}
                    data-testid="space-name"
                  />
                </InputGroup>
                <FormErrorMessage>
                  <Trans
                    i18nKey="settings:general.errors.networkName"
                    defaults="Please check the input."
                  />
                </FormErrorMessage>
              </FormControl>

              <FormControl
                mt={6}
                id="tribe-description"
                isInvalid={Boolean(errors.description)}
              >
                <FormLabel textStyle="semibold/medium" color="label.primary">
                  <Trans
                    i18nKey="admin:general.description"
                    defaults="Description"
                  />
                </FormLabel>
                <Controller
                  as={TextareaInput}
                  name="description"
                  textStyle="regular/medium"
                  control={control}
                  data-testid="space-description"
                  defaultValue={space?.description || ''}
                />
              </FormControl>

              <FormControl
                mt={6}
                id="tribe-site"
                isInvalid={Boolean(errors.name)}
              >
                <FormLabel textStyle="semibold/medium" color="label.primary">
                  <Trans
                    i18nKey="admin:general.address"
                    defaults="Web address"
                  />
                </FormLabel>
                <InputGroup>
                  <InputLeftAddon>{`${network?.domain}/`}</InputLeftAddon>
                  <Controller
                    render={({ onChange, onBlur, value, name }) => (
                      <Input
                        onChange={event => {
                          const { target } = event

                          onChange(
                            slugify(target.value, {
                              strict: true,
                              lower: true,
                            }),
                          )
                        }}
                        onBlur={onBlur}
                        value={value}
                        name={name}
                        data-testid="space-slug"
                        withLeftAddon
                      />
                    )}
                    name="slug"
                    textStyle="regular/medium"
                    control={control}
                    defaultValue={space?.slug}
                    rules={requiredRules}
                  />
                </InputGroup>
              </FormControl>
              <FormControl
                mt={6}
                id="spaceCollection"
                isInvalid={Boolean(errors.spaceCollection)}
              >
                <FormLabel htmlFor="spaceCollection">
                  <Trans
                    i18nKey="admin:space.general.collection"
                    defaults="Collection"
                  />
                </FormLabel>
                <Controller
                  name="spaceCollection"
                  control={control}
                  defaultValue={space?.collection || null}
                  render={({ onChange, value, name }) => (
                    <Select
                      name={name}
                      value={value}
                      placement="top-start"
                      listProps={staticProps.spaceCollectionListProps}
                      options={spaceCollections.map(collection => ({
                        label: collection.name,
                        value: collection,
                      }))}
                      onChange={onChange}
                    />
                  )}
                  rules={{
                    required: true,
                  }}
                />
                {errors.spaceCollection &&
                  (errors?.spaceCollection as any)?.type === 'required' && (
                    <FormErrorMessage>
                      <Trans
                        i18nKey="admin:space.general.errors.collection"
                        defaults="Collection is required"
                      />
                      {(errors?.spaceCollection as any)?.message}
                    </FormErrorMessage>
                  )}
              </FormControl>

              <Button
                isLoading={updatingSpace}
                buttonType="primary"
                type="submit"
                isDisabled={updatingSpace}
                mt={6}
                data-testid="update-button"
              >
                <Trans i18nKey="admin:update" defaults="Update" />
              </Button>
            </Accordion>
          </Skeleton>
        </Box>

        <Access space={space} />

        <DeleteSpace space={space} />
      </Box>
    </SkeletonProvider>
  )
}

export default SpaceGeneralSettings
