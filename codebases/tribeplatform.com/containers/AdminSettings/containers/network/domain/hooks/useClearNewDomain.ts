import { useCallback, useEffect } from 'react'

import { ApolloError, FetchResult, gql, useMutation } from '@apollo/client'
import { GraphQLError } from 'graphql'

import { logger } from '@tribefrontend/logger'
import {
  ClearNewDomainMutation,
  ClearNewDomainMutationVariables,
  CLEAR_NEW_DOMAIN,
} from 'tribe-api/graphql'
import { useToast } from 'tribe-components'
import { useTranslation } from 'tribe-translation'

export type ClearNewDomainFunc = () => Promise<
  FetchResult<
    ClearNewDomainMutation,
    Record<string, unknown>,
    Record<string, unknown>
  >
>

export interface UseClearNewDomain {
  clearNewDomain: ClearNewDomainFunc
  data?: ClearNewDomainMutation | null
  error?: ApolloError
  loading: boolean
}

const useClearNewDomain = (): UseClearNewDomain => {
  const toast = useToast()
  const { t } = useTranslation()

  const [clearNewDomainMutation, { loading, data, error }] = useMutation<
    ClearNewDomainMutation,
    ClearNewDomainMutationVariables
  >(CLEAR_NEW_DOMAIN)

  const clearNewDomain = useCallback(
    () =>
      clearNewDomainMutation({
        update: (cache, { data: fetchedData }) => {
          if (fetchedData?.clearNewDomain?.status === 'succeeded') {
            cache.writeFragment({
              id: 'Network:{}',
              fragment: gql`
                fragment _ on Network {
                  newDomain
                }
              `,
              data: {
                newDomain: '',
              },
            })

            cache.evict({ id: 'DomainTransferStatus:{}' })
            cache.gc()
          }
        },
      }),
    [clearNewDomainMutation],
  )

  useEffect(() => {
    if (error?.graphQLErrors && error.graphQLErrors.length > 0) {
      error?.graphQLErrors?.forEach(({ message }: GraphQLError): void => {
        logger.error('error while clearing new domain', message)

        toast({
          title: t('admin:domain.error', 'Error'),
          description: message,
          status: 'error',
          isClosable: true,
        })
      })
    }
  }, [error?.graphQLErrors, toast, t])

  return {
    clearNewDomain,
    loading,
    data,
    error,
  }
}

export default useClearNewDomain
