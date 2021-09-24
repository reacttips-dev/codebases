import { useCallback, useState } from 'react'

import { useApolloClient } from '@apollo/client'
import axios from 'axios'

import { logger } from '@tribefrontend/logger'
import {
  TRANSFER_TO_NEW_DOMAIN,
  TransferToNewDomainMutation,
  TransferToNewDomainMutationVariables,
  ActionStatus,
} from 'tribe-api'
import { useToast } from 'tribe-components'
import { useTranslation } from 'tribe-translation'

import useGetNetwork from 'containers/Network/useGetNetwork'

export interface UseTransferToNewDomain {
  transfer: () => void
  loading: boolean
}

interface CheckDomainHealth {
  newDomain: string
  healthCheckCount: number
  onCompleted: () => void
  onError: (e: any) => void
}

async function checkDomainHealth({
  newDomain,
  healthCheckCount,
  onError,
  onCompleted,
}: CheckDomainHealth) {
  try {
    const _healthResponse = await axios.get(`https://${newDomain}/api/_health`)

    if (_healthResponse?.status !== 200 && !_healthResponse?.data?.success) {
      if (healthCheckCount >= 3) {
        throw _healthResponse
      } else if (process.env.NODE_ENV === 'test') {
        checkDomainHealth({
          newDomain,
          healthCheckCount: healthCheckCount + 1,
          onError,
          onCompleted,
        })
      } else if (typeof window !== 'undefined') {
        window.setTimeout(
          () =>
            checkDomainHealth({
              newDomain,
              healthCheckCount: healthCheckCount + 1,
              onError,
              onCompleted,
            }),
          10000,
        )
      }
    } else if (typeof onCompleted === 'function') {
      onCompleted()
    }
  } catch (error) {
    logger.error('error transfering to a new domain', error)
    if (typeof onError === 'function') {
      onError(error)
    }
  }
}

const useTransferToNewDomain = (): UseTransferToNewDomain => {
  const { network } = useGetNetwork()
  const apolloClient = useApolloClient()
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const { t } = useTranslation()

  const newDomain = network?.newDomain

  const errorToastMessage = useCallback(() => {
    toast({
      title: t('admin:domain.notSuccessful', 'Not successful'),
      description: t(
        'admin:domain.dnsSettingsNotProperlySetup',
        'DNS settings is not properly setup, please try again with the instruction.',
      ),
      status: 'error',
      isClosable: true,
    })
  }, [t, toast])

  const makeTransferToNewDomain = useCallback(async () => {
    try {
      const transferRes = await apolloClient.mutate<
        TransferToNewDomainMutation,
        TransferToNewDomainMutationVariables
      >({
        mutation: TRANSFER_TO_NEW_DOMAIN,
      })

      const succeed =
        transferRes?.data?.transferToNewDomain?.status ===
        ActionStatus?.SUCCEEDED

      if (!succeed) {
        errorToastMessage()
      }

      return succeed
    } catch (e) {
      logger.error('error transfering to a new domain', e)

      errorToastMessage()
    }
  }, [apolloClient, errorToastMessage])

  const transfer = useCallback(async () => {
    if (loading || !newDomain || newDomain === '') return

    setLoading(true)
    // call the transferMutation
    const succeeded = await makeTransferToNewDomain()
    if (!succeeded) {
      setLoading(false)
      return
    }

    // check for domain's health and redirect
    checkDomainHealth({
      newDomain,
      healthCheckCount: 1,
      onCompleted: () => {
        setLoading(false)
        window.location.href = `https://${newDomain}`
      },
      onError: () => {
        setLoading(false)
        errorToastMessage()
      },
    })
  }, [errorToastMessage, loading, newDomain, makeTransferToNewDomain])

  return {
    transfer,
    loading,
  }
}

export default useTransferToNewDomain
