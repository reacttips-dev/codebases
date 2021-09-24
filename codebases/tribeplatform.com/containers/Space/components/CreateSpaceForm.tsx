import React, { useCallback, useEffect } from 'react'

import { Box, Flex, VStack } from '@chakra-ui/react'
import { EmojiData } from 'emoji-mart'
import { useRouter } from 'next/router'
import {
  Controller,
  SubmitErrorHandler,
  useForm,
  useWatch,
  Validate,
} from 'react-hook-form'
import ArrowLeftLineIcon from 'remixicon-react/ArrowLeftLineIcon'

import { Media, SpaceCollection, SpaceType } from 'tribe-api/interfaces'
import {
  Button,
  Emoji,
  EmojiPicker,
  EmojiPickerResult,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  IconButton,
  ImagePickerDropdown,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Switch,
  Text,
  TextareaInput,
} from 'tribe-components'
import { Features, useTribeFeature } from 'tribe-feature-flag'
import { i18n, Trans, useTranslation } from 'tribe-translation'

import { useGetSpaceCollections } from 'containers/SpaceCollection/hooks'

import useCreateImages from 'hooks/useCreateImages'
import { useDebouncedCallback } from 'hooks/useDebounce'
import { useResponsive } from 'hooks/useResponsive'

const staticProps = {
  mobilePublishBtn: {
    _hover: {
      bg: 'transparent',
    },
    _active: {
      bg: 'transparent',
    },
  },
}

const HIDDEN_SPACE_CHECKBOX_NAME = 'hidden'

const validator = {
  validate: {
    isNotEmpty: (value: string) =>
      !!value.length ||
      i18n.t('common:validation.empty', "This field can't be empty"),
  } as Record<string, Validate>,
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
      <Box onClick={toggle} minW="4" minH="4">
        <Emoji src={value} size="xs" />
      </Box>
    )}
  </EmojiPicker>
)

export interface CreateSpaceFormInput {
  name: string
  description: string
  emoji: Media | null
  private: boolean
  hidden: boolean
  spaceType?: SpaceType | null
  spaceCollection?: SpaceCollection | null
}

export interface EditSpaceFormProps {
  defaultValues: CreateSpaceFormInput
  onSubmit: (data: CreateSpaceFormInput) => Promise<void>
  onError?: SubmitErrorHandler<CreateSpaceFormInput>
  onChange: (value: CreateSpaceFormInput) => void
}

