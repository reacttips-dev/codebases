import React from 'react'

import { HStack, VStack } from '@chakra-ui/react'
import { Controller, useForm } from 'react-hook-form'

import { SpaceCollection } from 'tribe-api'
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
} from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

const DEFAULT_VALUES = {
  name: '',
  description: '',
}

export interface EditSpaceCollectionFormInput extends Partial<SpaceCollection> {
  name: string
}
export interface EditSpaceCollectionFormProps {
  defaultValues?: EditSpaceCollectionFormInput
  onSubmit: (data: EditSpaceCollectionFormInput) => void
  onCancel?: () => void
}

export const EditSpaceCollectionForm = ({
  defaultValues = DEFAULT_VALUES,
  onSubmit,
  onCancel,
}: EditSpaceCollectionFormProps) => {
  const { handleSubmit, control, errors, formState } = useForm<
    EditSpaceCollectionFormInput
  >({
    defaultValues,
  })
  const { t } = useTranslation()

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing={4}>
        <FormControl id="name" isInvalid={Boolean(errors.name)}>
          <FormLabel textStyle="semibold/medium" color="label.primary">
            <Trans
              i18nKey="spaceCollection:editModal.name.title"
              defaults="Name"
            />
          </FormLabel>
          <Controller
            as={Input}
            name="name"
            placeholder={t(
              'spaceCollection:editModal.name.placeholder',
              'Choose a helpful name (e.g. Knowledge Base)',
            )}
            control={control}
            rules={{ required: true }}
          />
          <FormErrorMessage>
            <Trans
              i18nKey="spaceCollection:editModal.name.error.required"
              defaults="Please check the input."
            />
          </FormErrorMessage>
        </FormControl>

        <FormControl id="description" isInvalid={Boolean(errors.description)}>
          <FormLabel textStyle="semibold/medium" color="label.primary">
            <Trans
              i18nKey="spaceCollection:editModal.description.title"
              defaults="Description"
            />
          </FormLabel>
          <Controller
            as={Textarea}
            name="description"
            placeholder={t(
              'spaceCollection:editModal.description.placeholder',
              'What is this collection about? (e.g. Help articles for your community)',
            )}
            control={control}
          />
          <FormErrorMessage>
            <Trans
              i18nKey="spaceCollection:editModal.description.error.required"
              defaults="Please check the input."
            />
          </FormErrorMessage>
        </FormControl>

        <HStack justify="flex-end" width="full">
          <Button type="reset" variant="outline" onClick={onCancel}>
            <Trans i18nKey="common:actions.cancel" defaults="Cancel" />
          </Button>
          <Button
            type="submit"
            buttonType="primary"
            isDisabled={formState.isSubmitting}
            isLoading={formState.isSubmitting}
          >
            <Trans i18nKey="common:create" defaults="Create" />
          </Button>
        </HStack>
      </VStack>
    </form>
  )
}
