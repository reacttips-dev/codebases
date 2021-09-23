import React, { useCallback, useEffect, useState } from 'react'

import { Box, VStack } from '@chakra-ui/react'
import { GraphQLError } from 'graphql'
import isEmpty from 'lodash/isEmpty'
import { useForm } from 'react-hook-form'

import { logger } from '@tribefrontend/logger'
import { UpdateNetworkInput } from 'tribe-api'
import { Button, useToast } from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import {
  NetworkFormProps,
  NetworkFormValues,
} from 'containers/AdminSettings/containers/network/general/forms/NetworkForm/@types'
import NetworkFormImageUpload from 'containers/AdminSettings/containers/network/general/forms/NetworkForm/components/NetworkFormImageUpload'
import NetworkFormInput from 'containers/AdminSettings/containers/network/general/forms/NetworkForm/components/NetworkFormInput'

import useCreateImages from 'hooks/useCreateImages'
import useUpdateNetwork from 'hooks/useUpdateNetwork'

import { includesUrl } from 'utils/validator.utils'

const NetworkForm = ({ network }: NetworkFormProps) => {
  const defaultValues = {
    name: network?.name,
    privacyPolicyUrl: network?.privacyPolicyUrl,
    termsOfServiceUrl: network?.termsOfServiceUrl,
  }

  const toast = useToast()
  const { t } = useTranslation()
  const { handleSubmit, control, errors } = useForm<NetworkFormValues>({
    defaultValues,
    mode: 'onTouched',
  })
  const { upload, isUploading } = useCreateImages()
  const [images, setImages] = useState<{
    faviconId?: string
    logoId?: string
  }>()

  const {
    error: updateNetworkError,
    updateNetwork,
    loading,
  } = useUpdateNetwork()

  const handleFileChange = useCallback(
    async (files: FileList | File[], type: 'faviconId' | 'logoId') => {
      try {
        const result = await upload(
          Array.from(files).map(f => ({ imageFile: f })),
        )
        const { mediaId } = (result && result[0]) || {}

        setImages(_images => ({
          ..._images,
          [type]: mediaId,
        }))
      } catch (e) {
        setImages(_images => ({
          ..._images,
          [type]: undefined,
        }))
      }
    },
    [upload],
  )

  const validateUrl = useCallback(
    value => (value ? includesUrl(value) : true),
    [],
  )

  const onSubmit = useCallback(
    ({ name, privacyPolicyUrl, termsOfServiceUrl }: NetworkFormValues) => {
      const networkInput: UpdateNetworkInput = {
        ...(name && { name }),
        ...(privacyPolicyUrl && { privacyPolicyUrl }),
        ...(termsOfServiceUrl && { termsOfServiceUrl }),
        ...(images?.logoId && { logoId: images?.logoId }),
        ...(images?.faviconId && { faviconId: images?.faviconId }),
      }

      updateNetwork(networkInput)
    },
    [images?.faviconId, images?.logoId, updateNetwork],
  )

  useEffect(() => {
    if (
      updateNetworkError?.graphQLErrors &&
      updateNetworkError.graphQLErrors.length > 0
    ) {
      updateNetworkError?.graphQLErrors?.forEach(
        ({ message }: GraphQLError): void => {
          logger.error('error while checking new domain status', message)

          toast({
            title: t('admin:network.general.error', 'Error'),
            description: message,
            status: 'error',
            isClosable: true,
          })
        },
      )
    }
  }, [updateNetworkError?.graphQLErrors, toast, t])

  return (
    <Box as="form" flex="1" w="full" mt={0} onSubmit={handleSubmit(onSubmit)}>
      <Box display="flex" flexDirection={{ base: 'column', sm: 'row' }}>
        <NetworkFormImageUpload
          description={t(
            'admin:network.general.communityLogoDescription',
            'Recommended ratio of 2:1, at least 128px tall.',
          )}
          label={t('admin:network.general.communityLogo', 'Community logo')}
          onFileChange={files => handleFileChange(files, 'logoId')}
          src={network?.logo}
        />

        <NetworkFormImageUpload
          description={t(
            'admin:network.general.squaredLogoDescription',
            '1:1 ratio, ideal size of 512x512px. Also used as favicon and mobile home screen app icon.',
          )}
          label={t('admin:network.general.squaredLogo', 'Squared logo')}
          onFileChange={files => handleFileChange(files, 'faviconId')}
          src={network?.favicon}
          isSquared
        />
      </Box>

      <VStack spacing={4}>
        <NetworkFormInput
          control={control}
          defaultValue={defaultValues.name}
          errors={errors}
          label={t('admin:network.general.communityName', 'Community Name')}
          name="name"
          rules={{ required: true }}
        />

        <NetworkFormInput
          control={control}
          defaultValue={defaultValues.termsOfServiceUrl}
          errors={errors}
          label={t('admin:network.general.termsOfService', 'Terms of service')}
          name="termsOfServiceUrl"
          rules={{
            validate: validateUrl,
          }}
        />

        <NetworkFormInput
          control={control}
          defaultValue={defaultValues.privacyPolicyUrl}
          errors={errors}
          label={t('admin:network.general.privacyPolicy', 'Privacy policy')}
          name="privacyPolicyUrl"
          rules={{
            validate: validateUrl,
          }}
        />

        <Button
          alignSelf="flex-end"
          buttonType="primary"
          data-testid="form-submit-button"
          isDisabled={loading || isUploading || !isEmpty(errors)}
          isLoading={loading || isUploading}
          mr="auto"
          type="submit"
        >
          <Trans i18nKey="common:update" defaults="Update" />
        </Button>
      </VStack>
    </Box>
  )
}

export default NetworkForm
