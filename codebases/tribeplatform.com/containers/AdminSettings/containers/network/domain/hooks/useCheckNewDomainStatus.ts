import { useEffect } from 'react'

import { ApolloError, ApolloQueryResult, useQuery } from '@apollo/client'
import { GraphQLError } from 'graphql'

import { logger } from '@tribefrontend/logger'
import {
  CheckNewDomainStatusQuery,
  CheckNewDomainStatusQueryVariables,
  CHECK_NEW_DOMAIN_STATUS,
  Network,
} from 'tribe-api'
import { useToast } from 'tribe-components'
import { useTranslation } from 'tribe-translation'

export interface UseCheckNewDomainStatus {
  checkNewDomainStatus: (
    variables?: CheckNewDomainStatusQueryVariables,
  ) => Promise<ApolloQueryResult<CheckNewDomainStatusQuery>>
  loading: boolean
  error?: ApolloError
  data?: CheckNewDomainStatusQuery | null
  domainStatus?: CheckNewDomainStatusQuery['checkNewDomainStatus']
}

const useCheckNewDomainStatus = (
  newDomain: Network['newDomain'],
): UseCheckNewDomainStatus => {
  const toast = useToast()
  const { t } = useTranslation()
  const { loading, data, error, refetch } = useQuery<
    CheckNewDomainStatusQuery,
    CheckNewDomainStatusQueryVariables
  >(CHECK_NEW_DOMAIN_STATUS, {
    variables: {
      domain: newDomain || '',
    },
    skip: !newDomain,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    onCompleted: data => {
      const success = data?.checkNewDomainStatus?.success

      if (success === false && newDomain) {
        toast({
          title: t('admin:domain.notSuccessful', 'Not successful'),
          description: t(
            'admin:domain.dnsSettingsNotProperlySetup',
            'DNS settings is not properly setup, please try again with the instruction.',
          ),
          status: 'error',
          isClosable: true,
        })
      }
    },
  })

  useEffect(() => {
    if (error?.graphQLErrors && error.graphQLErrors.length > 0) {
      error?.graphQLErrors?.forEach(({ message }: GraphQLError): void => {
        logger.error('error while checking new domain status', message)

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
    checkNewDomainStatus: refetch,
    domainStatus: data?.checkNewDomainStatus,
    loading,
    error,
    data,
  }
}

export default useCheckNewDomainStatus