export const CreateSpaceForm: React.FC<EditSpaceFormProps> = ({
  defaultValues,
  onSubmit,
  onError,
  onChange,
}) => {
  const router = useRouter()
  const { t } = useTranslation()
  const { isMobile, mobileHeader } = useResponsive()
  // const { spaceTypes } = useGetSpaceTypes()
  const { isEnabled: isImagePickerDropdownEnabled } = useTribeFeature(
    Features.ImagePickerDropdown,
  )
  const { spaceCollections } = useGetSpaceCollections()

  const {
    register,
    handleSubmit,
    errors,
    formState,
    control,
    watch,
    setValue,
  } = useForm<CreateSpaceFormInput>({
    defaultValues,
    mode: 'onChange',
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
        setValue('emoji', defaultValues?.emoji)
      }
    },
    [defaultValues?.emoji, setValue, upload],
  )

  useEffect(() => {
    if (defaultValues?.emoji) {
      setValue('emoji', defaultValues?.emoji)
    }
  }, [defaultValues?.emoji, setValue])

  useEffect(() => {
    mobileHeader.setLeft(
      <IconButton
        icon={<ArrowLeftLineIcon size="20" />}
        aria-label="Back"
        buttonType="secondary"
        backgroundColor="bg.secondary"
        borderRadius="base"
        p={0}
        onClick={() => router.push('/spaces')}
      />,
    )

    mobileHeader.setRight(
      <Button
        colorScheme="green"
        borderWidth={0}
        bg="transparent"
        onClick={handleSubmit(onSubmit, onError)}
        disabled={!formState.isValid}
        {...staticProps.mobilePublishBtn}
      >
        <Trans i18nKey="common:publish" defaults="Publish" />
      </Button>,
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobileHeader, router])

  const watchedValues = useWatch({ control })

  const debouncedOnChange = useDebouncedCallback(onChange)
  useEffect(() => {
    debouncedOnChange(watchedValues as any)
    //  adding debouncedOnChange causes rerenders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedValues])

  const privateFieldValue = watch('private')

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit, onError)}>
      <VStack spacing="6" align="stretch">
        {!isMobile && (
          <Text textStyle="medium/large" color="label.primary">
            <Trans i18nKey="space:newspace.title" defaults="Create new space" />
          </Text>
        )}
        <FormControl id="name" isInvalid={!!errors?.name?.message}>
          <FormLabel htmlFor="name">
            <Trans
              i18nKey="space:newspace.name.label"
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
            <Input
              name="name"
              withLeftAddon
              placeholder={t('space:newspace.name.placeholder', 'i.e. Welcome')}
              ref={register(validator)}
            />
          </InputGroup>
          <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
        </FormControl>

        <TextareaInput
          name="description"
          label={t('space:newspace.description.label', 'Description')}
          helperText={t(
            'space:newspace.description.placeholder',
            'What is this space about?',
          )}
          ref={register}
          error={errors?.description?.message}
        />
        {/* <FormControl id="spaceType" isInvalid={Boolean(errors.spaceType)}>
          <FormLabel htmlFor="spaceType">
            <Trans
              i18nKey="space:newspace.spaceType.label"
              defaults="Space Type"
            />
          </FormLabel>
          <Controller
            name="spaceType"
            control={control}
            defaultValue={defaultValues.spaceType}
            render={({ onChange: onSpaceTypeChange, value, name }) => (
              <Select
                name={name}
                value={value}
                options={spaceTypes.map(spaceType => ({
                  label: spaceType.name,
                  value: spaceType,
                  disabled: spaceType?.name === 'Question' && !isQAEnabled,
                }))}
                onChange={onSpaceTypeChange}
              />
            )}
            rules={{
              required: t('space:newspace.spaceType.validation.required', {
                defaultValue: 'Space Type is required',
              }) as string,
            }}
          />
          {errors.spaceType &&
            (errors?.spaceType as any)?.type === 'required' && (
              <FormErrorMessage>
                {(errors?.spaceType as any)?.message}
              </FormErrorMessage>
            )}
        </FormControl> */}
        {spaceCollections?.length > 1 && (
          <FormControl
            id="spaceCollection"
            isInvalid={Boolean(errors.spaceCollection)}
          >
            <FormLabel htmlFor="spaceCollection">
              <Trans
                i18nKey="space:newspace.spaceCollection.label"
                defaults="Collection"
              />
            </FormLabel>
            <Controller
              name="spaceCollection"
              control={control}
              defaultValue={defaultValues.spaceCollection}
              render={({ onChange, value, name }) => (
                <Select
                  name={name}
                  value={value}
                  options={spaceCollections.map(collection => ({
                    label: collection.name,
                    value: collection,
                  }))}
                  onChange={onChange}
                />
              )}
              rules={{
                required: t(
                  'space:newspace.spaceCollection.validation.required',
                  {
                    defaultValue: 'Collection is required',
                  },
                ) as string,
              }}
            />
            {errors.spaceCollection &&
              (errors?.spaceCollection as any)?.type === 'required' && (
                <FormErrorMessage>
                  {(errors?.spaceCollection as any)?.message}
                </FormErrorMessage>
              )}
          </FormControl>
        )}

        <FormControl id="private" isInvalid={!!errors?.private}>
          <Flex justifyContent="space-between">
            <Box flexGrow={1}>
              <FormLabel htmlFor="private">
                <Trans
                  i18nKey="space:newspace.private.placeholder"
                  defaults="Make private"
                />
              </FormLabel>
              <FormHelperText>
                <Trans
                  i18nKey="space:newspace.private.helperText"
                  defaults="Only members can see who's in the space and what they post."
                />
              </FormHelperText>
            </Box>
            <Controller
              control={control}
              name="private"
              render={({ onChange, value }) => (
                <Switch
                  isChecked={value}
                  onChange={() => {
                    onChange(!value)

                    if (value) {
                      setValue(HIDDEN_SPACE_CHECKBOX_NAME, false)
                    }
                  }}
                />
              )}
            />
          </Flex>
          <FormErrorMessage>{errors?.private?.message}</FormErrorMessage>
        </FormControl>

        <FormControl
          isDisabled={!privateFieldValue}
          id={HIDDEN_SPACE_CHECKBOX_NAME}
          isInvalid={!!errors?.hidden}
        >
          <Flex justifyContent="space-between">
            <Box>
              <FormLabel htmlFor={HIDDEN_SPACE_CHECKBOX_NAME}>
                <Trans
                  i18nKey="space:newspace.hidden.placeholder"
                  defaults="Make hidden"
                />
              </FormLabel>
              <FormHelperText>
                <Trans
                  i18nKey="space:newspace.hidden.helperText"
                  defaults="Hide this space from non-space members."
                />
              </FormHelperText>
            </Box>
            <Controller
              control={control}
              name={HIDDEN_SPACE_CHECKBOX_NAME}
              render={({ onChange, value }) => (
                <Switch
                  isDisabled={!privateFieldValue}
                  isChecked={value}
                  onChange={e => onChange(e.target.checked)}
                />
              )}
            />
          </Flex>
          <FormErrorMessage>{errors?.hidden?.message}</FormErrorMessage>
        </FormControl>

        {!isMobile && (
          <Button
            isFullWidth
            buttonType="primary"
            disabled={!formState.isValid || formState.isSubmitting}
            isLoading={formState.isSubmitting}
            type="submit"
          >
            <Trans i18nKey="common:create" defaults="Create" />
          </Button>
        )}
      </VStack>
    </form>
  )
}
