import { useCallback, useEffect } from 'react'

import { ApolloError, FetchResult, gql, useMutation } from '@apollo/client'
import { GraphQLError } from 'graphql'

import { logger } from '@tribefrontend/logger'
import {
  AddNewDomainMutation,
  AddNewDomainMutationVariables,
  ADD_NEW_DOMAIN,
  DOMAIN_TRANSFER_STATUS,
} from 'tribe-api'

export type AddNewDomainFunc = (
  variables: AddNewDomainMutationVariables,
) => Promise<
  FetchResult<
    AddNewDomainMutation,
    Record<string, unknown>,
    Record<string, unknown>
  >
>

export interface UseAddNewDomain {
  addNewDomain: AddNewDomainFunc
  data?: AddNewDomainMutation | null
  error?: ApolloError
  loading: boolean
}

const useAddNewDomain = (): UseAddNewDomain => {
  const [addNewDomainMutation, { loading, data, error }] = useMutation<
    AddNewDomainMutation,
    AddNewDomainMutationVariables
  >(ADD_NEW_DOMAIN)

  const addNewDomain = useCallback(
    ({ domain }: AddNewDomainMutationVariables) =>
      addNewDomainMutation({
        variables: { domain },
        update: (cache, { data: fetchedData }) => {
          if (fetchedData?.addNewDomain) {
            cache.writeFragment({
              id: 'DomainTransferStatus:{}',
              fragment: DOMAIN_TRANSFER_STATUS,
              data: fetchedData.addNewDomain,
            })
          }

          cache.writeFragment({
            id: 'Network:{}',
            fragment: gql`
              fragment _ on Network {
                newDomain
              }
            `,
            data: {
              newDomain: domain,
            },
          })
        },
      }),
    [addNewDomainMutation],
  )

  useEffect(() => {
    if (error?.graphQLErrors && error.graphQLErrors.length > 0) {
      error?.graphQLErrors?.forEach(({ message }: GraphQLError): void => {
        logger.error('error while adding new domain', message)
      })
    }
  }, [error?.graphQLErrors])

  return {
    addNewDomain,
    data,
    error,
    loading,
  }
}

export default useAddNewDomain
