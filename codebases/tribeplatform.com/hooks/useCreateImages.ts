import { useCallback, useState } from 'react'

import { useApolloClient } from '@apollo/client'
import axios from 'axios'

import {
  CreateImagesMutation,
  CreateImagesMutationVariables,
} from 'tribe-api/graphql'
import { CREATE_IMAGES } from 'tribe-api/graphql/media.gql'
import { CreateImageInput, SignedUrl } from 'tribe-api/interfaces'
import { useToast } from 'tribe-components'
import { useTranslation } from 'tribe-translation'

import { logger } from 'lib/logger'

import { parseXMLErrorMessage } from 'utils/xml.utils'

export type UploadedImage = Omit<
  SignedUrl,
  'signedUrl' | '__typename' | 'fields'
>

const useCreateImages = () => {
  const apolloClient = useApolloClient()
  const [isUploading, setUploading] = useState<boolean>(false)
  const api = axios.create({
    validateStatus: undefined,
  })
  const toast = useToast()
  const { t } = useTranslation()

  const upload = useCallback(
    async (
      input: Array<
        Pick<
          CreateImageInput,
          'cropX' | 'cropY' | 'cropHeight' | 'cropWidth'
        > & {
          imageFile: File
        }
      >,
    ): Promise<UploadedImage[] | undefined> => {
      if (!input?.length) return

      try {
        setUploading(true)
        const resultMedia: UploadedImage[] = []
        const { data, errors } = await apolloClient.mutate<
          CreateImagesMutation,
          CreateImagesMutationVariables
        >({
          mutation: CREATE_IMAGES,
          variables: {
            input: input.map(({ imageFile, ...cropData }) => ({
              contentType: imageFile.type,
              ...cropData,
            })),
          },
        })

        if (!data) {
          logger.error('error - mutating createImages', errors)

          if (errors) {
            throw errors
          } else {
            return
          }
        }

        if (data?.createImages?.length !== input.length) {
          logger.error('error - medias are not have same length as files')

          if (errors) {
            throw errors
          } else {
            return
          }
        }

        const promises = data.createImages.map((media, index) => {
          try {
            const { imageFile } = input[index]
            const { fields } = media
            const formData = new FormData()
            const parsedFields = JSON.parse(fields)

            // The order of appended key-value into the formData matters.
            Object.entries(parsedFields).forEach(([key, value]) => {
              formData.append(key, String(value))
            })
            formData.append('Content-Type', imageFile.type)
            formData.append('file', imageFile)

            return api
              .post(media.signedUrl, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
              })
              .then(res => {
                if (res?.status >= 200 && res?.status < 300) {
                  resultMedia.push({
                    mediaId: media.mediaId,
                    mediaUrl: media.mediaUrl,
                    urls: media.urls,
                  })
                } else {
                  const xmlErrorMessage = parseXMLErrorMessage(res?.data)

                  if (xmlErrorMessage) {
                    toast({
                      title: t('common:error', 'Error'),
                      description: xmlErrorMessage,
                      status: 'error',
                      isClosable: true,
                    })
                  }

                  logger.error(
                    'error - uploading media with status code of %s',
                    res?.status,
                    media,
                  )
                }
              })
              .catch(e => {
                logger.error('error - uploading media', media, e)

                toast({
                  title: t('common:error', 'Error'),
                  description: e?.message,
                  status: 'error',
                  isClosable: true,
                })

                return undefined
              })
          } catch (e) {
            logger.error('error - upload media', media, e)

            toast({
              title: t('common:error', 'Error'),
              description: e?.message,
              status: 'error',
              isClosable: true,
            })

            return undefined
          }
        })

        await Promise.all(promises.filter(Boolean))

        setUploading(false)

        return resultMedia
      } catch (errors) {
        if (errors && Array.isArray(errors) && errors?.length > 0) {
          errors?.forEach(({ message }): void => {
            if (message) {
              toast({
                title: t('common:error', 'Error'),
                description: message,
                status: 'error',
                isClosable: true,
              })
            }
          })
        } else if (errors && !Array.isArray(errors) && errors?.message) {
          toast({
            title: t('common:error', 'Error'),
            description: errors?.message,
            status: 'error',
            isClosable: true,
          })
        }

        setUploading(false)

        logger.error('error - uploading', errors)
      }
    },
    [api, apolloClient, t, toast],
  )

  return {
    upload,
    isUploading,
  }
}

export default useCreateImages
